import { russo } from "@/styles/fonts";

const AuctionProfile = ({
  img,
  collectionName,
}: {
  img: string;
  collectionName: string;
}) => {
  return (
    <div
      className={`${russo.variable} font-sans p-5 m-5 flex flex-col space-y-3 w-64 bg-offBlack-10 rounded-lg drop-shadow-xl hover:-translate-y-2 transition animate-fadeIn cursor-pointer`}
    >
      <img src={img} alt="nft" width="250" height="250" />
      <div className="flex flex-col space-y-1">
        <p className="text-2xl">{collectionName}</p>
        <p className="text-l text-green">{"#1243"}</p>
      </div>
      <div>
        <div className="flex justify-between">
          <p>Debt Raised: </p>
          <p>Max</p>
        </div>
        <div className="flex justify-between">
          <p className="text-green">1,243.23 USDCx</p>
          <p>87%</p>
        </div>
      </div>
      <div>
        <p>Current interest rate: </p>
        <p className="text-green">12.4% APY</p>
      </div>
    </div>
  );
};

export default AuctionProfile;
