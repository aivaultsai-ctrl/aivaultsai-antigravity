export interface AIExtractionResult {
    customer_name: string | null;
    phone_number: string | null;
    email: string | null;
    invoice_number: string | null;
    company_name: string | null;
    contact_name: string | null;
    intent: 'LEAD' | 'FAQ' | 'FINANCIAL' | 'SPAM';
    mode: 'SALES' | 'DEFENSIVE';
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    urgency: 'laag' | 'normaal' | 'hoog'; // Keep for backward compatibility if needed, or map to priority
    summary: string | null;
    appointment_request: boolean;
    is_faq: boolean;
}

export interface AIExtractionInput {
    transcript: string;
    faqContext: Array<{
        question: string;
        answer: string;
    }>;
    systemPrompt: string;
}
