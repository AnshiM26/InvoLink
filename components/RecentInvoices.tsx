import { prisma } from "@/lib/prisma";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

async function getData(userId:string){
    const data=await prisma.invoice.findMany({
        where:{
            userId:userId
        },
        select:{
            id:true,
            
        }
    })
}
export function RecentInvoices(){
    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Invoices</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-4">
                    <Avatar className="hidden sm:flex size-9">
                        <AvatarFallback>AM</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-1">
                        <p className="text-sm font-medium leading-none">Anshika Misra</p>
                        <p className="text-sm text-muted-foreground">anshika@gmail.com</p>
                    </div>
                    <div className="ml-auto font-medium">
                        +500.00
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}