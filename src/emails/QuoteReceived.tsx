import {
  Body, Container, Head, Heading, Html,
  Link, Preview, Row, Column, Section, Text, Hr,
} from "@react-email/components";
import { QuoteEmailData } from "@/lib/email";

const brand = {
  primary:      "#302A78",
  primaryDark:  "#051B39",
  primaryLight: "#F7F3EA",
  bg:          "#F7F3EA",
  white:       "#ffffff",
  textDark:    "#051B39",
  textMid:     "#4A5573",
  textLight:   "#626C8B",
  border:      "#E6E0D2",
  onDark:   "#B4BAD3",
};

export function QuoteReceivedEmail(data: QuoteEmailData) {
  return (
    <Html>
      <Head />
      <Preview>We&apos;ve received your quote request for {data.productName} — we&apos;ll be in touch within 1 hour.</Preview>
      <Body style={{ backgroundColor: "#F7F3EA", fontFamily: "Inter, system-ui, sans-serif", margin: 0, padding: "32px 16px" }}>
        <Container style={{ maxWidth: "560px", margin: "0 auto" }}>

          {/* Header */}
          <Section style={{ backgroundColor: brand.primaryDark, borderRadius: "16px 16px 0 0", padding: "28px 32px", textAlign: "center" }}>
            <Text style={{ color: brand.primaryLight, fontSize: "22px", fontWeight: "600", margin: 0 }}>🖨️ Angela</Text>
            <Text style={{ color: brand.onDark, fontSize: "12px", margin: "4px 0 0" }}>Nairobi&apos;s premium print house</Text>
          </Section>

          {/* Body */}
          <Section style={{ backgroundColor: brand.white, padding: "32px", borderLeft: `1px solid ${brand.border}`, borderRight: `1px solid ${brand.border}` }}>

            <Heading style={{ fontSize: "22px", fontWeight: "600", color: brand.textDark, margin: "0 0 8px" }}>
              Quote request received 📋
            </Heading>
            <Text style={{ fontSize: "14px", color: brand.textMid, margin: "0 0 24px", lineHeight: "1.6" }}>
              Hi {data.customerName}, we&apos;ve received your quote request for{" "}
              <strong>{data.productName}</strong>. Our team will review your requirements and
              send you a detailed quote{" "}
              <strong>within 1 hour</strong> during business hours (Mon–Sat, 8 AM–6 PM).
            </Text>

            {/* Summary card */}
            <Section style={{ backgroundColor: brand.bg, border: `1px solid ${brand.border}`, borderRadius: "12px", padding: "20px", marginBottom: "24px" }}>
              <Text style={{ fontSize: "11px", color: brand.textLight, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 12px", fontWeight: "600" }}>
                Your request summary
              </Text>
              {[
                { label: "Product",  value: data.productName },
                { label: "Quantity", value: data.quantity     },
                { label: "Timeline", value: data.timeline ?? "Flexible" },
                { label: "Contact",  value: data.customerPhone },
                ...(data.company ? [{ label: "Company", value: data.company }] : []),
              ].map((row) => (
                <Row key={row.label} style={{ marginBottom: "8px" }}>
                  <Column style={{ width: "100px" }}>
                    <Text style={{ fontSize: "12px", color: brand.textLight, margin: 0 }}>{row.label}</Text>
                  </Column>
                  <Column>
                    <Text style={{ fontSize: "12px", fontWeight: "500", color: brand.textDark, margin: 0 }}>{row.value}</Text>
                  </Column>
                </Row>
              ))}
              {data.description && (
                <>
                  <Hr style={{ borderColor: brand.border, margin: "12px 0" }} />
                  <Text style={{ fontSize: "11px", color: brand.textLight, margin: "0 0 4px" }}>Specifications</Text>
                  <Text style={{ fontSize: "12px", color: brand.textDark, margin: 0, lineHeight: "1.6" }}>{data.description}</Text>
                </>
              )}
            </Section>

            {/* Need it faster */}
            <Section style={{ backgroundColor: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: "12px", padding: "16px 20px", marginBottom: "24px" }}>
              <Text style={{ fontSize: "13px", fontWeight: "600", color: "#14532D", margin: "0 0 6px" }}>💬 Need it faster?</Text>
              <Text style={{ fontSize: "12px", color: "#166534", margin: "0 0 10px", lineHeight: "1.5" }}>
                WhatsApp us directly and we can turn around your quote in minutes.
              </Text>
              <Link href="https://wa.me/254700000000?text=Hi, I sent a quote request for {data.productName}"
                style={{ fontSize: "12px", backgroundColor: "#16A34A", color: "#ffffff", padding: "8px 16px", borderRadius: "20px", textDecoration: "none", fontWeight: "500" }}>
                Open WhatsApp →
              </Link>
            </Section>

            {/* What we'll include */}
            <Text style={{ fontSize: "13px", fontWeight: "600", color: brand.textDark, margin: "0 0 12px" }}>
              Your quote will include
            </Text>
            {[
              "Itemised pricing based on your quantity and specs",
              "Bulk discount if applicable",
              "Exact turnaround time",
              "Delivery options and costs",
              "Payment instructions (M-Pesa or card)",
            ].map((item) => (
              <Row key={item} style={{ marginBottom: "6px" }}>
                <Column style={{ width: "20px" }}>
                  <Text style={{ fontSize: "12px", color: brand.primary, margin: 0 }}>✓</Text>
                </Column>
                <Column>
                  <Text style={{ fontSize: "12px", color: brand.textMid, margin: 0, lineHeight: "1.5" }}>{item}</Text>
                </Column>
              </Row>
            ))}
          </Section>

          {/* Footer */}
          <Section style={{ backgroundColor: brand.primaryDark, borderRadius: "0 0 16px 16px", padding: "20px 32px", textAlign: "center" }}>
            <Text style={{ fontSize: "12px", color: brand.onDark, margin: "0 0 4px" }}>
              Angela · Westlands, Nairobi
            </Text>
            <Text style={{ fontSize: "12px", color: brand.onDark, margin: 0 }}>
              <Link href="tel:+254700000000" style={{ color: brand.primaryLight }}>+254 700 000 000</Link>
              {" · "}
              <Link href="mailto:hello@angela.co.ke" style={{ color: brand.primaryLight }}>hello@angela.co.ke</Link>
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  );
}

