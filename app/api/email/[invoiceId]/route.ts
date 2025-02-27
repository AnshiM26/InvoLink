import requireUser, { formatCurrency } from "@/app/utils/hooks";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";
import { redirect } from "next/navigation";
import getDueDate from "@/components/DueDate";

export async function POST(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ invoiceId: string }>;
  }
) {
  const session = await requireUser();

  const { invoiceId } = await params;
  const invoiceData = await prisma.invoice.findUnique({
    where: {
      id: invoiceId,
      userId: session.user?.id,
    },
  });
  if (!invoiceData) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  sgMail.setApiKey(process.env.SENDGRID_INVOICE_EMAIL_API_KEY!);
    const msg = {
      to: invoiceData.clientEmail,
      from: "InvoLink@anshikamisra.com",
      templateId: "d-31dc96d458d343c1bd309d764bef5463",
      dynamicTemplateData: {
        firstName: invoiceData.clientName,
        invoiceNumber: invoiceData.invoiceNumber,
        invoiceDesc:invoiceData.invoiceItemDescription,
        dueDate: getDueDate(invoiceData.date, invoiceData.dueDate),
        ttlamt: formatCurrency(
          invoiceData.total,
          invoiceData.currency
        ),
        Link_to_download: `http://localhost:3000/api/invoice/${invoiceData.id}`,
      },
    };
    sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent successfully");
      })
      .catch((error) => {
        console.error("Error sending email:", error);
      });
     return redirect("/dashboard/invoices");
}
