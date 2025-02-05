import {Metadata} from "next";
import Hero from "@/components/Hero";

// 页面元数据
export const metadata: Metadata = {
  title: "Home",
  description: "Home page",
};

export default function Home() {
  return (
      <Hero title={"总有些事情值得去书写、记忆～"} />
  );
}
