import Link from "next/link";
import {Button} from "@/components/ui/button";

export default function BackButton({href, label}: {href: string, label: string}) {
  return (
    <Button variant={'link'} asChild className={"w-full font-medium"}>
      <Link href={href} aria-label={label}>{label}</Link>
    </Button>
  )
}