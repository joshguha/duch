import { useContext } from "react";
import moment from "moment";
import { WeiPerEther } from "@ethersproject/constants";
import { NavigationContext } from "@/contexts/Navigation";
import { russo } from "@/styles/fonts";
import { Auction } from "@/hooks/useAuctions";
import { formatFixed } from "@ethersproject/bignumber";
import { formatTimestamp } from "@/utils/formatTimestamp";
import { convertSecondsToDays } from "@/utils/convertSecondsToDays";

const AuctionProfile = ({ auction }: { auction: Auction }) => {
  const { setLocation, setSelectedAuction } = useContext(NavigationContext);

  const onClick = () => {
    setSelectedAuction("1");
    setLocation("auctionDetails");
  };

  const currentAPR = formatFixed(auction.currentIRate, 18);

  const maxAPR = formatFixed(auction.maxIRatePerSecond, 18);

  const start = moment(auction.auctionStartTime.toNumber() * 1000);

  console.log(
    formatTimestamp(auction.auctionStartTime.add(auction.auctionDuration))
  );

  return (
    <div
      className="p-5 m-5 flex flex-col space-y-3 w-64 bg-offBlack-10 rounded-lg drop-shadow-xl hover:-translate-y-2 transition animate-fadeIn cursor-pointer"
      onClick={onClick}
    >
      <img src={""} alt="nft" width="250" height="250" />
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
        <p className="text-green">{currentAPR} APR</p>
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
