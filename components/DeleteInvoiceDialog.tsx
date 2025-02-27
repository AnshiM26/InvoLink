"use client"
import DeleteInvoice from "@/app/actions";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { useState } from "react";
import { redirect } from "next/navigation";

export default function DelInvoiceDialog(id:string){
    return (
        <Dialog>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Invoice?</DialogTitle>
              <DialogDescription>
                This will permanently delete this invoice. This action cannot be
                reversed.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="destructive"
                onClick={()=>DeleteInvoice(id)}
              >
                Delete
              </Button>
              <Button variant="secondary" onClick={() => redirect("/dashboard/invoices")}>
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
}