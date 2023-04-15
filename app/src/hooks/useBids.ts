import { useState, useEffect } from "react";

export type Bids = {
  userBids: [
    {
      amount: string;
      timestamp: number;
    }
  ];
};

export const useBids = (selectedAuction: string) => {
  const [bids, setBids] = useState<Bids | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async function () {
      const newBids = await fetchBids(selectedAuction);
      setBids(newBids as Bids);
      setLoading(false);
    })();
  }, []);

  return {
    bids,
    loading,
  };
};

// Fetcher

async function fetchBids(selectedAuction: string) {
  await new Promise((res) => setTimeout(res, 1000));
  return {
    userBids: [
      {
        amount: "100",
        timestamp: 12,
      },
      {
        amount: "23.23",
        timestamp: 13,
      },
      {
        amount: "30.23",
        timestamp: 14,
      },
    ],
  };
}
