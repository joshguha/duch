import { polygon } from "wagmi/chains";
import { duchCoordinatorABI } from "./abi";

export type AppContractInfo = {
  address: { [key in ChainsValue]: string };
  abi: any[];
  firstBlock: { [key in ChainsValue]: number };
};

export const Chains = {
  polygon: 137,
} as const;

export type ChainsValue = typeof Chains[keyof typeof Chains];
export type ChainsKey = keyof typeof Chains;

function constantContracts<T extends { [key in string]: AppContractInfo }>(
  o: T
): T {
  return o;
}

export const contracts = constantContracts({
  DUCH_COORDINATOR: {
    address: {
      [polygon.id]: "0x1f9e4eB6f1e4ecc432CF70941401550357c579Ae",
    },
    abi: duchCoordinatorABI,
    firstBlock: {
      [polygon.id]: 41563440,
    },
  },
});

export type ContractKeyType = keyof typeof contracts;
