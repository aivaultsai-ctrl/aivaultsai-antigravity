# AIVaultsAI.one Production Deployment Checklist

## 1. Environment Variables Config
Ensure these are set in your Vercel Project Settings (Production).

| Variable | Description | Source |
|---|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Client SDK Key | Firebase Console > Project Settings |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Auth Domain | Firebase Console |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Project ID | Firebase Console |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Storage Bucket | Firebase Console |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`| Sender ID | Firebase Console |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | App ID | Firebase Console |
| `FIREBASE_SERVICE_ACCOUNT_KEY` | **Admin SDK JSON** (Minified) | GCP Console > IAM > Service Accounts > Create Key (JSON) |
| `GOOGLE_GEMINI_API_KEY` | Gemini 1.5 Pro Key | Google AI Studio |
| `STRIPE_SECRET_KEY` | Stripe Secret Key (Live) | Stripe Dashboard > Developers > Keys |
| `STRIPE_WEBHOOK_SECRET` | Signing Secret for Webhook | Stripe Dashboard > Developers > Webhooks (after creating endpoint) |
| `NEXT_PUBLIC_APP_URL` | Application URL (No trailing slash) | e.g., `https://aivaultsai.one` |

> **Critical**: `FIREBASE_SERVICE_ACCOUNT_KEY` must be the *entire JSON content* minified into a single line string.

## 2. Firebase Configuration
- [ ] **Authentication**: Enable "Email/Password" and "Google" providers in Firebase Console.
- [ ] **Auth Domains**: Add `aivaultsai.one` to "Authorized Domains" in Firebase Auth settings.
- [ ] **Firestore**: Ensure database is created in `production` mode (not test mode).
- [ ] **Rules**: Deploy `firestore.rules` using Firebase CLI:
  ```bash
  firebase deploy --only firestore:rules
  ```
- [ ] **Indexes**: Watch the Vercel logs. If a query requires an index, Firestore will provide a link to create it instantly.

## 3. Stripe Setup
- [ ] **Products**: Create a Product "Pro Plan" in Stripe Dashboard.
- [ ] **Pricing**: Create a Price for €49/month. Copy the `price_...` ID.
- [ ] **Code Update**: Update `src/lib/stripe.ts` with the REAL Price ID.
- [ ] **Webhook**: 
  - Create an endpoint in Stripe pointing to: `https://aivaultsai.one/api/stripe/webhook`
  - Events to listen for: `checkout.session.completed`.
  - Copy the `whsec_...` secret to Vercel Env Vars.

## 4. Vercel Deployment
1. **Push Code**: Commit all changes and push to GitHub/GitLab.
2. **Import Project**: Go to Vercel, import the repository.
3. **Framework**: Select Next.js.
4. **Environment Variables**: Paste all variables from Section 1.
5. **Deploy**: Click "Deploy".
6. **Domain**: Go to Settings > Domains and add `aivaultsai.one`.

## 5. Post-Deployment Verification (Smoke Tests)
- [ ] **Login**: Sign up with a fresh email.
- [ ] **Dashboard Check**: Verify "Free Plan" is shown in Settings.
- [ ] **Hire Employee**: Try to "Hire Employee".
  - *Expected*: Upgrade Modal appears.
- [ ] **Upgrade Flow**: Click "Upgrade", complete connection with Stripe Test/Live card.
  - *Expected*: Redirect to Dashboard?checkout_success=true.
  - *Verify*: Settings now show "Pro Plan".
  - *Verify*: "Hire Employee" now creates a new agent.
- [ ] **Chat**: Send a message to the new employee.
  - *Verify*: Streaming response works (Gemini 1.5 Pro).
- [ ] **Lead Capture**: Ask the agent "I want to buy services, my email is test@test.com".
  - *Verify*: Lead appears in `Leads` tab.

## 6. Error Monitoring
- Check **Vercel Logs** function tab for any server-side exceptions.
- Monitor **Stripe Dashboard > Webhooks** for failed delivery attempts.

**Status**: READY FOR LAUNCH 🚀
