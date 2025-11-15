import Navbar from "@/components/Navbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        {children}
      </div>
    </>
  );
}
