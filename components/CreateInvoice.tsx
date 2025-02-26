"use client";
import { Calendar1Icon, CalendarIcon } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Calendar } from "./ui/calendar";
import { useActionState, useState } from "react";
import { Textarea } from "./ui/textarea";
import { SubmitButton } from "./SubmitButtons";
import { createInvoice } from "@/app/actions";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { invoiceSchema } from "@/app/utils/zodSchemas";
import { formatCurrency } from "@/app/utils/hooks";

interface CreateInvoiceProps {
  firstName: string;
  lastName: string;
  address: string;
  email: string;
}

export function CreateInvoice({
  firstName,
  lastName,
  address,
  email,
}: CreateInvoiceProps) {
  const [lastResult, formAction] = useActionState(createInvoice, undefined);
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: invoiceSchema,
      });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [rate, setRate] = useState("");
  const [quantity, setQuantity] = useState("");
  const [currency, setCurrency] = useState("INR");

  const totalCalc = (Number(quantity) || 0) * (Number(rate) || 0);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6">
        <form
          id={form.id}
          action={formAction}
          onSubmit={form.onSubmit}
          noValidate
        >
          <Input
            type="hidden"
            name={fields.date.name}
            value={selectedDate.toISOString()}
          />
          <Input type="hidden" name={fields.total.name} value={totalCalc} />
          <div className="flex flex-col gap-2 w-fit mb-6">
            <div className="flex items-center gap-4">
              <Badge variant="secondary">Draft</Badge>
              <Input
                name={fields.invoiceName.name}
                key={fields.invoiceName.key}
                defaultValue={fields.invoiceName.initialValue}
                placeholder="Invoice Name"
              />
              <p className="text-sm text-red-600">
                {fields.invoiceName.errors}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div>
              <Label>Invoice No.</Label>
              <div className="flex">
                <span className="px-3 border border-r-0 bg-muted flex items-center">
                  #
                </span>
                <Input
                  name={fields.invoiceNumber.name}
                  key={fields.invoiceNumber.key}
                  defaultValue={fields.invoiceNumber.initialValue}
                  className="rounded-l-none"
                  placeholder="5"
                />
              </div>
              <p className="text-sm text-red-600">
                {fields.invoiceNumber.errors}
              </p>
            </div>
            <div>
              <Label>Currency</Label>
              <Select
                defaultValue="INR"
                name={fields.currency.name}
                key={fields.currency.key}
                onValueChange={(value) => setCurrency(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INR">Indian Rupee -- INR</SelectItem>
                  <SelectItem value="USD">
                    United States Dollor -- USD
                  </SelectItem>
                  <SelectItem value="EUR">Euro -- EUR</SelectItem>
                  <SelectItem value="CAD">Canadian Dollor -- CAD</SelectItem>
                  <SelectItem value="CNY">Chinese Yuan -- CNY</SelectItem>
                  <SelectItem value="JPY">Japenese Yen -- JPY</SelectItem>
                  <SelectItem value="RUB">Russian Ruble -- RUB</SelectItem>
                  <SelectItem value="SGD">Singapore Dollor -- SGD</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-red-600">{fields.currency.errors}</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label>From</Label>
              <div className="space-y-2">
                <Input
                  name={fields.fromName.name}
                  key={fields.fromName.key}
                  defaultValue={firstName+" "+lastName}
                  placeholder="Your Name"
                />
                <p className="text-sm text-red-600">{fields.fromName.errors}</p>
                <Input
                  name={fields.fromEmail.name}
                  key={fields.fromEmail.key}
                  defaultValue={email}
                  placeholder="Your Email"
                />
                <p className="text-sm text-red-600">
                  {fields.fromEmail.errors}
                </p>
                <Input
                  name={fields.fromAddress.name}
                  key={fields.fromAddress.key}
                  defaultValue={address}
                  placeholder="Your Address"
                />
                <p className="text-sm text-red-600">
                  {fields.fromAddress.errors}
                </p>
              </div>
            </div>
            <div>
              <Label>To</Label>
              <div className="space-y-2">
                <Input
                  name={fields.clientName.name}
                  key={fields.clientName.key}
                  defaultValue={fields.clientName.initialValue}
                  placeholder="Client Name"
                />
                <p className="text-sm text-red-600">
                  {fields.clientName.errors}
                </p>
                <Input
                  name={fields.clientEmail.name}
                  key={fields.clientEmail.key}
                  defaultValue={fields.clientEmail.initialValue}
                  placeholder="Client Email"
                />
                <p className="text-sm text-red-600">
                  {fields.clientEmail.errors}
                </p>
                <Input
                  name={fields.clientAddress.name}
                  key={fields.clientAddress.key}
                  defaultValue={fields.clientAddress.initialValue}
                  placeholder="Client Address"
                />
                <p className="text-sm text-red-600">
                  {fields.clientAddress.errors}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <div>
                  <Label>Date</Label>
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-[280px] bg-muted text-left justify-start"
                    >
                      <CalendarIcon />
                      {selectedDate ? (
                        new Intl.DateTimeFormat("en-Indian", {
                          dateStyle: "long",
                        }).format(selectedDate)
                      ) : (
                        <span>Pick a Date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Calendar
                      selected={selectedDate}
                      onSelect={(date) => setSelectedDate(date || new Date())}
                      mode="single"
                      fromDate={new Date()}
                    />
                  </PopoverContent>
                </Popover>
                <p className="text-sm text-red-600">{fields.date.errors}</p>
              </div>
            </div>
            <div>
              <Label>Invoice Due</Label>
              <Select
                name={fields.dueDate.name}
                key={fields.dueDate.key}
                defaultValue={fields.dueDate.initialValue}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select due date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Due on Reciept</SelectItem>
                  <SelectItem value="15">Net 15</SelectItem>
                  <SelectItem value="30">Net 30</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-red-600">{fields.dueDate.errors}</p>
            </div>
          </div>

          <div>
            <div className="grid grid-cols-12 gap-4 mb-2 font-medium">
              <p className="col-span-6">Description</p>
              <p className="col-span-2">Quantity</p>
              <p className="col-span-2">Rate</p>
              <p className="col-span-2">Amount</p>
            </div>
            <div className="grid grid-cols-12 gap-4 mb-4">
              <div className="col-span-6">
                <Textarea
                  name={fields.invoiceItemDescription.name}
                  key={fields.invoiceItemDescription.key}
                  defaultValue={fields.invoiceItemDescription.initialValue}
                  placeholder="Item name & description"
                />
                <p className="text-sm text-red-600">
                  {fields.invoiceItemDescription.errors}
                </p>
              </div>
              <div className="col-span-2">
                <Input
                  name={fields.invoiceItemQuantity.name}
                  key={fields.invoiceItemQuantity.key}
                  type="number"
                  placeholder="0"
                  onChange={(e) => setQuantity(e.target.value)}
                />
                <p className="text-sm text-red-600">
                  {fields.invoiceItemQuantity.errors}
                </p>
              </div>
              <div className="col-span-2">
                <Input
                  name={fields.invoiceItemRate.name}
                  key={fields.invoiceItemRate.key}
                  onChange={(e) => setRate(e.target.value)}
                  type="number"
                  placeholder="0"
                />
                <p className="text-sm text-red-600">
                  {fields.invoiceItemRate.errors}
                </p>
              </div>
              <div className="col-span-2">
                <Input value={formatCurrency(totalCalc, currency)} disabled />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="w-1/3">
              <div className="flex justify-between py-2">
                <span>Subtotal</span>
                <span>{formatCurrency(totalCalc, currency)}</span>
              </div>
              <div className="flex justify-between py-2 border-t">
                <span>Total {currency}</span>
                <span className="font-medium underline underline-offset-2">
                  {formatCurrency(totalCalc, currency)}
                </span>
              </div>
            </div>
          </div>
          <div>
            <Label>Note</Label>
            <Textarea
              name={fields.note.name}
              key={fields.note.key}
              defaultValue={fields.note.initialValue}
              placeholder="Add your note"
            />
          </div>
          <div className="flex items-center justify-end mt-6">
            <div>
              <SubmitButton text="Send invoice to client" />
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
