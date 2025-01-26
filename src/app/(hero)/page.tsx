import {Metadata} from "next";
import Hero from "@/components/Hero";

// 页面元数据
export const metadata: Metadata = {
  title: "Home",
  description: "Home page",
};

export default function Home() {
  return (
      <Hero title={"My blogs home is building"} />
  );
}
