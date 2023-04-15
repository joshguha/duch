import { ReactNode, useState } from "react";
import Context from "./Context";

const Provider = ({ children }: { children: ReactNode }) => {
  const [location, setLocation] = useState("auctions");

  return (
    <Context.Provider
      value={{
        location,
        setLocation,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Provider;
