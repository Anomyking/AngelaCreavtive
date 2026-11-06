import {
  Body, Container, Column, Head, Heading, Hr, Html,
  Link, Preview, Row, Section, Text,
} from "@react-email/components";
import { OrderEmailData } from "@/lib/email";

const brand = {
  primary:     "#302A78",
  primaryDark: "#051B39",
  primaryLight:"#F7F3EA",
  bg:         "#F7F3EA",
  white:      "#ffffff",
  textDark:   "#051B39",
  textMid:    "#4A5573",
  textLight:  "#626C8B",
  border:     "#E6E0D2",
  onDark:    "#B4BAD3",
};

export function OrderConfirmationEmail(
  data: OrderEmailData & { isAdminCopy?: boolean }
) {
  const deliveryMap: Record<string, string> = {
    pickup:     "Pick up in Westlands, Nairobi",
    nairobi:    "Nairobi delivery",
    nationwide: "Nationwide courier",
  };

  return (
    <Html>
      <Head />
      <Preview>
        {data.isAdminCopy
          ? `New order ${data.reference} — KES ${data.total.toLocaleString()}`
          : `We've received your order ${data.reference} ✅`}
      </Preview>
      <Body style={{ backgroundColor: "#F7F3EA", fontFamily: "Inter, system-ui, sans-serif", margin: 0, padding: "32px 16px" }}>
        <Container style={{ maxWidth: "560px", margin: "0 auto" }}>

          {/* Header */}
          <Section style={{ backgroundColor: brand.primaryDark, borderRadius: "16px 16px 0 0", padding: "28px 32px", textAlign: "center" }}>
            <Text style={{ color: brand.primaryLight, fontSize: "22px", fontWeight: "600", margin: 0 }}>
              🖨️ Angela
            </Text>
            <Text style={{ color: brand.onDark, fontSize: "12px", margin: "4px 0 0" }}>
              Nairobi&apos;s premium print house
            </Text>
          </Section>

          {/* Body */}
          <Section style={{ backgroundColor: brand.white, padding: "32px", borderLeft: `1px solid ${brand.border}`, borderRight: `1px solid ${brand.border}` }}>

            {data.isAdminCopy && (
              <Section style={{ backgroundColor: "#FEF3C7", border: "1px solid #FCD34D", borderRadius: "8px", padding: "10px 16px", marginBottom: "20px" }}>
                <Text style={{ fontSize: "12px", color: "#92400E", margin: 0 }}>
                  🔔 <strong>Admin copy</strong> — New order received
                </Text>
              </Section>
            )}

            <Heading style={{ fontSize: "22px", fontWeight: "600", color: brand.textDark, margin: "0 0 8px" }}>
              {data.isAdminCopy ? "New order received" : "Order received! 🎉"}
            </Heading>
            <Text style={{ fontSize: "14px", color: brand.textMid, margin: "0 0 24px", lineHeight: "1.6" }}>
              {data.isAdminCopy
                ? `${data.customerName} has placed an order. Contact them to confirm it and arrange payment, then mark it as paid in the dashboard.`
                : `Hi ${data.customerName}, thank you for your order. Our team will contact you shortly to confirm the details and arrange payment before production begins.`}
            </Text>

            {/* Order reference */}
            <Section style={{ backgroundColor: brand.bg, border: `1px solid ${brand.border}`, borderRadius: "12px", padding: "16px 20px", marginBottom: "24px" }}>
              <Row>
                <Column>
                  <Text style={{ fontSize: "11px", color: brand.textLight, margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Order reference</Text>
                  <Text style={{ fontSize: "18px", fontWeight: "600", color: brand.textDark, margin: 0, fontFamily: "monospace" }}>{data.reference}</Text>
                </Column>
                <Column style={{ textAlign: "right" }}>
                  <Text style={{ fontSize: "11px", color: brand.textLight, margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Payment</Text>
                  <Text style={{ fontSize: "13px", fontWeight: "500", color: "#B45309", margin: 0 }}>⏳ To be arranged</Text>
                </Column>
              </Row>
            </Section>

            {/* Items */}
            <Text style={{ fontSize: "12px", fontWeight: "600", color: brand.textDark, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 12px" }}>
              Items ordered
            </Text>
            {data.items.map((item, i) => (
              <Row key={i} style={{ marginBottom: "8px" }}>
                <Column style={{ flex: 1 }}>
                  <Text style={{ fontSize: "13px", color: brand.textDark, margin: 0 }}>{item.name}</Text>
                  <Text style={{ fontSize: "11px", color: brand.textLight, margin: "2px 0 0" }}>{item.quantity.toLocaleString()} pieces</Text>
                </Column>
                <Column style={{ textAlign: "right" }}>
                  <Text style={{ fontSize: "13px", fontWeight: "500", color: brand.textDark, margin: 0 }}>
                    KES {item.price.toLocaleString()}
                  </Text>
                </Column>
              </Row>
            ))}

            <Hr style={{ borderColor: brand.border, margin: "16px 0" }} />

            {/* Totals */}
            <Row style={{ marginBottom: "6px" }}>
              <Column><Text style={{ fontSize: "13px", color: brand.textMid, margin: 0 }}>Subtotal</Text></Column>
              <Column style={{ textAlign: "right" }}><Text style={{ fontSize: "13px", color: brand.textDark, margin: 0 }}>KES {data.subtotal.toLocaleString()}</Text></Column>
            </Row>
            <Row style={{ marginBottom: "6px" }}>
              <Column><Text style={{ fontSize: "13px", color: brand.textMid, margin: 0 }}>Delivery ({deliveryMap[data.deliveryMethod] ?? data.deliveryMethod})</Text></Column>
              <Column style={{ textAlign: "right" }}>
                <Text style={{ fontSize: "13px", color: data.deliveryFee === 0 ? "#059669" : brand.textDark, margin: 0 }}>
                  {data.deliveryFee === 0 ? "FREE" : `KES ${data.deliveryFee.toLocaleString()}`}
                </Text>
              </Column>
            </Row>
            <Row>
              <Column><Text style={{ fontSize: "15px", fontWeight: "600", color: brand.textDark, margin: "8px 0 0" }}>Total due</Text></Column>
              <Column style={{ textAlign: "right" }}><Text style={{ fontSize: "15px", fontWeight: "600", color: brand.textDark, margin: "8px 0 0" }}>KES {data.total.toLocaleString()}</Text></Column>
            </Row>

            <Hr style={{ borderColor: brand.border, margin: "20px 0" }} />

            {/* What happens next */}
            {!data.isAdminCopy && (
              <>
                <Text style={{ fontSize: "13px", fontWeight: "600", color: brand.textDark, margin: "0 0 12px" }}>What happens next</Text>
                {[
                  { icon: "💬", text: "We'll contact you by WhatsApp or phone to confirm your order and arrange payment" },
                  { icon: "🎨", text: "Our design team will send you a proof for approval" },
                  { icon: "🖨️", text: "We print once payment is confirmed and you approve the proof" },
                  { icon: "🚚", text: "We'll confirm your collection/delivery time via WhatsApp" },
                  { icon: "📧", text: "You'll receive status updates at this email address" },
                ].map((item) => (
                  <Row key={item.text} style={{ marginBottom: "8px" }}>
                    <Column style={{ width: "28px" }}><Text style={{ margin: 0, fontSize: "16px" }}>{item.icon}</Text></Column>
                    <Column><Text style={{ fontSize: "13px", color: brand.textMid, margin: 0, lineHeight: "1.5" }}>{item.text}</Text></Column>
                  </Row>
                ))}
              </>
            )}

            {data.isAdminCopy && (
              <Section style={{ backgroundColor: brand.bg, borderRadius: "10px", padding: "14px 18px" }}>
                <Text style={{ fontSize: "12px", color: brand.textDark, margin: "0 0 6px", fontWeight: "600" }}>Customer details</Text>
                <Text style={{ fontSize: "12px", color: brand.textMid, margin: "2px 0", lineHeight: "1.6" }}>
                  📧 {data.customerEmail}<br />
                  📱 {data.customerPhone}<br />
                  🚚 {deliveryMap[data.deliveryMethod] ?? data.deliveryMethod}
                  {data.deliveryAddress ? ` — ${data.deliveryAddress}` : ""}
                </Text>
              </Section>
            )}
          </Section>

          {/* Footer */}
          <Section style={{ backgroundColor: brand.primaryDark, borderRadius: "0 0 16px 16px", padding: "20px 32px", textAlign: "center" }}>
            <Text style={{ fontSize: "12px", color: brand.onDark, margin: "0 0 6px" }}>
              Questions? Reply to this email or{" "}
              <Link href="https://wa.me/254700000000" style={{ color: brand.primaryLight }}>WhatsApp us</Link>
            </Text>
            <Text style={{ fontSize: "11px", color: brand.onDark, margin: 0 }}>
              © 2026 Angela · Westlands, Nairobi · +254 700 000 000
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  );
}

