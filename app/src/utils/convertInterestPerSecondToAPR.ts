import { BigNumber } from "ethers";
import { WeiPerEther } from "@ethersproject/constants";
import { formatFixed } from "@ethersproject/bignumber";

const SECONDS_IN_A_YEAR = 31536000;

export function convertInterestPerSecondToAPR(currentIRate: BigNumber) {
  const currentMultiplierPerSecond = WeiPerEther.add(currentIRate);
  const currentAnnualMultiplier = Math.pow(
    Number(formatFixed(currentMultiplierPerSecond, 18)),
    SECONDS_IN_A_YEAR
  );
  const currentAPR = currentAnnualMultiplier - 1;

  return currentAPR;
}
