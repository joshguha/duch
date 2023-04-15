import { useContext } from "react";
import { WeiPerEther } from "@ethersproject/constants";
import { NavigationContext } from "@/contexts/Navigation";
import { russo } from "@/styles/fonts";
import { Auction } from "@/hooks/useAuctions";
import { formatFixed } from "@ethersproject/bignumber";
import { formatTimestamp } from "@/utils/formatTimestamp";
import { convertSecondsToDays } from "@/utils/convertSecondsToDays";
import { convertInterestPerSecondToAPR } from "@/utils/convertInterestPerSecondToAPR";

import img1 from "../../public/fakeApes/1.jpg";
import img2 from "../../public/fakeApes/2.jpg";
import img3 from "../../public/fakeApes/3.jpg";
import img4 from "../../public/fakeApes/4.jpg";
import img5 from "../../public/fakeApes/5.jpg";
import img6 from "../../public/fakeApes/6.jpg";

const images = [img1, img2, img3, img4, img5, img6];

const AuctionProfile = ({ auction }: { auction: Auction }) => {
  const { setLocation, setSelectedAuction } = useContext(NavigationContext);

  const onClick = () => {
    setSelectedAuction("1");
    setLocation("auctionDetails");
  };

  return (
    <div
      className="p-5 m-5 flex flex-col space-y-3 w-64 bg-offBlack-10 rounded-lg drop-shadow-xl hover:-translate-y-2 transition animate-fadeIn cursor-pointer"
      onClick={onClick}
    >
      <img
        src={images[auction.nftCollateralTokenId.toNumber() % 6].src}
        alt="nft"
        width="250"
        height="250"
        style={{ borderRadius: "10px" }}
      />
      <div className="flex flex-col space-y-1">
        <p className={`text-2xl ${russo.variable} font-heading`}>
          {auction.collectionName}
        </p>
        <p className="text-l text-green">
          #{auction.nftCollateralTokenId.toString()}
        </p>
      </div>
      <div>
        <div className="flex justify-between">
          <p>Debt Raised: </p>
          <p>% / Max</p>
        </div>
        <div className="flex justify-between">
          <p className="text-green">
            {formatFixed(auction.debtRaised, 18)} {auction.denominatedTokenName}
          </p>
          <p>
            {formatFixed(
              auction.debtRaised
                .mul(WeiPerEther)
                .div(auction.maxIRatePerSecond),
              16
            )}
            %
          </p>
        </div>
      </div>
      <div>
        <p>Current interest rate: </p>
        <p className="text-green">
          {(convertInterestPerSecondToAPR(auction.currentIRate) * 100).toFixed(
            2
          )}
          % APR
        </p>
      </div>
      <div>
        <p>Starts: </p>
        <p className="text-green">
          {formatTimestamp(auction.auctionStartTime)}
        </p>
      </div>
      <div>
        <p>Expires: </p>
        <p className="text-green">
          {formatTimestamp(
            auction.auctionStartTime.add(auction.auctionDuration)
          )}
        </p>
      </div>
      <div>
        <p>Term: </p>
        <p className="text-green">
          {convertSecondsToDays(auction.loanTerm)} day(s)
        </p>
      </div>
    </div>
  );
};

export default AuctionProfile;
