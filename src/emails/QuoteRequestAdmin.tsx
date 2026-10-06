import {
  Body, Container, Head, Heading, Html,
  Link, Preview, Row, Column, Section, Text, Hr,
} from "@react-email/components";
import { QuoteEmailData } from "@/lib/email";

export function QuoteRequestAdminEmail(data: QuoteEmailData) {
  return (
    <Html>
      <Head />
      <Preview>📋 New quote: {data.productName} — {data.customerName} — action required</Preview>
      <Body style={{ backgroundColor: "#F7F3EA", fontFamily: "Inter, system-ui, sans-serif", margin: 0, padding: "32px 16px" }}>
        <Container style={{ maxWidth: "560px", margin: "0 auto" }}>

          {/* Admin header */}
          <Section style={{ backgroundColor: "#FEF3C7", border: "1px solid #FCD34D", borderRadius: "16px 16px 0 0", padding: "18px 28px" }}>
            <Text style={{ fontSize: "14px", fontWeight: "700", color: "#92400E", margin: 0 }}>
              📋 ACTION REQUIRED — New quote request
            </Text>
          </Section>

          <Section style={{ backgroundColor: "#ffffff", padding: "28px", border: "1px solid #E6E0D2", borderTop: "none" }}>

            <Heading style={{ fontSize: "20px", color: "#051B39", margin: "0 0 20px" }}>
              {data.productName}
            </Heading>

            {/* Customer details */}
            <Section style={{ backgroundColor: "#F7F3EA", borderRadius: "10px", padding: "16px 20px", marginBottom: "20px" }}>
              <Text style={{ fontSize: "12px", color: "#626C8B", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 10px", fontWeight: "600" }}>
                Customer
              </Text>
              {[
                { label: "Name",    value: data.customerName                       },
                { label: "Email",   value: data.customerEmail                      },
                { label: "Phone",   value: data.customerPhone                      },
                { label: "Company", value: data.company ?? "Not provided"          },
              ].map((row) => (
                <Row key={row.label} style={{ marginBottom: "6px" }}>
                  <Column style={{ width: "80px" }}>
                    <Text style={{ fontSize: "11px", color: "#626C8B", margin: 0 }}>{row.label}</Text>
                  </Column>
                  <Column>
                    <Text style={{ fontSize: "12px", fontWeight: "500", color: "#051B39", margin: 0 }}>{row.value}</Text>
                  </Column>
                </Row>
              ))}
            </Section>

            {/* Order details */}
            <Section style={{ backgroundColor: "#F7F3EA", borderRadius: "10px", padding: "16px 20px", marginBottom: "20px" }}>
              <Text style={{ fontSize: "12px", color: "#626C8B", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 10px", fontWeight: "600" }}>
                Order details
              </Text>
              {[
                { label: "Product",  value: data.productName                 },
                { label: "Quantity", value: data.quantity                    },
                { label: "Timeline", value: data.timeline ?? "Flexible"      },
                { label: "Design",   value: data.designFileName ?? "Not attached" },
              ].map((row) => (
                <Row key={row.label} style={{ marginBottom: "6px" }}>
                  <Column style={{ width: "80px" }}>
                    <Text style={{ fontSize: "11px", color: "#626C8B", margin: 0 }}>{row.label}</Text>
                  </Column>
                  <Column>
                    <Text style={{ fontSize: "12px", fontWeight: "500", color: "#051B39", margin: 0 }}>{row.value}</Text>
                  </Column>
                </Row>
              ))}
            </Section>

            {/* Specs */}
            <Text style={{ fontSize: "12px", color: "#626C8B", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 8px", fontWeight: "600" }}>
              Specifications
            </Text>
            <Text style={{ fontSize: "13px", color: "#051B39", lineHeight: "1.7", margin: "0 0 20px", backgroundColor: "#F7F3EA", padding: "12px 16px", borderRadius: "8px" }}>
              {data.description}
            </Text>

            <Hr style={{ borderColor: "#E6E0D2", margin: "0 0 20px" }} />

            {/* Quick action buttons */}
            <Text style={{ fontSize: "13px", fontWeight: "600", color: "#051B39", margin: "0 0 12px" }}>Quick actions</Text>
            <Row>
              <Column style={{ paddingRight: "8px" }}>
                <Link href={`https://wa.me/${data.customerPhone.replace(/\D/g, "")}?text=Hi ${data.customerName}, thanks for your quote request for ${data.productName}. Here is your quote:`}
                  style={{ display: "block", textAlign: "center", backgroundColor: "#16A34A", color: "#fff", padding: "10px 0", borderRadius: "20px", fontSize: "12px", fontWeight: "500", textDecoration: "none" }}>
                  💬 Reply on WhatsApp
                </Link>
              </Column>
              <Column style={{ paddingLeft: "8px" }}>
                <Link href={`mailto:${data.customerEmail}?subject=Your quote for ${data.productName} — Angela`}
                  style={{ display: "block", textAlign: "center", backgroundColor: "#302A78", color: "#fff", padding: "10px 0", borderRadius: "20px", fontSize: "12px", fontWeight: "500", textDecoration: "none" }}>
                  📧 Reply by email
                </Link>
              </Column>
            </Row>
          </Section>

          <Section style={{ backgroundColor: "#051B39", borderRadius: "0 0 16px 16px", padding: "14px 28px", textAlign: "center" }}>
            <Text style={{ fontSize: "11px", color: "#B4BAD3", margin: 0 }}>
              Angela Admin · Reply within 1 hour · SLA: Business hours Mon–Sat
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  );
}

