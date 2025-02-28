import { DashboardBlocks } from "@/components/DashboardBlocks";
import requireUser from "../utils/hooks";
import { InvoiceGraph } from "@/components/invoiceGraph";
import { RecentInvoices } from "@/components/RecentInvoices";

export default async function DashboardRoute() {
  const session=await requireUser();
  return (
    <>
    <DashboardBlocks />
    <div className="grid gap-4 lg:grid-cols-3 md:gap-8">
      <InvoiceGraph />
      <RecentInvoices />
    </div>
    </>
  );
}
