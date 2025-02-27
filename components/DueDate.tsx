export default function getDueDate(date: any, option: any) {
    const invoiceDate = new Date(date);
    const optionStr = String(option).toLowerCase();
    const daysToAdd =
        optionStr === "net 15" || optionStr === "15" ? 15 :
        optionStr === "net 30" || optionStr === "30" ? 30 : 0;
    invoiceDate.setDate(invoiceDate.getDate() + daysToAdd);
    return new Intl.DateTimeFormat("en-IN", { dateStyle: "long" }).format(invoiceDate);
};