# ==============================================
# SHIELD MODE & NOTIFICATION CONFIGURATION
# ==============================================

# Twilio Configuration (Required for SMS/WhatsApp notifications)
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+31612345678

# Optional: WhatsApp Business Account via Twilio
TWILIO_WHATSAPP_NUMBER=+31612345678

# ==============================================
# AI CONFIGURATION
# ==============================================

# OpenAI API Key (voor AI extractie in processLead.job.ts)
OPENAI_API_KEY=sk-...

# Google Gemini API Key (voor chat routes)
GOOGLE_GEMINI_API_KEY=your_gemini_key_here

# ==============================================
# EXAMPLE: Tenant notification preferences
# ==============================================
# These would typically come from your Prisma database,
# but you can set defaults here for testing:

# DEFAULT_NOTIFICATION_PHONE=+31612345678
# DEFAULT_PREFER_WHATSAPP=true
