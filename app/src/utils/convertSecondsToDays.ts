import { BigNumber } from "ethers";

export function convertSecondsToDays(secondsBN: BigNumber) {
  const seconds = secondsBN.toNumber();
  return Math.round(seconds / 60 / 60 / 24);
}
