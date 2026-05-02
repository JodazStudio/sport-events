import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface RegistrationApprovedEmailProps {
  athleteName: string;
  eventName: string;
  statusUrl: string;
}

export function RegistrationApprovedEmail({
  athleteName,
  eventName,
  statusUrl,
}: RegistrationApprovedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        ¡Inscripción Aprobada! — {eventName}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={headerSection}>
            <Img
              src="https://zonacrono.com/zonacrono_dark.png"
              width="180"
              height="40"
              alt="Zonacrono"
              style={logoImage}
            />
          </Section>

          <Section style={contentSection}>
            <Heading style={heading}>¡Inscripción Confirmada!</Heading>

            <Text style={greeting}>Hola {athleteName},</Text>

            <Text style={paragraph}>
              ¡Buenas noticias! Tu inscripción para el evento{' '}
              <strong>{eventName}</strong> ha sido <strong>aprobada exitosamente</strong>.
            </Text>

            <Text style={paragraph}>
              Ya formas parte oficial del evento. Puedes ver los detalles de tu
              inscripción y el comprobante en el siguiente enlace:
            </Text>

            <Section style={buttonContainer}>
              <Button style={button} href={statusUrl}>
                Ver Mi Inscripción
              </Button>
            </Section>

            <Text style={paragraph}>
              ¡Nos vemos en la línea de salida!
            </Text>

            <Hr style={hr} />

            <Text style={footer}>
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

const logoImage: React.CSSProperties = {
  margin: '0 auto',
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
