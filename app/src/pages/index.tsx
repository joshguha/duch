import Sidebar from "@/components/Sidebar";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Loader from "@/components/Loader";

export default function Home() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="h-screen flex flex-col flex-1 bg-dark p-10 py-12">
        <div className="flex justify-end">
          <ConnectButton />
        </div>
        <div className="flex justify-center items-center flex-1">
          <Loader />
        </div>
      </div>
    </div>
  );
}
