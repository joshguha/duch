import Sidebar from "@/components/Sidebar";

export default function Home() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="h-screen flex-1 bg-dark p-10 py-12">Main</div>
    </div>
  );
}
