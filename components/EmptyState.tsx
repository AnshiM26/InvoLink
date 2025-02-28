import { FolderOpen, PlusCircle } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "./ui/button";

interface EmptyStateProps{
    title:string,
    description:string,
    buttontext:string,
    href:string
}
export function EmptyState({title,description,buttontext,href}:EmptyStateProps) {
  return (
    <div className="flex flex-col flex-1 h-full items-center justify-center rounded-md border-2 border-dashed p-8 text-center animate-in fade-in-50">
      <div className="flex items-center justify-center size-20 rounded-full bg-primary/10">
        <FolderOpen className="size-10 text-primary" />
      </div>
      <h1 className="mt-6 text-xl font-semibold">{title}</h1>
      <p className="mb-8 mt-2">{description}</p>
      <Link href={href} className={buttonVariants()}>
      <PlusCircle className="size-4 mr-2" />{buttontext}
      </Link>
    </div>
  );
}
