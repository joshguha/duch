import Sidebar from "@/components/Sidebar";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useContext, useState, useEffect, useRef } from "react";
import { NavigationContext } from "@/contexts/Navigation";
import Auctions from "@/components/Auctions";
import AuctionDetails from "@/components/AuctionDetails";

export default function Home() {
  const { location } = useContext(NavigationContext);
  const [localLocation, setLocalLocation] = useState(location);
  const [fadeOut, setFadeOut] = useState(false);

  const prevLocation = useRef(location);

  useEffect(() => {
    if (prevLocation.current !== location) {
      setFadeOut(true);
      setTimeout(() => {
        setLocalLocation(location);
        setFadeOut(false);
      }, 200);
      prevLocation.current = location;
    }
  }, [location]);

  return (
    <div className="flex">
      <Sidebar />
      <div className="h-screen flex flex-col flex-1 bg-dark p-10 py-12 transition ">
        <div className="flex justify-end mb-10">
          <ConnectButton />
        </div>
        <div
          className={`flex flex-col flex-1 overflow-y-scroll ${
            fadeOut && "animate-fadeOut"
          }`}
        >
          {
            {
              auctions: <Auctions />,
              auctionDetails: <AuctionDetails />,
            }[localLocation]
          }
        </div>
      </div>
    </div>
  );
}
