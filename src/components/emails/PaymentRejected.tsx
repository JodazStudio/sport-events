import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface PaymentRejectedEmailProps {
  athleteName: string;
  eventName: string;
  statusUrl: string;
  reason?: string;
}

export function PaymentRejectedEmail({
  athleteName,
  eventName,
  statusUrl,
  reason,
}: PaymentRejectedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        Información importante sobre tu pago — {eventName}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={headerSection}>
            <Heading style={logo}>
              Zona<span style={logoAccent}>crono</span>
            </Heading>
          </Section>

          <Section style={contentSection}>
            <Heading style={heading}>Pago No Aprobado</Heading>

            <Text style={greeting}>Hola {athleteName},</Text>

            <Text style={paragraph}>
              Te informamos que tu reporte de pago para el evento <strong>{eventName}</strong> no ha podido ser aprobado por el organizador.
            </Text>

            {reason && (
              <Section style={reasonBox}>
                <Text style={reasonTitle}>Motivo indicado:</Text>
                <Text style={reasonText}>{reason}</Text>
              </Section>
            )}

            <Section style={infoBox}>
              <Text style={infoText}>
                <strong>¿Qué debo hacer?</strong><br />
                Por favor, verifica los datos de tu transferencia y asegúrate de haber subido el comprobante correcto. Puedes intentar reportar el pago nuevamente desde tu página de estado.
              </Text>
            </Section>

            <Section style={buttonContainer}>
              <Button style={button} href={statusUrl}>
                Reportar Pago Nuevamente
              </Button>
            </Section>

            <Hr style={hr} />

            <Text style={footer}>
              Si tienes dudas, por favor contacta directamente con el organizador del evento.
              Este correo fue enviado automáticamente por Zonacrono.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// --- Styles ---
const main: React.CSSProperties = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container: React.CSSProperties = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  maxWidth: '600px',
  border: '2px solid #0a0a0a',
};

const headerSection: React.CSSProperties = {
  backgroundColor: '#0a0a0a',
  padding: '24px 32px',
  textAlign: 'center' as const,
};

const logo: React.CSSProperties = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 900,
  fontStyle: 'italic',
  letterSpacing: '-0.05em',
  margin: 0,
};

const logoAccent: React.CSSProperties = {
  color: '#d50f17', // brand-red
};

const contentSection: React.CSSProperties = {
  padding: '32px',
};

const heading: React.CSSProperties = {
  color: '#d50f17', // Red for rejection
  fontSize: '24px',
  fontWeight: 800,
  letterSpacing: '-0.02em',
  margin: '0 0 16px',
};

const greeting: React.CSSProperties = {
  fontSize: '16px',
  color: '#333',
  margin: '0 0 12px',
};

const paragraph: React.CSSProperties = {
  fontSize: '14px',
  lineHeight: '24px',
  color: '#555',
  margin: '0 0 16px',
};

const reasonBox: React.CSSProperties = {
  backgroundColor: '#fff5f5',
  border: '1px solid #feb2b2',
  padding: '16px',
  margin: '16px 0',
  borderRadius: '4px',
};

const reasonTitle: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: 700,
  color: '#c53030',
  textTransform: 'uppercase' as const,
  margin: '0 0 4px',
};

const reasonText: React.CSSProperties = {
  fontSize: '14px',
  color: '#2d3748',
  margin: 0,
  fontStyle: 'italic',
};

const infoBox: React.CSSProperties = {
  backgroundColor: '#ebf8ff',
  border: '1px solid #bee3f8',
  padding: '16px',
  margin: '16px 0',
  borderRadius: '4px',
};

const infoText: React.CSSProperties = {
  fontSize: '14px',
  lineHeight: '20px',
  color: '#2a4365',
  margin: 0,
};

const buttonContainer: React.CSSProperties = {
  textAlign: 'center' as const,
  margin: '24px 0',
};

const button: React.CSSProperties = {
  backgroundColor: '#0a0a0a',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: 900,
  fontStyle: 'italic',
  textDecoration: 'none',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
  padding: '14px 28px',
  border: '2px solid #d50f17',
  display: 'inline-block',
};

const hr: React.CSSProperties = {
  borderColor: '#0a0a0a',
  borderWidth: '2px',
  margin: '24px 0',
};

const footer: React.CSSProperties = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '18px',
};
