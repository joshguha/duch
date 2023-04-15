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

    await nft.approve(
      contracts.DUCH_COORDINATOR.address[chainId as ChainsValue],
      nftTokenId,
      {
        gasLimit: 3000000,
      }
    );

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
    ).sub(WeiPerEther);

    await coordinator.createLoanAuction(
      nftCollateralAddress,
      nftTokenId,
      auctionStartTime,
      auctionDuration,
      principal,
      maxPerSecondInterestRate,
      loanTerm,
      "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
      "0x4f62ac9936d383289c13524157d95f3ab3eef629",
      {
        gasLimit: 3000000,
      }
    );
  } catch (e) {
    console.error(e);
  }
}
