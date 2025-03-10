import { prisma } from "@/lib/prisma";
import { InvoiceActions } from "./invoiceActions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import requireUser, { formatCurrency } from "@/app/utils/hooks";
import { Badge } from "./ui/badge";
import { EmptyState } from "./EmptyState";

async function getData(userId: string) {
  const data = await prisma.invoice.findMany({
    where: {
      userId: userId,
    },
    select: {
      id: true,
      clientName: true,
      total: true,
      date: true,
      status: true,
      invoiceNumber: true,
      currency: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return data;
}
export async function InvoiceList() {
  const session = await requireUser();
  const data = await getData(session.user?.id as string);
  return (
    <>
      {data.length === 0 ? (
        <EmptyState
          title="No invoices found"
          description="Create an invoice to get started"
          buttontext="Create invoice"
          href="/dashboard/invoices/create"
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>#{invoice.invoiceNumber}</TableCell>
                <TableCell>{invoice.clientName}</TableCell>
                <TableCell>
                  {formatCurrency(invoice.total, invoice.currency)}
                </TableCell>
                <TableCell>
                  <Badge>{invoice.status}</Badge>
                </TableCell>
                <TableCell>
                  {new Intl.DateTimeFormat("en-IN", {
                    dateStyle: "medium",
                  }).format(invoice.date)}
                </TableCell>
                <TableCell className="text-right">
                  <InvoiceActions id={invoice.id} state={invoice.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
}
