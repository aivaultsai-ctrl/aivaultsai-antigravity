/**
 * Elite Multi-Tenant Shield System Prompts
 * 
 * Deze prompts zijn geoptimaliseerd voor:
 * - Voice AI (VAPI/Retell) met lage latentie
 * - Strikte data-extractie naar database kolommen
 * - Multi-tenant support met variabele injectie
 * - Shield Mode voor financiële escalaties
 */

export interface PromptVariables {
    tenant_name: string;
    tenant_id: string;
    faq_context?: string;
}

/**
 * Hoofdprompt voor de AI Assistant
 * Supports template variabelen: {{tenant_name}}, {{tenant_id}}, {{faq_context}}
 */
export const SHIELD_SYSTEM_PROMPT = `# ROLE
Je bent de Senior Digitale Assistent van {{tenant_name}}. Je bent kalm, intelligent en filtert alle inkomende communicatie.

# OPERATIONAL MODES (STRIKT)
Je bepaalt direct de modus op basis van de input van de beller:

## 1. SALES MODE (Default)
- Trigger: Vragen over diensten, prijzen, planning, of algemene FAQ.
- Gedrag: Behulpzaam, commercieel, proactief.
- Actie: Gebruik de FAQ-context. Leg de lead vast via \`extract_lead_info\`.

## 2. SHIELD MODE (Kritiek)
- Trigger: Woorden als "factuur", "betaling", "incasso", "deurwaarder", "geld tegoed".
- Gedrag: Formeel, kortaf, de-escalerend.
- Regels: 
    - Doe GEEN toezeggingen. 
    - Zeg NOOIT "we gaan betalen". 
    - Herhaal: "Ik ben niet bevoegd voor financiële zaken. Wij handelen dit uitsluitend schriftelijk af voor onze administratie."
- Actie: Leg de financiële info vast via \`extract_shield_info\`.

# DATA EXTRACTIE TOOLS
Je MOET de volgende functies aanroepen zodra de informatie beschikbaar is:

### Tool: extract_lead_info
- customerName: Naam van de beller.
- intent: "LEAD" of "FAQ".
- summary: Korte omschrijving van de vraag.

### Tool: extract_shield_info
- invoiceNumber: Het genoemde factuurnummer (indien niet genoemd, vraag er specifiek naar).
- intent: Altijd "FINANCIAL".
- priority: "CRITICAL" als er wordt gedreigd, anders "HIGH".
- summary: Welk bedrijf belt en waarover specifiek.

# SYSTEEM CONTEXT
- Bedrijf: {{tenant_name}}
- Tenant ID: {{tenant_id}} (Niet hardop uitspreken, alleen gebruiken voor metadata)

{{faq_context}}`;

/**
 * Tool definitions voor VAPI/Retell function calling
 * Deze zorgen ervoor dat de AI exact de juiste data-structuur teruggeeft
 */
export const AI_FUNCTION_DEFINITIONS = [
    {
        name: "extract_shield_info",
        description: "Gebruik deze functie wanneer iemand belt over facturen, schulden of betalingen.",
        parameters: {
            type: "object",
            properties: {
                invoiceNumber: {
                    type: "string",
                    description: "Het factuurnummer waarover gebeld wordt."
                },
                intent: {
                    type: "string",
                    enum: ["FINANCIAL"],
                    description: "Intent type - altijd FINANCIAL voor Shield Mode"
                },
                priority: {
                    type: "string",
                    enum: ["HIGH", "CRITICAL"],
                    description: "HIGH voor normale claims, CRITICAL bij dreiging"
                },
                summary: {
                    type: "string",
                    description: "Samenvatting van de claim en wie er belt"
                },
                companyName: {
                    type: "string",
                    description: "Naam van het bedrijf dat belt (incasso, schuldeiser, etc.)"
                }
            },
            required: ["intent", "priority", "summary"]
        }
    },
    {
        name: "extract_lead_info",
        description: "Gebruik deze functie voor normale klanten en nieuwe leads.",
        parameters: {
            type: "object",
            properties: {
                customerName: {
                    type: "string",
                    description: "Volledige naam van de beller"
                },
                phoneNumber: {
                    type: "string",
                    description: "Telefoonnummer van de beller (indien verstrekt)"
                },
                email: {
                    type: "string",
                    description: "Email van de beller (indien verstrekt)"
                },
                intent: {
                    type: "string",
                    enum: ["LEAD", "FAQ"],
                    description: "LEAD voor verkoop, FAQ voor informatievragen"
                },
                summary: {
                    type: "string",
                    description: "Korte samenvatting van de vraag/interesse"
                }
            },
            required: ["intent", "summary"]
        }
    }
] as const;

/**
 * Type-safe interface voor Shield Info extractie
 * Aligned met Prisma CallIntent/CallMode/CallPriority enums
 */
export interface ShieldInfoExtraction {
    invoiceNumber?: string;
    intent: "FINANCIAL";
    priority: "HIGH" | "CRITICAL";
    summary: string;
    companyName?: string;
}

/**
 * Type-safe interface voor Lead Info extractie
 */
export interface LeadInfoExtraction {
    customerName?: string;
    phoneNumber?: string;
    email?: string;
    intent: "LEAD" | "FAQ";
    summary: string;
}

/**
 * Hulpfunctie om template variabelen te injecteren in de prompt
 */
export function injectPromptVariables(
    template: string,
    variables: PromptVariables
): string {
    let result = template;

    // Replace template variables
    result = result.replace(/\{\{tenant_name\}\}/g, variables.tenant_name);
    result = result.replace(/\{\{tenant_id\}\}/g, variables.tenant_id);

    // FAQ context is optional
    if (variables.faq_context) {
        result = result.replace(/\{\{faq_context\}\}/g, `\n# FAQ CONTEXT\n${variables.faq_context}`);
    } else {
        result = result.replace(/\{\{faq_context\}\}/g, '');
    }

    return result;
}

/**
 * Helper function om te checken of een gesprek Shield Mode triggert
 */
export function detectShieldMode(transcript: string): boolean {
    const shieldTriggers = [
        'factuur',
        'betaling',
        'betalen',
        'incasso',
        'deurwaarder',
        'geld tegoed',
        'schuld',
        'openstaand',
        'vordering',
        'herinnering'
    ];

    const lowerTranscript = transcript.toLowerCase();
    return shieldTriggers.some(trigger => lowerTranscript.includes(trigger));
}
