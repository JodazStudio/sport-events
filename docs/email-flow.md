# Email Notifications & Improved Registration Flow (Email Focus)

This plan outlines the implementation of email notifications for athletes using **Resend** with the domain `zonacrono.com`, focusing exclusively on the email communication flow.

## User Review Required

> [!IMPORTANT]
> This implementation will use **Resend**.
> The following environment variable must be configured:
> - `RESEND_API_KEY`: API key from the Resend dashboard.
> - The domain `zonacrono.com` must be verified in Resend to send from `notificaciones@zonacrono.com`.

> [!WARNING]
> The current status page (`/status/[id]`) will be updated to include a form for uploading payments. This is critical for Flow 2 (Diferido).

## Proposed Changes

### 1. Infrastructure & Utilities

#### [MODIFY] [env.ts](file:///home/jesus/projects/jodaz/zonacrono/src/lib/env.ts)
- Add `RESEND_API_KEY`.
- Ensure `NEXT_PUBLIC_APP_URL` is correctly configured for unique links.

#### [NEW] [mail.ts](file:///home/jesus/projects/jodaz/zonacrono/src/lib/mail.ts)
- Create a utility to send emails using `resend`.
- Implement wrapper functions for each notification type.
- Use `notificaciones@zonacrono.com` as the sender.

### 2. Email Templates (React Email)

#### [NEW] [RegistrationReceived.tsx](file:///home/jesus/projects/jodaz/zonacrono/src/components/emails/RegistrationReceived.tsx)
- **Flow 1**: Sent when registration and payment are received together.
- Content: "Hemos recibido tu inscripción y tu reporte de pago. El organizador lo está validando..."

#### [NEW] [ReservationConfirmed.tsx](file:///home/jesus/projects/jodaz/zonacrono/src/components/emails/ReservationConfirmed.tsx)
- **Flow 2**: Sent when registration is done without immediate payment.
- Content: Unique link and warning: "Tienes hasta las 11:59 PM de hoy..."

#### [NEW] [PaymentReported.tsx](file:///home/jesus/projects/jodaz/zonacrono/src/components/emails/PaymentReported.tsx)
- **Flow 2 (Report)**: Sent when payment is reported later via the unique link.
- Content: "Hemos recibido tu comprobante de pago..."

### 3. API Routes

#### [MODIFY] [route.ts](file:///home/jesus/projects/jodaz/zonacrono/src/app/api/registrations/route.ts)
- Integrate email sending logic via `resend`.
- Flow 1: Send `RegistrationReceived` email.
- Flow 2: Send `ReservationConfirmed` email.

#### [NEW] [route.ts](file:///home/jesus/projects/jodaz/zonacrono/src/app/api/registrations/%5Bid%5D/report/route.ts)
- New endpoint to handle payment reporting for an existing registration.
- Updates registration status to `REPORTED`.
- Triggers `PaymentReported` email to the athlete.

### 4. UI Components

#### [NEW] [ReportPaymentForm.tsx](file:///home/jesus/projects/jodaz/zonacrono/src/components/events/ReportPaymentForm.tsx)
- A client component for the status page.
- Handles file upload and calls the reporting API.

#### [MODIFY] [page.tsx](file:///home/jesus/projects/jodaz/zonacrono/src/app/status/%5Bid%5D/page.tsx)
- Render the `ReportPaymentForm` if the registration status is `PENDING`.

## Verification Plan

### Automated Tests
- Test API endpoints with and without payment data using `curl` or Postman.
- Verify email delivery using Resend logs.

### Manual Verification
1. Register an athlete with immediate payment (Flow 1).
   - Check if email from `notificaciones@zonacrono.com` is received.
2. Register an athlete without payment (Flow 2).
   - Check if "Reserva" email is received with link.
3. Access the unique link and report payment.
   - Check if confirmation email is received.
   - Verify status changes to "Pago Reportado" in the UI.
