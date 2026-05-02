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

interface ReservationConfirmedEmailProps {
  athleteName: string;
  eventName: string;
  statusUrl: string;
}

export function ReservationConfirmedEmail({
  athleteName,
  eventName,
  statusUrl,
}: ReservationConfirmedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        Tu lugar está reservado — Reporta tu pago antes de las 11:59 PM
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
            <Heading style={heading}>¡Reserva Confirmada!</Heading>

            <Text style={greeting}>Hola {athleteName},</Text>

            <Text style={paragraph}>
              Tu lugar en <strong>{eventName}</strong> ha sido reservado
              exitosamente. Sin embargo, aún necesitas reportar tu pago para
              confirmar tu inscripción.
            </Text>

            <Section style={warningBox}>
              <Text style={warningText}>
                ⚠️ <strong>Importante:</strong> Tienes hasta las{' '}
                <strong>11:59 PM de hoy</strong> para reportar tu pago.
                Pasado ese límite, tu reserva será cancelada automáticamente y
                el cupo será liberado.
              </Text>
            </Section>

            <Text style={paragraph}>
              Haz clic en el siguiente enlace para reportar tu pago y consultar
              el estado de tu inscripción:
            </Text>

            <Section style={buttonContainer}>
              <Button style={button} href={statusUrl}>
                Reportar Pago
              </Button>
            </Section>

            <Hr style={hr} />

            <Text style={footer}>
              Este correo fue enviado automáticamente por Zonacrono. Si no
              realizaste esta inscripción, puedes ignorar este mensaje.
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

const warningBox: React.CSSProperties = {
  backgroundColor: '#fffbeb',
  border: '2px solid #f59e0b',
  padding: '16px',
  margin: '16px 0',
};

const warningText: React.CSSProperties = {
  fontSize: '14px',
  lineHeight: '22px',
  color: '#92400e',
  margin: 0,
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
