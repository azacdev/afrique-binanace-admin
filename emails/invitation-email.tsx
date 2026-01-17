import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Container,
  Hr,
  Button,
} from "@react-email/components";

interface InvitationEmailProps {
  email: string;
  inviteUrl: string;
  expiresAt: Date;
}

export const InvitationEmail = ({
  email,
  inviteUrl,
  expiresAt,
}: InvitationEmailProps) => {
  const formatExpiryDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Html>
      <Head>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Arial"
          webFont={{
            url: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>You're invited to join Afrique Bitcoin Admin Portal</Preview>
      <Container style={container}>
        {/* Header */}
        <Section style={header}>
          <Heading style={logo}>Afrique Bitcoin</Heading>
          <Text style={headerSubtext}>Admin Portal Invitation</Text>
        </Section>

        {/* Main Content */}
        <Section style={mainSection}>
          <Section style={contentCard}>
            <Heading style={cardTitle}>You're Invited!</Heading>
            <Hr style={divider} />

            <Text style={welcomeText}>
              You've been invited to join the Afrique Bitcoin Admin Portal. As
              an administrator, you'll have access to manage schedules, tickets,
              and configure system settings.
            </Text>

            <Row style={fieldRow}>
              <Text style={fieldLabel}>Invited Email</Text>
              <Text style={fieldValue}>{email}</Text>
            </Row>

            <Row style={fieldRow}>
              <Text style={fieldLabel}>Invitation Expires</Text>
              <Text style={fieldValue}>{formatExpiryDate(expiresAt)}</Text>
            </Row>

            <Hr style={divider} />

            <Section style={buttonContainer}>
              <Button href={inviteUrl} style={ctaButton}>
                Create Admin Account
              </Button>
            </Section>

            <Section style={linkContainer}>
              <Text style={linkText}>
                Or copy and paste this link in your browser:
              </Text>
              <Text style={linkUrl}>{inviteUrl}</Text>
            </Section>
          </Section>

          <Section style={warningCard}>
            <Text style={warningText}>
              <strong>Important:</strong> This invitation will expire in 7 days.
              If you didn't expect this invitation, you can safely ignore this
              email.
            </Text>
          </Section>
        </Section>

        {/* Footer */}
        <Section style={footer}>
          <Text style={footerText}>
            This invitation was sent through the Afrique Bitcoin Admin Portal.
          </Text>
          <Text style={footerText}>
            © {new Date().getFullYear()} Afrique Bitcoin. All rights reserved.
          </Text>
        </Section>
      </Container>
    </Html>
  );
};

// Styles with Afrique Bitcoin colors
const container = {
  margin: "0 auto",
  padding: "0",
  maxWidth: "600px",
  backgroundColor: "#F5F5EE",
};

const header = {
  backgroundColor: "#155E63",
  padding: "32px 24px",
  textAlign: "center" as const,
  borderRadius: "0 0 24px 24px",
};

const logo = {
  color: "#ffffff",
  fontFamily: "Inter, Arial, sans-serif",
  fontSize: "28px",
  fontWeight: "bold",
  margin: "0 0 8px 0",
  textAlign: "center" as const,
};

const headerSubtext = {
  color: "#6CBF6D",
  fontFamily: "Inter, Arial, sans-serif",
  fontSize: "16px",
  margin: "0",
  opacity: 0.9,
  textAlign: "center" as const,
};

const mainSection = {
  padding: "32px 24px",
};

const contentCard = {
  backgroundColor: "#ffffff",
  borderRadius: "16px",
  padding: "32px",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  border: "1px solid #f3f4f6",
  marginBottom: "16px",
};

const cardTitle = {
  color: "#155E63",
  fontFamily: "Inter, Arial, sans-serif",
  fontSize: "24px",
  fontWeight: "600",
  margin: "0 0 16px 0",
  textAlign: "center" as const,
};

const divider = {
  borderColor: "#e5e7eb",
  margin: "16px 0",
};

const welcomeText = {
  color: "#153231",
  fontFamily: "Inter, Arial, sans-serif",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "0 0 24px 0",
  textAlign: "center" as const,
};

const fieldRow = {
  marginBottom: "16px",
};

const fieldLabel = {
  color: "#6b7280",
  fontFamily: "Inter, Arial, sans-serif",
  fontSize: "14px",
  fontWeight: "500",
  margin: "0 0 4px 0",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
};

const fieldValue = {
  color: "#155E63",
  fontFamily: "Inter, Arial, sans-serif",
  fontSize: "16px",
  margin: "0",
  lineHeight: "1.5",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const ctaButton = {
  backgroundColor: "#155E63",
  color: "#ffffff",
  fontFamily: "Inter, Arial, sans-serif",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  padding: "16px 32px",
  borderRadius: "8px",
  display: "inline-block",
  border: "none",
  cursor: "pointer",
};

const linkContainer = {
  backgroundColor: "#F5F5EE",
  borderRadius: "12px",
  padding: "20px",
  border: "1px solid #e5e7eb",
  marginTop: "24px",
  textAlign: "center" as const,
};

const linkText = {
  color: "#6b7280",
  fontFamily: "Inter, Arial, sans-serif",
  fontSize: "14px",
  margin: "0 0 8px 0",
};

const linkUrl = {
  color: "#155E63",
  fontFamily: "Inter, Arial, sans-serif",
  fontSize: "14px",
  margin: "0",
  wordBreak: "break-all" as const,
};

const warningCard = {
  backgroundColor: "#FEF3CD",
  borderRadius: "12px",
  padding: "20px",
  border: "1px solid #fbbf24",
};

const warningText = {
  color: "#92400e",
  fontFamily: "Inter, Arial, sans-serif",
  fontSize: "14px",
  lineHeight: "1.5",
  margin: "0",
  textAlign: "center" as const,
};

const footer = {
  backgroundColor: "#155E63",
  padding: "24px",
  textAlign: "center" as const,
  borderRadius: "24px 24px 0 0",
  marginTop: "32px",
};

const footerText = {
  color: "#ffffff",
  fontFamily: "Inter, Arial, sans-serif",
  fontSize: "12px",
  margin: "4px 0",
  opacity: 0.8,
  textAlign: "center" as const,
};

export default InvitationEmail;
