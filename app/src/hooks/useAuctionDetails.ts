import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { useProvider, useChainId } from "wagmi";
import { Auction } from "./useAuctions";
import { duchLoanAuctionABI } from "@/constants/abi";

export type AuctionDetails = {
  img: string;
  collectionName: string;
};

export const useAuctionDetails = (selectedAuction: Auction | null) => {
  const [auctionDetails, setAuctionDetails] = useState<AuctionDetails | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const provider = useProvider();

  useEffect(() => {
    (async function () {
      if (!selectedAuction || !provider) return;
      const newAuctionDetails = await fetchAuctionDetails(
        selectedAuction,
        provider
      );
      setAuctionDetails(newAuctionDetails);
      setLoading(false);
    })();
  }, []);

  return {
    auctionDetails,
    loading,
  };
};

// Fetcher

async function fetchAuctionDetails(
  selectedAuction: Auction,
  provider: ethers.providers.BaseProvider
) {
  // DuchLoanAuction contract
  const loanAuctionContract = new ethers.Contract(
    selectedAuction.loanAuctionAddress,
    duchLoanAuctionABI,
    provider
  );

  const debtRaised = await loanAuctionContract.debt();

  await new Promise((res) => setTimeout(res, 1000));
  return {
    img: "https://i.seadn.io/gae/J1Bqsh-JPEmH9xLeYu5fiGRLnIdjTIhr1gKHv1ETYaOHWf85dFISBl0hA3VdQY9UOVq4vGdIBmJdNRtvKWjtKVrh-AxDZlUHUbMInw?auto=format&w=750",
    collectionName: "Bored Ape Yacht",
  };
}
