import { useState, useEffect } from "react";

export type Auction = {
  img: string;
  collectionName: string;
};

export const useAuctions = () => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async function () {
      const latestAuctions = await fetchAuctions();
      setAuctions(latestAuctions);
      setLoading(false);
    })();
  }, []);

  return {
    auctions,
    loading,
  };
};

// Fetcher

async function fetchAuctions() {
  await new Promise((res) => setTimeout(res, 1000));
  return [
    {
      img: "https://i.seadn.io/gae/J1Bqsh-JPEmH9xLeYu5fiGRLnIdjTIhr1gKHv1ETYaOHWf85dFISBl0hA3VdQY9UOVq4vGdIBmJdNRtvKWjtKVrh-AxDZlUHUbMInw?auto=format&w=750",
      collectionName: "Bored Ape Yacht Club",
    },
    {
      img: "https://i.seadn.io/gae/oOw7tZlWP1B1TX1yFs0OpL5rM4AsQRks4hDpN6fdk704CeewTAchAr9qiUqUDyb7ktpTVWey4atVRUNFoIL35IB2uKRYekgVEzl-rw?auto=format&w=750",
      collectionName: "Bored Ape Yacht Club",
    },
    {
      img: "https://i.seadn.io/gae/J1Bqsh-JPEmH9xLeYu5fiGRLnIdjTIhr1gKHv1ETYaOHWf85dFISBl0hA3VdQY9UOVq4vGdIBmJdNRtvKWjtKVrh-AxDZlUHUbMInw?auto=format&w=750",
      collectionName: "Bored Ape Yacht Club",
    },
    {
      img: "https://i.seadn.io/gae/oOw7tZlWP1B1TX1yFs0OpL5rM4AsQRks4hDpN6fdk704CeewTAchAr9qiUqUDyb7ktpTVWey4atVRUNFoIL35IB2uKRYekgVEzl-rw?auto=format&w=750",
      collectionName: "Bored Ape Yacht Club",
    },
    {
      img: "https://i.seadn.io/gae/J1Bqsh-JPEmH9xLeYu5fiGRLnIdjTIhr1gKHv1ETYaOHWf85dFISBl0hA3VdQY9UOVq4vGdIBmJdNRtvKWjtKVrh-AxDZlUHUbMInw?auto=format&w=750",
      collectionName: "Bored Ape Yacht Club",
    },
    {
      img: "https://i.seadn.io/gae/oOw7tZlWP1B1TX1yFs0OpL5rM4AsQRks4hDpN6fdk704CeewTAchAr9qiUqUDyb7ktpTVWey4atVRUNFoIL35IB2uKRYekgVEzl-rw?auto=format&w=750",
      collectionName: "Bored Ape Yacht Club",
    },
    {
      img: "https://i.seadn.io/gae/J1Bqsh-JPEmH9xLeYu5fiGRLnIdjTIhr1gKHv1ETYaOHWf85dFISBl0hA3VdQY9UOVq4vGdIBmJdNRtvKWjtKVrh-AxDZlUHUbMInw?auto=format&w=750",
      collectionName: "Bored Ape Yacht Club",
    },
    {
      img: "https://i.seadn.io/gae/oOw7tZlWP1B1TX1yFs0OpL5rM4AsQRks4hDpN6fdk704CeewTAchAr9qiUqUDyb7ktpTVWey4atVRUNFoIL35IB2uKRYekgVEzl-rw?auto=format&w=750",
      collectionName: "Bored Ape Yacht Club",
    },
    {
      img: "https://i.seadn.io/gae/J1Bqsh-JPEmH9xLeYu5fiGRLnIdjTIhr1gKHv1ETYaOHWf85dFISBl0hA3VdQY9UOVq4vGdIBmJdNRtvKWjtKVrh-AxDZlUHUbMInw?auto=format&w=750",
      collectionName: "Bored Ape Yacht Club",
    },
    {
      img: "https://i.seadn.io/gae/oOw7tZlWP1B1TX1yFs0OpL5rM4AsQRks4hDpN6fdk704CeewTAchAr9qiUqUDyb7ktpTVWey4atVRUNFoIL35IB2uKRYekgVEzl-rw?auto=format&w=750",
      collectionName: "Bored Ape Yacht Club",
    },
    {
      img: "https://i.seadn.io/gae/J1Bqsh-JPEmH9xLeYu5fiGRLnIdjTIhr1gKHv1ETYaOHWf85dFISBl0hA3VdQY9UOVq4vGdIBmJdNRtvKWjtKVrh-AxDZlUHUbMInw?auto=format&w=750",
      collectionName: "Bored Ape Yacht Club",
    },
    {
      img: "https://i.seadn.io/gae/oOw7tZlWP1B1TX1yFs0OpL5rM4AsQRks4hDpN6fdk704CeewTAchAr9qiUqUDyb7ktpTVWey4atVRUNFoIL35IB2uKRYekgVEzl-rw?auto=format&w=750",
      collectionName: "Bored Ape Yacht Club",
    },
    {
      img: "https://i.seadn.io/gae/J1Bqsh-JPEmH9xLeYu5fiGRLnIdjTIhr1gKHv1ETYaOHWf85dFISBl0hA3VdQY9UOVq4vGdIBmJdNRtvKWjtKVrh-AxDZlUHUbMInw?auto=format&w=750",
      collectionName: "Bored Ape Yacht Club",
    },
    {
      img: "https://i.seadn.io/gae/oOw7tZlWP1B1TX1yFs0OpL5rM4AsQRks4hDpN6fdk704CeewTAchAr9qiUqUDyb7ktpTVWey4atVRUNFoIL35IB2uKRYekgVEzl-rw?auto=format&w=750",
      collectionName: "Bored Ape Yacht Club",
    },
    {
      img: "https://i.seadn.io/gae/J1Bqsh-JPEmH9xLeYu5fiGRLnIdjTIhr1gKHv1ETYaOHWf85dFISBl0hA3VdQY9UOVq4vGdIBmJdNRtvKWjtKVrh-AxDZlUHUbMInw?auto=format&w=750",
      collectionName: "Bored Ape Yacht Club",
    },
    {
      img: "https://i.seadn.io/gae/oOw7tZlWP1B1TX1yFs0OpL5rM4AsQRks4hDpN6fdk704CeewTAchAr9qiUqUDyb7ktpTVWey4atVRUNFoIL35IB2uKRYekgVEzl-rw?auto=format&w=750",
      collectionName: "Bored Ape Yacht Club",
    },
  ];
}
