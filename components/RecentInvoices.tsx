import { prisma } from "@/lib/prisma";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import requireUser, { formatCurrency } from "@/app/utils/hooks";

async function getData(userId: string) {
  const data = await prisma.invoice.findMany({
    where: {
      userId: userId,
    },
    select: {
      id: true,
      clientName: true,
      clientEmail: true,
      total: true,
      currency:true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 7,
  });
  return data;
}
export async function RecentInvoices() {
  const session = await requireUser();
  const data = await getData(session.user?.id as string);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Invoices</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-8">
        {data.map((item) => (
          <div className="flex items-center gap-4" key={item.id}>
            <Avatar className="hidden sm:flex size-9">
              <AvatarFallback>{item.clientName.slice(0,2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium leading-none">{item.clientName}</p>
              <p className="text-sm text-muted-foreground">{item.clientEmail}</p>
            </div>
            <div className="ml-auto font-medium">{formatCurrency(item.total,item.currency)}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
