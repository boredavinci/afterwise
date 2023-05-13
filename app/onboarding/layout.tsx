import OnboardingSidebar from "@/components/OnboardingSidebar";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
  <div className="grid grid-cols-5">
    <div className="col-span-1 h-screen bg-slate-100">
      <OnboardingSidebar />
  </div>
  <div className="col-span-4 h-screen">
      {children}
  </div>
</div>
    </section>
  );
}