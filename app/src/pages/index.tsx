import Sidebar from "@/components/Sidebar";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Loader from "@/components/Loader";
import { useAuctions } from "@/hooks/useAuctions";
import AuctionProfile from "@/components/AuctionProfile";

export default function Home() {
  const { auctions, loading } = useAuctions();

  return (
    <div className="flex">
      <Sidebar />
      <div className="h-screen flex flex-col flex-1 bg-dark p-10 py-12">
        <div className="flex justify-end mb-10">
          <ConnectButton />
        </div>
        <div className="flex justify-center items-center flex-1 flex-wrap overflow-y-scroll	">
          {loading ? (
            <Loader />
          ) : (
            auctions.map(({ img, collectionName }, index) => (
              <AuctionProfile
                key={index}
                img={img}
                collectionName={collectionName}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
