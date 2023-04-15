import { GiCash } from "react-icons/gi";
import { AiOutlineClockCircle } from "react-icons/ai";
import { NavigationContext } from "@/contexts/Navigation";

import { useAuctionDetails } from "@/hooks/useAuctionDetails";
import { useContext } from "react";
import { russo } from "@/styles/fonts";
import Loader from "../Loader";

const AuctionDetails = () => {
  const { selectedAuction } = useContext(NavigationContext);
  const { auctionDetails, loading } = useAuctionDetails(selectedAuction);

  return (
    <div className="flex flex-1 justify-center items-center animate-fadeIn">
      {loading || !auctionDetails ? (
        <Loader />
      ) : (
        <div className="animate-fadeIn flex flex-1">
          <div className="w-1/2 flex justify-center items-center">
            <img
              src={auctionDetails.img}
              alt="Collateral NFT Image"
              width="500"
              height="500"
            />
          </div>
          <div className="w-1/2 flex flex-col justify-center">
            {/* Collateral details */}
            <div className="mb-5">
              <p className={`text-4xl mb-5 ${russo.variable} font-heading`}>
                Auction Details
              </p>
              <div className="flex items-end space-x-4">
                <p className={`text-2xl ${russo.variable} font-heading`}>
                  Bored Apes Yacht Club
                </p>
                <p className="text-xl text-green">#1242</p>
              </div>
            </div>

            {/* Debt level */}
            <div className="flex space-x-12 my-5 items-center">
              <GiCash fontSize={50} />
              <div>
                <p className="mb-2 text-2xl">1,242.12 USDCx</p>
                <p>Debt raised</p>
              </div>
              <div>
                <p className="mb-2 text-2xl">62% of max</p>
                <p>(2,122.12 USDCx)</p>
              </div>
              <div>
                <p className="mb-2 text-2xl">90 days</p>
                <p>Loan Term</p>
              </div>
            </div>
            {/* Auction timing */}
            <div className="flex space-x-12 my-5">
              <AiOutlineClockCircle fontSize={50} />
              <div className="mb-5">
                <p className="mb-2 text-l">10th April 2022, 21:00</p>
                <p>Auction started</p>
              </div>
              <div className="mb-5">
                <p className="mb-2 text-l">10th May 2022, 12:00</p>
                <p>Auction expires</p>
              </div>
            </div>
            {/* Interest rate */}
            <div className="flex space-x-12 my-5">
              <div className="mb-5 w-1/2">Graph</div>
              <div className="mb-5 w-1/2">
                <div className="mb-5">
                  <p className="text-3xl">12.24%</p>
                  <p className="text-xl text-green">Current APR</p>
                </div>
                <div>
                  <p className="text-l">20.24%</p>
                  <p>Max APR</p>
                </div>
              </div>
            </div>
            {/* User Accept Button */}
            <div className="flex space-x-12 my-5 mt-10 items-center">
              <button
                className={`bg-green rounded-xl p-10 py-3 ${russo.variable} font-heading text-dark hover:scale-105 transition w-48 m-auto`}
              >
                Accept Loan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuctionDetails;
