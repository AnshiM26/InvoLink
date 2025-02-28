import { prisma } from "@/lib/prisma";
import { Graph } from "./Graph";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import requireUser from "@/app/utils/hooks";

async function getInvoices(userId: string) {
  const rawData = await prisma.invoice.findMany({
    where: {
      status: "PAID",
      userId: userId,
      createdAt: {
        lte: new Date(),
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
    },
    select: {
      createdAt: true,
      total: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  //aggregating data by date
  const aggregatedData = rawData.reduce(
    (acc: { [key: string]: number }, curr) => {
      const date = new Date(curr.createdAt).toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
      });
      acc[date] = (acc[date] || 0) + curr.total;
      return acc;
    },
    {}
  );

  //array formatting for graph
  const transformedData = Object.entries(aggregatedData)
    .map(([date, amount]) => ({
      date,
      amount,
      originalDate: new Date(date + ", " + new Date().getFullYear()),
    }))
    .sort((a, b) => a.originalDate.getTime() - b.originalDate.getTime())
    .map(({ date, amount }) => ({
      date,
      amount,
    }));
  return transformedData;
}

export async function InvoiceGraph() {
  const session = await requireUser();
  const data = await getInvoices(session.user?.id as string);
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Paid Invoices</CardTitle>
        <CardDescription>
          Invoices that have been paid in the last 30 days. 
          <p>Note: Graph shows information for payments that have been PAID in the PAST 30 days ONLY.</p>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Graph data={data}/>
      </CardContent>
    </Card>
  );
}
