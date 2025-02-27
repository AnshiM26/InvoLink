"use client";
import {
  CheckCircle,
  DownloadCloudIcon,
  Mail,
  MoreHorizontal,
  PencilIcon,
  Trash2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Link from "next/link";
import { toast } from "sonner";
import { startTransition, useState } from "react";
import DeleteInvoice from "@/app/actions";
import { redirect } from "next/navigation";
import { Toaster } from "./ui/sonner";

interface invoiceActionsProps {
  id: string;
}
export function InvoiceActions({ id }: invoiceActionsProps) {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const handleSendReminder = () => {
    toast.promise(
      fetch(`/api/email/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      {
        loading: "Sending reminder email...",
        success: "Reminder email sent successfully",
        error: "Failed to send reminder email",
      }
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="secondary">
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/dashboard/invoices/${id}`}>
            <PencilIcon className="size-4 mr-2" />
            Edit Invoice
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/api/invoice/${id}`} target="_blank">
            <DownloadCloudIcon className="size-4 mr-2" />
            Download Invoice
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSendReminder}>
          <Mail className="size-4 mr-2" />
          Reminder Email
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => setShowDeleteConfirmation(true)}>
          <Trash2 className="size-4 mr-2" />
          Delete Invoice
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="">
            <CheckCircle className="size-4 mr-2" />
            Mark as paid
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
      <DelInvoiceDialog
        invoiceid={id}
        open={showDeleteConfirmation}
        onOpenChange={setShowDeleteConfirmation}
      />
    </DropdownMenu>
  );
}

interface DelInvoiceDialogProps {
  invoiceid: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
function DelInvoiceDialog({
  invoiceid,
  open,
  onOpenChange,
}: DelInvoiceDialogProps) {
  async function handleDelete() {
    startTransition(async () => {
      try {
        const response = await DeleteInvoice(invoiceid);
        if (response?.error) {
          throw new Error(response.error); 
        }
        onOpenChange(false);
        toast("Deleted successfully."); 
      } catch (error) {
        toast("Something went wrong");
        console.error(error);
      }
      redirect("/dashboard/invoices")
    });
  }
  <Toaster richColors  />
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Invoice?</DialogTitle>
          <DialogDescription>
            This will permanently delete this invoice. This action cannot be
            reversed.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="destructive" onClick={() => handleDelete()}>
            Delete
          </Button>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
