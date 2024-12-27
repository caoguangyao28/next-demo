import {Metadata} from "next";
import Hero from "@/components/Hero";
import performanceSrc from '/public/performance.jpg'


export const metadata: Metadata = {
  title: "performance",
  description: "Performance page",
};

export default function Page() {
  return (
    <Hero imgUrl={performanceSrc} altTxt="Performance" content="We serve high performance applications."  />
  )
}
