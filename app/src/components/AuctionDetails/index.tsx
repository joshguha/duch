import { GiCash } from "react-icons/gi";
import { AiOutlineClockCircle } from "react-icons/ai";
import { useElementSize } from "usehooks-ts";
import { NavigationContext } from "@/contexts/Navigation";
import { WeiPerEther } from "@ethersproject/constants";
import { useContext, useEffect, useRef } from "react";
import { russo } from "@/styles/fonts";
import Loader from "../Loader";
import { images } from "../AuctionProfile";
import { formatFixed } from "@ethersproject/bignumber";
import { formatTimestamp } from "@/utils/formatTimestamp";
import { convertSecondsToDays } from "@/utils/convertSecondsToDays";
import { convertInterestPerSecondToAPR } from "@/utils/convertInterestPerSecondToAPR";
import { generateData } from "./generateData";
import { constructGraph } from "./constructGraph";

const AuctionDetails = () => {
  const graph = useRef<SVGSVGElement | null>(null);
  const [graphContainerRef, { width, height }] = useElementSize();

  const { selectedAuction } = useContext(NavigationContext);

  // Construct graph on component mount
  useEffect(() => {
    if (!selectedAuction) return;
    const data = generateData(
      selectedAuction.auctionStartTime.toNumber() * 1000,
      selectedAuction.auctionStartTime
        .add(selectedAuction.auctionDuration)
        .toNumber() * 1000,
      convertInterestPerSecondToAPR(selectedAuction.maxIRatePerSecond) * 100
    );
    constructGraph(graph, [width, height], data);
  }, [width, height]);

  return (
    <div className="flex flex-1 justify-center items-center animate-fadeIn">
      {!selectedAuction ? (
        <Loader />
      ) : (
        <div className="animate-fadeIn flex flex-1">
          <div className="w-1/2 flex justify-center items-center">
            <img
              src={
                images[selectedAuction?.nftCollateralTokenId.toNumber() % 6].src
              }
              alt="Collateral NFT Image"
              width="500"
              height="500"
              style={{ borderRadius: "20px" }}
            />
          </div>
          <div className="w-1/2 flex flex-col justify-center">
            {/* Collateral details */}
            <div className="mb-5">
              <p className={`text-4xl mb-5 ${russo.variable} font-heading`}>
                Auction details
              </p>
              <div className="flex items-end space-x-4">
                <p className={`text-2xl ${russo.variable} font-heading`}>
                  {selectedAuction.collectionName}
                </p>
                <p className="text-xl text-green">
                  #{selectedAuction.nftCollateralTokenId.toString()}
                </p>
              </div>
            </div>

            {/* Debt level */}
            <div className="flex space-x-12 my-5 items-center">
              <GiCash fontSize={50} />
              <div>
                <p className="mb-2 text-2xl">
                  {formatFixed(selectedAuction.debtRaised, 18)}{" "}
                  {selectedAuction.denominatedTokenName}
                </p>
                <p>Debt raised</p>
              </div>
              <div>
                <p className="mb-2 text-2xl">
                  {formatFixed(
                    selectedAuction.debtRaised
                      .mul(WeiPerEther)
                      .div(selectedAuction.principal),
                    16
                  )}
                  % of max
                </p>
                <p>
                  ({formatFixed(selectedAuction.principal, 18)}{" "}
                  {selectedAuction.denominatedTokenName})
                </p>
              </div>
              <div>
                <p className="mb-2 text-2xl">
                  {" "}
                  {convertSecondsToDays(selectedAuction.loanTerm)} day(s)
                </p>
                <p>Loan Term</p>
              </div>
            </div>
            {/* Auction timing */}
            <div className="flex space-x-12 my-5">
              <AiOutlineClockCircle fontSize={50} />
              <div className="mb-5">
                <p className="mb-2 text-l">
                  {formatTimestamp(selectedAuction.auctionStartTime)}
                </p>
                <p>
                  Auction{" "}
                  {selectedAuction.auctionStartTime.toNumber() <
                  Date.now() / 1000
                    ? "started"
                    : "will start"}
                </p>
              </div>
              <div className="mb-5">
                <p className="mb-2 text-l">
                  {formatTimestamp(
                    selectedAuction.auctionStartTime.add(
                      selectedAuction.auctionDuration
                    )
                  )}
                </p>
                <p>Auction expires</p>
              </div>
            </div>
            {/* Interest rate */}
            <div className="flex space-x-12 my-5">
              <div ref={graphContainerRef} className="w-1/2 mb-5">
                <svg className="w-full h-64 rounded-xl" ref={graph} />
              </div>
              <div className="mb-5 w-1/2">
                <div className="mb-5">
                  <p className="text-3xl">
                    {(
                      convertInterestPerSecondToAPR(
                        selectedAuction.currentIRate
                      ) * 100
                    ).toFixed(2)}
                    %
                  </p>
                  <p className="text-xl text-green">Current APR</p>
                </div>
                <div>
                  <p className="text-l">
                    {" "}
                    {(
                      convertInterestPerSecondToAPR(
                        selectedAuction.maxIRatePerSecond
                      ) * 100
                    ).toFixed(2)}
                    %
                  </p>
                  <p>Max APR</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuctionDetails;
