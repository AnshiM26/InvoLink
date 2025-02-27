import { CheckCircle, DownloadCloudIcon, Mail, MailIcon, MoreHorizontal, PencilIcon, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Link from "next/link";

interface invoiceActionsProps{
  id:string;
}
export function InvoiceActions({id}:invoiceActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="secondary">
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
            <Link href={`/dashboard/invoices/${id}`}><PencilIcon className="size-4 mr-2"/>Edit Invoice</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
            <Link href={`/api/invoice/${id}`} target="_blank"><DownloadCloudIcon className="size-4 mr-2"/>Download Invoice</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
            <Link href=""><Mail className="size-4 mr-2"/>Reminder Email</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
            <Link href=""><Trash2 className="size-4 mr-2"/>Delete Invoice</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
            <Link href=""><CheckCircle className="size-4 mr-2"/>Mark as paid</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
