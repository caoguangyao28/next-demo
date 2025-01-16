import {Metadata} from "next";
import Hero from "@/components/Hero";
import homeSrc from '/public/home.jpg'

// 页面元数据
export const metadata: Metadata = {
  title: "Home",
  description: "Home page",
};

export default function Home() {
  return (
    <Hero imgUrl={homeSrc} altTxt={"home"} content={"My blogs home is building"} />
  );
}
