import {Metadata} from "next";
import Hero from "@/components/Hero";
import scaleSrc from '/public/scale.jpg';

export const metadata: Metadata = {
  description: "Scale page",
  title: "Scale",
}
export default function Page() {
  return (
    <Hero imgUrl={scaleSrc} altTxt={'Scale'} content={'Scale page'} />
  )
}
