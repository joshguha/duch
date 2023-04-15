import { Auction } from "@/hooks/useAuctions";
import { Dispatch, SetStateAction, createContext } from "react";

type NavigationContext = {
  location: string;
  setLocation: Dispatch<SetStateAction<string>>;
  selectedAuction: Auction | null;
  setSelectedAuction: Dispatch<SetStateAction<Auction | null>>;
  selectedActiveLoan: string;
  setSelectedActiveLoan: Dispatch<SetStateAction<string>>;
};

const Context = createContext<NavigationContext>({
  location: "auctions",
  setLocation: () => {},
  selectedAuction: null,
  setSelectedAuction: () => {},
  selectedActiveLoan: "",
  setSelectedActiveLoan: () => {},
});

export default Context;
