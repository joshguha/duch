import Loader from "../Loader";
import AuctionProfile from "../AuctionProfile";
import { useAuctions } from "@/hooks/useAuctions";

const Auctions = () => {
  const { auctions, loading } = useAuctions();
  return (
    <div className="flex justify-center items-center flex-1 flex-wrap	animate-fadeIn">
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
  );
};

export default Auctions;
