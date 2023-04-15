import { ReactNode, useState, useEffect } from "react";
import Context from "./Context";

const Provider = ({ children }: { children: ReactNode }) => {
  const [location, setLocation] = useState("auctions");
  const [selectedAuction, setSelectedAuction] = useState("");

  useEffect(() => {
    if (location !== "auctionDetails") setSelectedAuction("");
  }, [location]);

  return (
    <Context.Provider
      value={{
        location,
        setLocation,
        selectedAuction,
        setSelectedAuction,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Provider;
