import { ReactNode } from "react";
import { NavigationProvider } from "./Navigation";

const AllContextsProvider = ({ children }: { children: ReactNode }) => {
  return <NavigationProvider>{children}</NavigationProvider>;
};

export default AllContextsProvider;
