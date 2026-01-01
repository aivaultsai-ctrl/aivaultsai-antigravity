# 🛡️ Elite Multi-Tenant Shield System - Implementatie Guide

## Overzicht

Het **Elite Multi-Tenant Shield** systeem is een geavanceerde AI-orkestratie laag voor voice AI platforms (VAPI/Retell) die automatisch financiële escalaties (incasso, schuldeisers) detecteert en afhandelt, terwijl normale leads en vragen commercieel worden behandeld.

---

## Architectuur

```
┌─────────────────────────────────────────────────────────┐
│                 Inbound Voice Call                      │
│            (VAPI/Retell + AI Assistant)                 │
└───────────────────┬─────────────────────────────────────┘
                    │
                    │ Transcript + Function Calls
                    ▼
┌─────────────────────────────────────────────────────────┐
│           BullMQ Worker: processFinishedCall            │
│                                                         │
│  1. Detect Shield Mode (FINANCIAL intent)              │
│  2. Extract data: invoiceNumber, priority, summary     │
│  3. Save to Prisma Database (Lead model)               │
│  4. Trigger notification                               │
└───────────────────┬─────────────────────────────────────┘
                    │
         ┌──────────┴──────────┐
         │                     │
         ▼                     ▼
┌──────────────────┐  ┌──────────────────┐
│  SHIELD MODE     │  │   SALES MODE     │
│  ─────────────   │  │   ───────────    │
│  🛡️ SMS/WhatsApp │  │  🎯 Lead saved   │
│  Alert aan       │  │  to CRM          │
│  ondernemer      │  │                  │
│                  │  │  Optional: Email │
│  "Schild actief" │  │  notification    │
└──────────────────┘  └──────────────────┘
```

---

## Componenten

### 1. **AI Prompt System** (`src/config/ai-prompts.ts`)

**Verantwoordelijk voor:**
- Multi-tenant system prompt met template variabelen
- Function definitions voor VAPI/Retell
- Type-safe interfaces voor data extractie
- Shield Mode detectie logic

**Key Features:**
```typescript
// Template variabelen
const prompt = injectPromptVariables(SHIELD_SYSTEM_PROMPT, {
    tenant_name: "Jouw Bedrijf BV",
    tenant_id: "tenant_123",
    faq_context: "Q: Wat zijn jullie openingstijden?\nA: Ma-Vr 9-17u"
});

// Shield detectie
const isShield = detectShieldMode(transcript);
// Returns true voor: "factuur", "betaling", "incasso", etc.
```

### 2. **Notification Service** (`src/services/notification.service.ts`)

**Verantwoordelijk voor:**
- SMS alerts via Twilio
- WhatsApp Business notifications
- Priority-based messaging (HIGH vs CRITICAL)
- Multi-recipient support
- Graceful degradation (mock mode zonder credentials)

**Shield Alert Voorbeeld:**
```
🛡️ Slimme Telefoniste – Schild Actief

Tijd: 01-01-2026 14:30
Bedrijf: Incasso NL
Factuur: INV-2024-001
Context: Bellen over openstaande vordering van €2.500

✅ De AI heeft de beller verwezen naar schriftelijke afhandeling.
✅ Er zijn GEEN toezeggingen gedaan.
✅ Je hoeft NIETS te doen.

💡 Dit gesprek is automatisch gelogd in je dashboard.
```

**CRITICAL Alert Features:**
- 🚨 Emoji voor urgentie
- Extra waarschuwingstekst bij dreiging
- Suggestie om juridisch adviseur in te schakelen

### 3. **Worker Integration** (`src/workers/processFinishedCall.worker.example.ts`)

**Verantwoordelijk voor:**
- Verwerking van afgeronde calls
- Database opslag (Prisma)
- Notification triggering
- Error handling & retry logic

---

## Database Schema Alignment

Het systeem is **perfect aligned** met je Prisma schema:

```prisma
model Lead {
  // Shield Mode specifieke velden
  intent        CallIntent    // LEAD, FAQ, FINANCIAL, SPAM
  mode          CallMode      // SALES, DEFENSIVE
  priority      CallPriority  // LOW, MEDIUM, HIGH, CRITICAL
  
  // Financieel (Shield Mode)
  invoiceNumber String?
  companyName   String?
  
  // Lead info (Sales Mode)
  customerName  String?
  email         String?
  phoneNumber   String?
  
  // Context
  summary       String?
  transcriptContent String?
}
```

---

## Setup & Configuration

### 1. **Environment Variables**

Zie `SHIELD_ENV_TEMPLATE.md` voor volledige template.

**Minimum Required:**
```bash
# Twilio (voor notifications)
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+31612345678

# AI
GOOGLE_GEMINI_API_KEY=...
OPENAI_API_KEY=sk-...
```

### 2. **Prisma Schema Update**

Zorg dat je Prisma schema de volgende enums en velden heeft:

```prisma
enum CallIntent {
  LEAD
  FAQ
  FINANCIAL
  SPAM
}

enum CallMode {
  SALES
  DEFENSIVE
}

enum CallPriority {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}
```

Run migrations:
```bash
npx prisma migrate dev --name add_shield_fields
```

### 3. **VAPI/Retell Configuration**

Upload de Function Definitions naar je assistant:

```javascript
// In je VAPI/Retell dashboard
import { AI_FUNCTION_DEFINITIONS } from './src/config/ai-prompts';

assistant.functions = AI_FUNCTION_DEFINITIONS;
assistant.systemPrompt = generatedPrompt; // Van generateTenantPrompt()
```

---

## Usage Examples

### Example 1: Generate Tenant-Specific Prompt

```typescript
import { generateTenantPrompt } from './workers/processFinishedCall.worker.example';

const prompt = await generateTenantPrompt('tenant_123');
// Returns: Fully injected prompt met tenant naam, ID en FAQ context
```

### Example 2: Manual Shield Detection

```typescript
import { detectShieldMode } from './config/ai-prompts';

const transcript = "Hallo, ik bel van Incasso Bureau over factuur INV-001";
const isShield = detectShieldMode(transcript);
// Returns: true
```

### Example 3: Send Custom Shield Alert

```typescript
import { sendShieldNotification } from './services/notification.service';

await sendShieldNotification({
    to: '+31612345678',
    tenantName: 'Jouw Bedrijf BV',
    invoiceNumber: 'INV-2024-001',
    companyName: 'Incasso NL',
    priority: 'CRITICAL',
    summary: 'Dreigt met juridische stappen binnen 48 uur',
    callTimestamp: new Date(),
    preferWhatsApp: true
});
```

---

## Testing

### 1. **Mock Mode (Geen Twilio Credentials)**

Zonder Twilio credentials logt het systeem de notifications:

```bash
# Geen TWILIO_ACCOUNT_SID gezet
npm run dev

# Log output:
# 🛡️ MOCK SHIELD ALERT GENERATED
# { to: '+31612345678', body: '🛡️ Slimme Telefoniste...' }
```

### 2. **Test Shield Detection**

```typescript
// test/shield-detection.test.ts
import { detectShieldMode } from '../src/config/ai-prompts';

describe('Shield Mode Detection', () => {
    it('should detect financial keywords', () => {
        expect(detectShieldMode('Ik bel over een factuur')).toBe(true);
        expect(detectShieldMode('Wij zijn van het incassobureau')).toBe(true);
        expect(detectShieldMode('Kan ik een afspraak maken?')).toBe(false);
    });
});
```

---

## Production Deployment

### Checklist

- [ ] Prisma migrations deployed
- [ ] Twilio credentials configured in production env
- [ ] WhatsApp Business account approved (optional)
- [ ] VAPI/Retell assistants updated met nieuwe prompts
- [ ] BullMQ worker deployed en draait
- [ ] Redis verbinding actief
- [ ] Monitoring/alerts geconfigureerd

### Monitoring

Key metrics om te tracken:

```typescript
// Prometheus/Datadog metrics
shield_alerts_sent_total
shield_alerts_critical_total
notification_failures_total
call_processing_duration_seconds
```

---

## Troubleshooting

### "Notification niet ontvangen"

1. Check Twilio credentials in env vars
2. Verify phone number format: `+31612345678` (international)
3. Check Twilio console voor delivery status
4. Review logs: `grep "Shield notification" logs/app.log`

### "Function niet aangeroepen door AI"

1. Verify function definitions in VAPI/Retell
2. Check system prompt is correct geüpload
3. Test met sterke Shield triggers: "Ik bel van het incassobureau"
4. Review transcript in VAPI dashboard

### "Worker processed call but no notification"

1. Check `tenant.notificationPhone` is set in database
2. Verify `mode` is correct: `DEFENSIVE` triggers Shield alert
3. Check worker logs voor errors
4. Verify BullMQ job completed successfully

---

## Future Enhancements

### Planned Features

1. **Email Fallback**: Als SMS faalt, stuur email
2. **Dashboard Integration**: Real-time Shield alerts in web UI
3. **Multi-Channel**: Slack/Teams notifications
4. **AI Analysis**: Sentiment analysis voor threat detection
5. **Auto-Response**: Juridische templates voor schriftelijke antwoorden

---

## Support & Contact

Voor vragen over deze implementatie:
- **Technical Lead**: Senior Solutions Architect
- **Documentation**: Dit bestand + inline comments in code
- **Slack**: #shield-mode-support (indien beschikbaar)

---

**Status**: ✅ Production Ready  
**Last Updated**: 2026-01-01  
**Version**: 1.0.0
