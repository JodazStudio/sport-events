---
name: event-registration-logic
description: Guides the implementation of dual-path athlete registration and payment reporting flows with automated notifications.
---

# Event Registration Logic

This skill manages the two primary registration and payment reporting flows for athletes in the Zonacrono platform. It ensures consistency between the athlete's UI experience, email notifications, and the manager's dashboard/Telegram alerts.

## 1. Flow 1: Immediate Registration and Report (Ideal Path)

**Trigger**: Athlete fills data, transfers payment, and uploads the receipt in the same form.

### 👤 Athlete Perspective
- **UI Interaction**: After submission, redirect to a **Unique URL**.
- **Status Display**: Immediately shows **"En Revisión"** (In Review).
- **Email Notification**: Automatic "Registro y Comprobante Recibido" email.
  - **Content**: Confirmation of receipt + Link to Unique URL + Instruction to wait for validation to see Dorsal Number.

### 🏢 Manager Perspective
- **Telegram Alert**: Immediate notification via Bot (New athlete + Payment reported).
- **Dashboard**: Entry appears directly in the **"Reportados"** tab (skipping "Pendientes").

---

## 2. Flow 2: Registro y Reporte Diferido (Deferred Path)

**Trigger**: Athlete fills data but selects "Reportar pago más tarde" or submits without a receipt.

### Phase A: Reservation (Reserva de Cupo)
- **👤 Athlete Perspective**:
  - **UI Interaction**: Redirect to **Unique URL**.
  - **Status Display**: Shows Bank Details + **"Pago Pendiente"** status.
  - **Email Notification**: "Reserva de Cupo" email.
    - **Content**: Link to Unique URL + Warning: "Tienes hasta las 11:59 PM de hoy para reportar el pago o la reserva será cancelada".
- **🏢 Manager Perspective**:
  - **Notification**: None.
  - **Dashboard**: Entry appears in the **"Pendientes"** tab.

### Phase B: Reporting (Fase Reporte)
- **👤 Athlete Perspective**:
  - **UI Interaction**: Athlete visits the Unique URL later and uploads the receipt.
  - **Status Display**: URL updates to **"En Revisión"**.
  - **Email Notification**: Short confirmation email that the receipt was sent to the organizer.
- **🏢 Manager Perspective**:
  - **Telegram Alert**: Immediate notification via Bot.
  - **Dashboard**: Entry moves from **"Pendientes"** to **"Reportados"**.

---

## 3. Implementation Requirements

### Unique URL Generation
- Use a non-sequential, secure token or UUID for the athlete's private status page.
- URL Pattern: `zonacrono.com/status/[token]` or similar.

### State Transitions
- **`status` Enum**: `pending` (Flow 2A), `reported` (Flow 1 & Flow 2B), `approved`, `rejected`.
- **Logic**: Moving from `pending` to `reported` must trigger the Telegram alert and update the dashboard tab placement.

### Automated Notifications
- **Email Service**: Ensure templates for "Registro Exitoso", "Reserva de Cupo", and "Pago Recibido" are synchronized with these flows.
- **Telegram Bot**: Must be configured to listen for `reported` events and include the athlete's name and event in the alert.

---

## 4. Best Practices
- **Persistence**: Save the athlete's partial data immediately in Flow 2A to avoid data loss.
- **Clarity**: Always display the bank details clearly on the Unique URL for athletes in "Pago Pendiente".
- **Timers**: Implement the 11:59 PM expiration logic as a background job or a check during dashboard rendering.
