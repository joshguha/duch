import { Dispatch, SetStateAction, createContext } from "react";

type NavigationContext = {
  location: string;
  setLocation: Dispatch<SetStateAction<string>>;
};

const Context = createContext<NavigationContext>({
  location: "auctions",
  setLocation: () => {},
});

export default Context;
