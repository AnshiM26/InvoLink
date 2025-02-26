import { redirect } from "next/navigation";
import { auth } from "./auth";

export default async function requireUser(){
    const session = await auth();
  if(!session?.user){
    redirect("/login")
  }
  return session;
}

// interface formatCurrencyProps{
//   amount: number;
//   currency: string 
// }
export function formatCurrency(amount:number,currency:string){
  return new Intl.NumberFormat("en-IN",{
    style:"currency",
    currency:currency
  }).format(amount)
}