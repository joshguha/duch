import { ReactNode, useState, useEffect } from "react";
import Context from "./Context";

const Provider = ({ children }: { children: ReactNode }) => {
  const [location, setLocation] = useState("auctions");
  const [selectedAuction, setSelectedAuction] = useState("");
  const [selectedActiveLoan, setSelectedActiveLoan] = useState("");

  useEffect(() => {
    if (location !== "auctionDetails") setSelectedAuction("");
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
