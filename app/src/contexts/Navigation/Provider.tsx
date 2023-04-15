import { Auction } from "@/hooks/useAuctions";
import { ReactNode, useState, useEffect } from "react";
import Context from "./Context";

const Provider = ({ children }: { children: ReactNode }) => {
  const [location, setLocation] = useState("auctions");
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);
  const [selectedActiveLoan, setSelectedActiveLoan] = useState("");

  useEffect(() => {
    if (location !== "auctionDetails") setSelectedAuction(null);
    if (location !== "activeLoanDetails") setSelectedActiveLoan("");
  }, [location]);

  return (
    <Context.Provider
      value={{
        location,
        setLocation,
        selectedAuction,
        setSelectedAuction,
        selectedActiveLoan,
        setSelectedActiveLoan,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Provider;
