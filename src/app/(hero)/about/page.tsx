import {Metadata} from "next";

export const metadata: Metadata = {
  description: "About Me",
  title: "About Me",
}

export default function Page() {
  return (
    <div className={'absolute inset-0 flex items-center justify-center'}>
      <h1>About Me </h1>
    </div>
  )
}
