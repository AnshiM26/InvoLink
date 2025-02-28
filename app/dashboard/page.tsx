import { DashboardBlocks } from "@/components/DashboardBlocks";
import requireUser from "../utils/hooks";
import { InvoiceGraph } from "@/components/invoiceGraph";
import { RecentInvoices } from "@/components/RecentInvoices";
import { prisma } from "@/lib/prisma";
import { EmptyState } from "@/components/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

async function getData(userId: string) {
  const data = await prisma.invoice.findMany({
    where: {
      userId: userId,
    },
    select: {
      id: true,
    },
  });
  return data;
}
export default async function DashboardRoute() {
  const session = await requireUser();
  const data = await getData(session.user?.id as string);
  return (
    <>
      {data.length < 1 ? (
        <EmptyState 
        title="Welcome to InvoLink - Smart & Simple Invoice Management!"
        description="No invoices were found. Please create a new one."
        buttontext="Create Invoice"
        href="/dashboard/invoices/create"
        />
      ) : (
        <Suspense fallback={<Skeleton className="w-full h-full flex-1" />}>
          <DashboardBlocks />
          <div className="grid gap-4 lg:grid-cols-3 md:gap-8">
            <InvoiceGraph />
            <RecentInvoices />
          </div>
        </Suspense>
      )}
    </>
  );
}
