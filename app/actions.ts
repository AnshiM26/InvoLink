"use server";
import requireUser, { formatCurrency } from "./utils/hooks";
import { parseWithZod } from "@conform-to/zod";
import { invoiceSchema, onboardingSchema } from "./utils/zodSchemas";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import sgMail from "@sendgrid/mail";
import getDueDate from "@/components/DueDate";
import { InvoiceStatus, Prisma } from "@prisma/client";

export async function onboardUser(prevState: any, formData: FormData) {
  const session = await requireUser();
  //server side form validation
  const submission = parseWithZod(formData, {
    schema: onboardingSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const data = await prisma.user.update({
    where: {
      id: session.user?.id,
    },
    data: {
      firstName: submission.value.firstName,
      lastName: submission.value.lastName,
      address: submission.value.address,
    },
  });

  return redirect("/dashboard");
}

export async function createInvoice(prevState: any, formData: FormData) {
  const session = await requireUser();
  const submission = parseWithZod(formData, {
    schema: invoiceSchema,
  });
  if (submission.status !== "success") {
    return submission.reply();
  }
  const data = await prisma.invoice.create({
    data: {
      clientAddress: submission.value.clientAddress,
      clientEmail: submission.value.clientEmail,
      clientName: submission.value.clientName,
      currency: submission.value.currency,
      date: submission.value.date,
      dueDate: submission.value.dueDate,
      fromAddress: submission.value.fromAddress,
      fromEmail: submission.value.fromEmail,
      fromName: submission.value.fromName,
      invoiceItemDescription: submission.value.invoiceItemDescription,
      invoiceItemQuantity: submission.value.invoiceItemQuantity,
      invoiceItemRate: submission.value.invoiceItemRate,
      invoiceName: submission.value.invoiceName,
      invoiceNumber: submission.value.invoiceNumber,
      status: submission.value.status,
      total: submission.value.total,
      note: submission.value.note,
      userId: session.user?.id,
    },
  });


  sgMail.setApiKey(process.env.SENDGRID_INVOICE_EMAIL_API_KEY!);
  const msg = {
    to: submission.value.clientEmail,
    from: "InvoLink@anshikamisra.com",
    templateId: "d-41d52fcd9d9f423586ed3cb9dbb222f2",
    dynamicTemplateData: {
      clientName: submission.value.clientName,
      invoiceNumber: submission.value.invoiceNumber,
      dueDate: getDueDate(submission.value.date, submission.value.dueDate),
      totalAmt: formatCurrency(
        submission.value.total,
        submission.value.currency
      ),
      invoiceLink: `http://localhost:3000/api/invoice/${data.id}`,
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

export async function editInvoice(prevState: any, formData: FormData) {
  const session = await requireUser();
  const submission = parseWithZod(formData, {
    schema: invoiceSchema,
  });
  if (submission.status !== "success") {
    return submission.reply();
  }
  const data = await prisma.invoice.update({
    where: {
      id: formData.get("id") as string,
      userId: session.user?.id,
    },
    data: {
      clientAddress: submission.value.clientAddress,
      clientEmail: submission.value.clientEmail,
      clientName: submission.value.clientName,
      currency: submission.value.currency,
      date: submission.value.date,
      dueDate: submission.value.dueDate,
      fromAddress: submission.value.fromAddress,
      fromEmail: submission.value.fromEmail,
      fromName: submission.value.fromName,
      invoiceItemDescription: submission.value.invoiceItemDescription,
      invoiceItemQuantity: submission.value.invoiceItemQuantity,
      invoiceItemRate: submission.value.invoiceItemRate,
      invoiceName: submission.value.invoiceName,
      invoiceNumber: submission.value.invoiceNumber,
      status: submission.value.status,
      total: submission.value.total,
      note: submission.value.note,
    },
  });
  sgMail.setApiKey(process.env.SENDGRID_INVOICE_EMAIL_API_KEY!);
  const msg = {
    to: submission.value.clientEmail,
    from: "InvoLink@anshikamisra.com",
    templateId: "d-15be585a78654cb09e0fa98e745e9caf",
    dynamicTemplateData: {
      clientName: submission.value.clientName,
      invoiceNumber: submission.value.invoiceNumber,
      dueDate: new Intl.DateTimeFormat("en-IN", {
        dateStyle: "long",
      }).format(new Date(submission.value.date)),
      totalAmt: formatCurrency(
        submission.value.total,
        submission.value.currency
      ),
      invoiceLink: `http://localhost:3000/api/invoice/${data.id}`,
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


export default async function DeleteInvoice(invoiceid: string) {
  try {
    const session = await requireUser();

    if (!session?.user?.id) {
      return { error: "Unauthorized" }; 
    }

    const invoice = await prisma.invoice.findUnique({
      where: {
        id: invoiceid,
        userId: session.user.id,
      },
    });

    if (!invoice) {
      return { error: "Invoice not found" }; 
    }

    // Delete invoice
    await prisma.invoice.delete({
      where: {
        id: invoiceid,
        userId: session.user.id, 
      },
    });

    return { success: true }; 
  } catch (error) {
    console.error("DeleteInvoice Error:", error);
    return { error: "Something went wrong" };
  }
}

export async function updateStatus(invoiceid: string, status: string) {
  const session=await requireUser();
  const data=await prisma.invoice.update({
    where:{
      userId:session.user?.id,
      id:invoiceid
    },
    data:{
      status:status as InvoiceStatus
    }
  })
}