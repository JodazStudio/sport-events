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

interface PaymentReportedEmailProps {
  athleteName: string;
  eventName: string;
  statusUrl: string;
}

export function PaymentReportedEmail({
  athleteName,
  eventName,
  statusUrl,
}: PaymentReportedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        Comprobante de pago recibido — En proceso de revisión para {eventName}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={headerSection}>
            <Heading style={logo}>
              Zona<span style={logoAccent}>crono</span>
            </Heading>
          </Section>

          <Section style={contentSection}>
            <Heading style={heading}>¡Pago en Revisión!</Heading>

            <Text style={greeting}>Hola {athleteName},</Text>

            <Text style={paragraph}>
              Hemos recibido exitosamente el reporte de tu pago para el evento{' '}
              <strong>{eventName}</strong>. 
            </Text>

            <Text style={paragraph}>
              Nuestro equipo o el organizador validará los detalles en las
              próximas 24-48 horas. Te notificaremos por esta vía una vez que 
              tu inscripción sea confirmada oficialmente.
            </Text>
 
            <Text style={paragraph}>
              Mientras tanto, puedes seguir el estado de tu validación aquí:
            </Text>

            <Section style={buttonContainer}>
              <Button style={button} href={statusUrl}>
                Ver Estado de mi Inscripción
              </Button>
            </Section>

            <Hr style={hr} />

            <Text style={footer}>
              Este correo fue enviado automáticamente por Zonacrono. Si no
              realizaste esta acción, por favor contacta al organizador.
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
  color: '#0a0a0a',
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

const buttonContainer: React.CSSProperties = {
  textAlign: 'center' as const,
  margin: '24px 0',
};

const button: React.CSSProperties = {
  backgroundColor: '#d50f17', // brand-red
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: 900,
  fontStyle: 'italic',
  textDecoration: 'none',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
  padding: '14px 28px',
  border: '2px solid #0a0a0a', // Heavy border for mechanical look
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
