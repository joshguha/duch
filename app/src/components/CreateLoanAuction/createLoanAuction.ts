import moment from "moment";
import { erc721ABI } from "wagmi";
import { ethers } from "ethers";
import { ChainsValue, contracts } from "@/constants/contracts";
import { parseFixed } from "@ethersproject/bignumber";
import { WeiPerEther } from "@ethersproject/constants";

const SECONDS_PER_YEAR = 60 * 60 * 24 * 365;

export async function createLoanAuction(
  nftCollateralAddress: string,
  nftTokenId: string,
  startDate: string,
  startTime: string,
  auctionDuration: string,
  principal: string,
  maxAPR: string,
  loanTerm: string,
  denominatedTokenAddress: string,
  signer: ethers.Signer,
  chainId: number,
  userAddress: string
) {
  try {
    const coordinator = new ethers.Contract(
      contracts.DUCH_COORDINATOR.address[chainId as ChainsValue],
      contracts.DUCH_COORDINATOR.abi,
      signer
    );

    const nft = new ethers.Contract(nftCollateralAddress, erc721ABI, signer);

    const auctionStartTime = moment(
      startTime + " " + startDate,
      "HH:mm:ss MM/DD/YYYY"
    ).unix();

    principal = parseFixed(principal, 18).toString();

    auctionDuration = String(Number(auctionDuration) * 86400);

    loanTerm = String(Number(loanTerm) * 86400);

    const maxAnnualMultiplier = 1 + Number(maxAPR) / 100;
    const maxPerSecondMultiplier = Math.pow(
      maxAnnualMultiplier,
      1 / SECONDS_PER_YEAR
    );

    const maxPerSecondInterestRate = parseFixed(
      String(maxPerSecondMultiplier),
      18
    )
      .sub(WeiPerEther)
      .toString();

    const tx = await nft.approve(
      contracts.DUCH_COORDINATOR.address[chainId as ChainsValue],
      nftTokenId
    );

    await tx.wait();

    await coordinator.createLoanAuction(
      nftCollateralAddress,
      nftTokenId,
      auctionStartTime,
      auctionDuration,
      principal,
      maxPerSecondInterestRate,
      loanTerm,
      denominatedTokenAddress,
      userAddress
    );
  } catch (e) {
    console.error(e);
  }
}
