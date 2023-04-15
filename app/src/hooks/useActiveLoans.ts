import { useState, useEffect } from "react";

export type ActiveLoan = {
  img: string;
  collectionName: string;
};

export const useActiveLoans = () => {
  const [activeLoans, setActiveLoans] = useState<ActiveLoan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async function () {
      const latestActiveLoans = await fetchActiveLoans();
      setActiveLoans(latestActiveLoans);
      setLoading(false);
    })();
  }, []);

  return {
    activeLoans,
    loading,
  };
};

// Fetcher

async function fetchActiveLoans() {
  await new Promise((res) => setTimeout(res, 1000));
  return [
    {
      img: "https://i.seadn.io/gae/J1Bqsh-JPEmH9xLeYu5fiGRLnIdjTIhr1gKHv1ETYaOHWf85dFISBl0hA3VdQY9UOVq4vGdIBmJdNRtvKWjtKVrh-AxDZlUHUbMInw?auto=format&w=750",
      collectionName: "Bored Ape Yacht",
    },
    {
      img: "https://i.seadn.io/gae/oOw7tZlWP1B1TX1yFs0OpL5rM4AsQRks4hDpN6fdk704CeewTAchAr9qiUqUDyb7ktpTVWey4atVRUNFoIL35IB2uKRYekgVEzl-rw?auto=format&w=750",
      collectionName: "Bored Ape Yacht",
    },
  ];
}
