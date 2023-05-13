import OnboardingSidebar from "@/components/OnboardingSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="grid grid-cols-5">
        <div className="col-span-1 h-screen bg-slate-100">
          <OnboardingSidebar />
          <p>hello world</p>
        </div>
        <div className="col-span-4 h-screen">{children}</div>
      </div>
    </section>
  );
}
