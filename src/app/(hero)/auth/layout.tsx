export default function LoginLayout({
    children
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
      <section className={"w-full items-center min-w-min h-full rounded-2xl  overflow-auto p-5 flex justify-center"}>
        {children}
      </section>
    )
}