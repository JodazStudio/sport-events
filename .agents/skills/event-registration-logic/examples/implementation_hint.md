# Implementation Hint: Status Transitions

This example shows how to handle the transition from "Pending" to "Reported" when an athlete uploads a receipt via their unique URL.

```typescript
// src/features/registrations/actions.ts

export async function reportPayment(token: string, receiptImage: File) {
  // 1. Upload receipt to storage (Supabase Storage)
  const receiptUrl = await uploadReceipt(receiptImage);

  // 2. Update registration status in DB
  const { data, error } = await supabase
    .from('registrations')
    .update({ 
      status: 'reported',
      receipt_url: receiptUrl,
      reported_at: new Date().toISOString()
    })
    .eq('unique_token', token)
    .select('*, athlete:athletes(*), event:events(*)')
    .single();

  if (error) throw error;

  // 3. Trigger Notifications
  await Promise.all([
    sendEmail({
      to: data.athlete.email,
      template: 'payment_received_confirmation',
      data: { name: data.athlete.first_name }
    }),
    sendTelegramAlert({
      message: `🔔 Pago Reportado: ${data.athlete.first_name} ${data.athlete.last_name} para ${data.event.name}`
    })
  ]);

  return data;
}
```

### Dashboard Query Logic

To separate the tabs in the manager dashboard:

```typescript
// Pendientes
const { data: pending } = await supabase
  .from('registrations')
  .select('*')
  .eq('status', 'pending');

// Reportados
const { data: reported } = await supabase
  .from('registrations')
  .select('*')
  .eq('status', 'reported');
```
