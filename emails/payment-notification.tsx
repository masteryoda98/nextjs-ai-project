import { Body, Button, Container, Head, Heading, Hr, Html, Img, Preview, Section, Text } from "@react-email/components"

interface PaymentNotificationProps {
  username: string
  amount: number
  campaignName?: string
  dashboardUrl: string
}

export const PaymentNotification = ({ username, amount, campaignName, dashboardUrl }: PaymentNotificationProps) => (
  <Html>
    <Head />
    <Preview>You've received a payment of ${amount.toFixed(2)} from CreatorAmp</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img src={`https://creatoramp.com/logo.png`} width="170" height="50" alt="CreatorAmp" style={logo} />
        <Heading style={heading}>Payment Received</Heading>
        <Text style={paragraph}>Hi {username},</Text>
        <Text style={paragraph}>
          Great news! You've received a payment of <strong>${amount.toFixed(2)}</strong> for your content on CreatorAmp.
          {campaignName && ` This payment is for your work on the "${campaignName}" campaign.`}
        </Text>
        <Section style={buttonContainer}>
          <Button style={button} href={dashboardUrl}>
            View Payment Details
          </Button>
        </Section>
        <Text style={paragraph}>
          Thank you for being part of the CreatorAmp community. Keep creating amazing content!
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          © 2025 CreatorAmp. All rights reserved.
          <br />
          123 Music Street, Nashville, TN 37203
        </Text>
      </Container>
    </Body>
  </Html>
)

export default PaymentNotification

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
}

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px",
  maxWidth: "600px",
}

const logo = {
  margin: "0 auto",
  marginBottom: "20px",
}

const heading = {
  fontSize: "24px",
  letterSpacing: "-0.5px",
  lineHeight: "1.3",
  fontWeight: "400",
  color: "#484848",
  padding: "17px 0 0",
}

const paragraph = {
  margin: "0 0 15px",
  fontSize: "15px",
  lineHeight: "1.4",
  color: "#3c4149",
}

const buttonContainer = {
  padding: "12px 0 24px",
  textAlign: "center" as const,
}

const button = {
  backgroundColor: "#1DB954",
  borderRadius: "3px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px",
}

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
}

const footer = {
  color: "#9ca299",
  fontSize: "14px",
  marginBottom: "10px",
}
