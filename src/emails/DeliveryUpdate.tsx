import {
  Body, Container, Head, Html,
  Link, Preview, Section, Text,
} from "@react-email/components";
import { DeliveryEmailData } from "@/lib/email";

const statusConfig = {
  printing: {
    emoji:   "🖨️",
    title:   "Your order is being printed",
    message: "Great news — your order has entered production. Our print team is working on it right now.",
    color:   "#302A78",
    bg:      "#F7F3EA",
  },
  ready: {
    emoji:   "🎉",
    title:   "Your order is ready!",
    message: "Your order has been printed and is ready for collection from our Westlands studio.",
    color:   "#059669",
    bg:      "#F0FDF4",
  },
  dispatched: {
    emoji:   "🚚",
    title:   "Your order is on its way",
    message: "Your order has been handed over to our courier partner and is on its way to you.",
    color:   "#0369A1",
    bg:      "#EFF6FF",
  },
  delivered: {
    emoji:   "✅",
    title:   "Order delivered!",
    message: "Your order has been delivered. We hope you love the print quality!",
    color:   "#059669",
    bg:      "#F0FDF4",
  },
};

export function DeliveryUpdateEmail(data: DeliveryEmailData) {
  const config = statusConfig[data.status];

  return (
    <Html>
      <Head />
      <Preview>{config.emoji} {config.title} — Order {data.reference}</Preview>
      <Body style={{ backgroundColor: "#F7F3EA", fontFamily: "Inter, system-ui, sans-serif", margin: 0, padding: "32px 16px" }}>
        <Container style={{ maxWidth: "560px", margin: "0 auto" }}>

          {/* Header */}
          <Section style={{ backgroundColor: "#051B39", borderRadius: "16px 16px 0 0", padding: "28px 32px", textAlign: "center" }}>
            <Text style={{ color: "#F7F3EA", fontSize: "22px", fontWeight: "600", margin: 0 }}>🖨️ Angela</Text>
          </Section>

          {/* Status banner */}
          <Section style={{ backgroundColor: config.bg, border: `1px solid ${config.color}30`, padding: "20px 32px", textAlign: "center" }}>
            <Text style={{ fontSize: "40px", margin: "0 0 8px" }}>{config.emoji}</Text>
            <Text style={{ fontSize: "18px", fontWeight: "600", color: config.color, margin: 0 }}>{config.title}</Text>
          </Section>

          {/* Body */}
          <Section style={{ backgroundColor: "#ffffff", padding: "28px 32px", border: "1px solid #E6E0D2", borderTop: "none" }}>
            <Text style={{ fontSize: "14px", color: "#4A5573", lineHeight: "1.7", margin: "0 0 20px" }}>
              Hi {data.customerName},{" "}
              {data.message ?? config.message}
            </Text>

            {/* Reference */}
            <Section style={{ backgroundColor: "#F7F3EA", borderRadius: "10px", padding: "14px 18px", marginBottom: "20px" }}>
              <Text style={{ fontSize: "11px", color: "#626C8B", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Order reference</Text>
              <Text style={{ fontSize: "16px", fontWeight: "600", color: "#051B39", margin: 0, fontFamily: "monospace" }}>{data.reference}</Text>
            </Section>

            {/* Tracking if available */}
            {data.trackingCode && (
              <Section style={{ backgroundColor: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: "10px", padding: "14px 18px", marginBottom: "20px" }}>
                <Text style={{ fontSize: "12px", color: "#1E40AF", margin: "0 0 4px", fontWeight: "600" }}>📦 Tracking code</Text>
                <Text style={{ fontSize: "15px", fontWeight: "600", color: "#1E3A8A", margin: 0, fontFamily: "monospace" }}>{data.trackingCode}</Text>
              </Section>
            )}

            {/* Status-specific tips */}
            {data.status === "ready" && (
              <Section style={{ backgroundColor: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: "10px", padding: "14px 18px", marginBottom: "20px" }}>
                <Text style={{ fontSize: "13px", color: "#14532D", margin: "0 0 6px", fontWeight: "600" }}>📍 Collection details</Text>
                <Text style={{ fontSize: "12px", color: "#166534", margin: 0, lineHeight: "1.6" }}>
                  Angela Studio · Westlands, Nairobi<br />
                  Open Monday–Saturday, 8 AM–6 PM<br />
                  Bring your order reference: <strong>{data.reference}</strong>
                </Text>
              </Section>
            )}

            {data.status === "delivered" && (
              <Section style={{ textAlign: "center", marginTop: "10px" }}>
                <Text style={{ fontSize: "13px", color: "#4A5573", margin: "0 0 12px" }}>How was your experience?</Text>
                <Link href="https://angela.co.ke/reviews"
                  style={{ backgroundColor: "#302A78", color: "#fff", padding: "10px 24px", borderRadius: "20px", fontSize: "12px", fontWeight: "500", textDecoration: "none" }}>
                  Leave a review ★
                </Link>
              </Section>
            )}

            <Text style={{ fontSize: "12px", color: "#626C8B", margin: "20px 0 0" }}>
              Questions?{" "}
              <Link href="https://wa.me/254700000000" style={{ color: "#302A78" }}>WhatsApp us</Link>{" "}
              or call <Link href="tel:+254700000000" style={{ color: "#302A78" }}>+254 700 000 000</Link>
            </Text>
          </Section>

          {/* Footer */}
          <Section style={{ backgroundColor: "#051B39", borderRadius: "0 0 16px 16px", padding: "16px 32px", textAlign: "center" }}>
            <Text style={{ fontSize: "11px", color: "#B4BAD3", margin: 0 }}>
              © 2026 Angela · Westlands, Nairobi ·{" "}
              <Link href="https://angela.co.ke" style={{ color: "#F7F3EA" }}>angela.co.ke</Link>
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  );
}

