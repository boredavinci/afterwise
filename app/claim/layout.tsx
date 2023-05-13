import OnboardingSidebar from "@/components/OnboardingSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section>{children}</section>;
}
