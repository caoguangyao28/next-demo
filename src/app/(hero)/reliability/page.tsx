import {Metadata} from "next";
import reliablilitySrc from "/public/reliability.jpg";
import Hero from "@/components/Hero";

export const metadata: Metadata = {
  description: "Reliability page",
  title: "Reliability",
}

export default function Page() {
  return (
    <Hero imgUrl={reliablilitySrc} altTxt={"home"} content={"Be waiting to coding"} />
  )
}
