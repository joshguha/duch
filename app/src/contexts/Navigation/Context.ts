import { Dispatch, SetStateAction, createContext } from "react";

type NavigationContext = {
  location: string;
  setLocation: Dispatch<SetStateAction<string>>;
  selectedAuction: string;
  setSelectedAuction: Dispatch<SetStateAction<string>>;
};

const Context = createContext<NavigationContext>({
  location: "auctions",
  setLocation: () => {},
  selectedAuction: "",
  setSelectedAuction: () => {},
});

export default Context;
