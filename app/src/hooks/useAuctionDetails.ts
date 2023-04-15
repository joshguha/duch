import { useState, useEffect } from "react";

export type AuctionDetails = {
  img: string;
  collectionName: string;
};

export const useAuctionDetails = (selectedAuction: string) => {
  const [auctionDetails, setAuctionDetails] = useState<AuctionDetails | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async function () {
      const newAuctionDetails = await fetchAuctionDetails(selectedAuction);
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

async function fetchAuctionDetails(selectedAuction: string) {
  await new Promise((res) => setTimeout(res, 1000));
  return {
    img: "https://i.seadn.io/gae/J1Bqsh-JPEmH9xLeYu5fiGRLnIdjTIhr1gKHv1ETYaOHWf85dFISBl0hA3VdQY9UOVq4vGdIBmJdNRtvKWjtKVrh-AxDZlUHUbMInw?auto=format&w=750",
    collectionName: "Bored Ape Yacht",
  };
}
