import { NextRequest, NextResponse } from "next/server";
import { sendQuoteReceivedEmail, QuoteEmailData } from "@/lib/email";
import { createQuote } from "@/lib/db";

interface QuoteItem {
  id:    string;
  name:  string;
  group: "bundle" | "service" | "product" | "custom";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name, email, phone, company,
      product, items,
      quantity, description, timeline, designFileName,
    } = body;

    if (!name || !email || !phone || !quantity || !description) {
      return NextResponse.json({ message: "Please fill in all required fields." }, { status: 400 });
    }

    // Either an items[] array OR a legacy product string is required
    const hasItems = Array.isArray(items) && items.length > 0;
    if (!hasItems && !product) {
      return NextResponse.json({ message: "Please select at least one product or service." }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: "Please enter a valid email address." }, { status: 400 });
    }

    const itemsList = (hasItems ? items as QuoteItem[] : []);
    const productSummary = itemsList.length > 0
      ? itemsList.map((i) => `${i.name} [${i.group}]`).join(", ")
      : product;

    // Save to Supabase — stash items[] array inside description so admin can see them
    const itemBreakdown = itemsList.length > 0
      ? `\n\nItems requested (${itemsList.length}):\n${itemsList.map((i) => `• ${i.name} (${i.group})`).join("\n")}\n\nCustomer description:\n${description}`
      : description;

    await createQuote({
      customer_name:    name,
      customer_email:   email,
      customer_phone:   phone,
      company:          company  || undefined,
      product_name:     productSummary,
      quantity,
      description:      itemBreakdown,
      timeline:         timeline || undefined,
      design_file_name: designFileName || undefined,
    });

    // Send emails
    const emailData: QuoteEmailData = {
      customerName:    name,
      customerEmail:   email,
      customerPhone:   phone,
      company:         company  || undefined,
      productName:     productSummary,
      quantity,
      description:     itemBreakdown,
      timeline:        timeline || undefined,
      designFileName:  designFileName || undefined,
    };
    await sendQuoteReceivedEmail(emailData);

    return NextResponse.json({ success: true, message: "Quote request received.", itemCount: itemsList.length || 1 });
  } catch (err) {
    console.error("Quote API error:", err);
    return NextResponse.json({ message: "Something went wrong. Please WhatsApp us directly." }, { status: 500 });
  }
}

