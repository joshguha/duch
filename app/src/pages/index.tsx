import Sidebar from "@/components/Sidebar";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useContext, useState, useEffect, useRef } from "react";
import { NavigationContext } from "@/contexts/Navigation";
import Auctions from "@/components/Auctions";
import AuctionDetails from "@/components/AuctionDetails";
import { russo } from "@/styles/fonts";
import ActiveLoans from "@/components/ActiveLoans";
import ActiveLoanDetails from "@/components/ActiveLoans/components/ActiveLoanDetails";
import CreateLoanAuction from "@/components/CreateLoanAuction";

export default function Home() {
  const { location, setLocation } = useContext(NavigationContext);
  const [localLocation, setLocalLocation] = useState(location);
  const [fadeOut, setFadeOut] = useState(false);

  const prevLocation = useRef(location);

  const setLocationNewLoanAuction = () => setLocation("newLoanAuction");

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
        <div className="flex justify-between mb-10">
          <button
            className={`bg-green rounded-xl p-10 py-3 ${russo.variable} font-heading text-dark hover:scale-105 transition`}
            onClick={setLocationNewLoanAuction}
          >
            Create a Loan Auction
          </button>
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
              activeLoans: <ActiveLoans />,
              activeLoanDetails: <ActiveLoanDetails />,
              newLoanAuction: <CreateLoanAuction />,
            }[localLocation]
          }
        </div>
      </div>
    </div>
  );
}
