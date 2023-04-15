import { ChainsValue, contracts } from "@/constants/contracts";
import { scanBlocks } from "@/utils/scanBlocks";
import { BigNumber, ethers } from "ethers";
import { useState, useEffect, useRef } from "react";
import { useProvider, useChainId, erc721ABI, erc20ABI } from "wagmi";
import useThrottle from "./useThrottle";
import { duchLoanAuctionABI } from "@/constants/abi";

export type Auction = {
  nftCollateralAddress: string;
  nftCollateralTokenId: BigNumber;
  loanAuctionAddress: string;
  auctionStartTime: BigNumber;
  auctionDuration: BigNumber;
  principal: BigNumber;
  maxIRatePerSecond: BigNumber;
  loanTerm: BigNumber;
  denominatedToken: string;
  debtor: string;
  collectionName: string;
  currentIRate: BigNumber;
  debtRaised: BigNumber;
  denominatedTokenName: string;
};

export const useAuctions = () => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);

  const provider = useProvider();
  const chainId = useChainId();

  const fetchingData = useRef(false);

  const { throttle } = useThrottle();

  useEffect(() => {
    (async function () {
      const pass = await throttle();
      if (!pass) return;
      if (!chainId || !provider) return;

      const latestAuctions = await fetchAuctions(
        chainId as ChainsValue,
        provider,
        await provider.getBlockNumber()
      );
      fetchingData.current = false;
      setAuctions(latestAuctions);
      setLoading(false);
    })();
  }, [chainId, provider]);

  return {
    auctions,
    loading,
  };
};

// Fetcher
async function fetchAuctions(
  chainId: ChainsValue,
  provider: ethers.providers.BaseProvider,
  blockNumber: number
): Promise<Auction[]> {
  const coordinator = new ethers.Contract(
    contracts.DUCH_COORDINATOR.address[chainId],
    contracts.DUCH_COORDINATOR.abi,
    provider
  );

  const filter = coordinator.filters.LoanAuctionCreated(null, null);

  try {
    const results = await scanBlocks(
      coordinator,
      filter,
      contracts.DUCH_COORDINATOR.firstBlock[chainId],
      blockNumber
    );

    const auctions: Auction[] = (await Promise.all(
      results.map(async ({ args }) => {
        // NFT contract
        const nftContract = new ethers.Contract(
          args?.nftCollateralAddress,
          erc721ABI,
          provider
        );
        const collectionName = await nftContract.name();

        // Denominated Toke  contract
        const denominatedToken = new ethers.Contract(
          args?.denominatedToken,
          duchLoanAuctionABI,
          provider
        );

        const denominatedTokenName = await denominatedToken.symbol();

        // DuchLoanAuction contract
        const loanAuctionContract = new ethers.Contract(
          args?.loanAuctionAddress,
          duchLoanAuctionABI,
          provider
        );

        const currentIRate: BigNumber =
          await loanAuctionContract.getCurrentInterestRate();

        const debtRaised: BigNumber = await loanAuctionContract.debt();

        return {
          ...args,
          collectionName,
          currentIRate,
          debtRaised,
          denominatedTokenName,
        };
      })
    )) as Auction[];

    return auctions;
  } catch (e) {
    console.error(e);
  }

  return [];
}
