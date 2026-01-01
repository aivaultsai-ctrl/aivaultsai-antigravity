# ⚡ VAPI Configuration Quick Reference

## 🎯 **COPY-PASTE CHECKLIST**

### Step 1: Tool Definition
```
📂 File: vapi-config/tool-definitions.json
📋 Where: VAPI Dashboard → Tools → Add New Tool
🔧 Paste: COMPLETE file contents
✅ Verify: Tool name = "extract_call_details"
```

### Step 2: System Prompt  
```
📂 File: vapi-config/system-prompt.md
📋 Where: VAPI Dashboard → Assistant → System Prompt
🔧 Action: 
   1. Copy COMPLETE contents
   2. Replace {{tenant_name}} → "Jouw Bedrijf BV"
   3. Replace {{tenant_id}} → "tenant_123"
   4. Paste in System Prompt field
✅ Verify: SALES MODE and SHIELD MODE sections visible
```

### Step 3: Test Call Script
```
📞 Say: "Ik bel over factuur 2024-001"

Expected AI Response:
✅ "Mag ik vragen van welk bedrijf u belt?"
✅ "Ik ben niet bevoegd voor financiële zaken"
✅ "Wij handelen dit schriftelijk af"

Expected Tool Call:
✅ mode: "DEFENSIVE"
✅ intent: "FINANCIAL"
✅ priority: "HIGH"
✅ invoiceNumber: "2024-001"
```

---

## 🛡️ **SHIELD MODE TRIGGERS**

AI should activate DEFENSIVE mode when hearing:
- ✅ "factuur"
- ✅ "betaling" / "betalen"
- ✅ "incasso"
- ✅ "deurwaarder"
- ✅ "geld tegoed"
- ✅ "schuld"
- ✅ "vordering"
- ✅ "openstaand"

---

## 📊 **ENUM MAPPING REFERENCE**

### CallIntent
```
LEAD      → Nieuwe klant / verkoop
FAQ       → Informatievraag
FINANCIAL → Factuur / betaling / incasso
SPAM      → Ongewenste call
```

### CallMode
```
SALES     → Normale klantinteractie
DEFENSIVE → Shield Mode (financieel)
```

### CallPriority  
```
LOW      → Routinevraag (FAQ)
MEDIUM   → Normale lead
HIGH     → Belangrijk / financiële claim
CRITICAL → Dreiging / escalatie
```

---

## ✅ **VERIFICATION CHECKLIST**

After configuration:

**Dashboard Checks**:
- [ ] Tool "extract_call_details" exists
- [ ] Tool has 10 properties (customerName, intent, mode, etc.)
- [ ] Enums show correct values
- [ ] System Prompt contains "SHIELD MODE"
- [ ] System Prompt contains tool usage protocol

**Test Call Checks**:
- [ ] AI responds in Dutch
- [ ] AI asks for factuurnummer bij FINANCIAL
- [ ] AI uses de-escalation language
- [ ] Tool is called before call ends
- [ ] Webhook receives tool result

**Database Checks** (na webhook):
- [ ] Lead created in database
- [ ] mode = "DEFENSIVE" voor Shield calls
- [ ] invoiceNumber populated
- [ ] priority reflects urgency

---

## 🚨 **TROUBLESHOOTING**

### "Tool niet aangeroepen"
→ Check: System Prompt bevat "extract_call_details"?
→ Check: Scenario voorbeelden staan in prompt?

### "Verkeerde enum waarde in database"
→ Check: Tool definition enums exact matchen Prisma?
→ Check: LEAD != Lead (case-sensitive!)

### "AI doet toezeggingen in Shield Mode"
→ Check: De-escalation language in System Prompt?
→ Check: "Doe GEEN toezegging" staat in SHIELD rules?

---

## 📞 **SUPPORT**

**Files**:
- Full guide: `TASK_2_CONFIGURATION_GUIDE.md`
- Tool JSON: `vapi-config/tool-definitions.json`
- Prompt: `vapi-config/system-prompt.md`

**Next Step**: Report back when VAPI is configured!
