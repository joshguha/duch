import { ChainsValue, contracts } from "@/constants/contracts";
import { scanBlocks } from "@/utils/scanBlocks";
import { ethers } from "ethers";
import { useState, useEffect, useRef } from "react";
import { useProvider, useChainId, useBlockNumber } from "wagmi";
import useThrottle from "./useThrottle";

export type Auction = {
  img: string;
  collectionName: string;
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
) {
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

    console.log("FINAL", results);
  } catch (e) {
    console.error(e);
  }

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
    {
      img: "https://i.seadn.io/gae/J1Bqsh-JPEmH9xLeYu5fiGRLnIdjTIhr1gKHv1ETYaOHWf85dFISBl0hA3VdQY9UOVq4vGdIBmJdNRtvKWjtKVrh-AxDZlUHUbMInw?auto=format&w=750",
      collectionName: "Bored Ape Yacht",
    },
    {
      img: "https://i.seadn.io/gae/oOw7tZlWP1B1TX1yFs0OpL5rM4AsQRks4hDpN6fdk704CeewTAchAr9qiUqUDyb7ktpTVWey4atVRUNFoIL35IB2uKRYekgVEzl-rw?auto=format&w=750",
      collectionName: "Bored Ape Yacht",
    },
    {
      img: "https://i.seadn.io/gae/J1Bqsh-JPEmH9xLeYu5fiGRLnIdjTIhr1gKHv1ETYaOHWf85dFISBl0hA3VdQY9UOVq4vGdIBmJdNRtvKWjtKVrh-AxDZlUHUbMInw?auto=format&w=750",
      collectionName: "Bored Ape Yacht",
    },
    {
      img: "https://i.seadn.io/gae/oOw7tZlWP1B1TX1yFs0OpL5rM4AsQRks4hDpN6fdk704CeewTAchAr9qiUqUDyb7ktpTVWey4atVRUNFoIL35IB2uKRYekgVEzl-rw?auto=format&w=750",
      collectionName: "Bored Ape Yacht",
    },
    {
      img: "https://i.seadn.io/gae/J1Bqsh-JPEmH9xLeYu5fiGRLnIdjTIhr1gKHv1ETYaOHWf85dFISBl0hA3VdQY9UOVq4vGdIBmJdNRtvKWjtKVrh-AxDZlUHUbMInw?auto=format&w=750",
      collectionName: "Bored Ape Yacht",
    },
    {
      img: "https://i.seadn.io/gae/oOw7tZlWP1B1TX1yFs0OpL5rM4AsQRks4hDpN6fdk704CeewTAchAr9qiUqUDyb7ktpTVWey4atVRUNFoIL35IB2uKRYekgVEzl-rw?auto=format&w=750",
      collectionName: "Bored Ape Yacht",
    },
    {
      img: "https://i.seadn.io/gae/J1Bqsh-JPEmH9xLeYu5fiGRLnIdjTIhr1gKHv1ETYaOHWf85dFISBl0hA3VdQY9UOVq4vGdIBmJdNRtvKWjtKVrh-AxDZlUHUbMInw?auto=format&w=750",
      collectionName: "Bored Ape Yacht",
    },
    {
      img: "https://i.seadn.io/gae/oOw7tZlWP1B1TX1yFs0OpL5rM4AsQRks4hDpN6fdk704CeewTAchAr9qiUqUDyb7ktpTVWey4atVRUNFoIL35IB2uKRYekgVEzl-rw?auto=format&w=750",
      collectionName: "Bored Ape Yacht",
    },
    {
      img: "https://i.seadn.io/gae/J1Bqsh-JPEmH9xLeYu5fiGRLnIdjTIhr1gKHv1ETYaOHWf85dFISBl0hA3VdQY9UOVq4vGdIBmJdNRtvKWjtKVrh-AxDZlUHUbMInw?auto=format&w=750",
      collectionName: "Bored Ape Yacht",
    },
    {
      img: "https://i.seadn.io/gae/oOw7tZlWP1B1TX1yFs0OpL5rM4AsQRks4hDpN6fdk704CeewTAchAr9qiUqUDyb7ktpTVWey4atVRUNFoIL35IB2uKRYekgVEzl-rw?auto=format&w=750",
      collectionName: "Bored Ape Yacht",
    },
    {
      img: "https://i.seadn.io/gae/J1Bqsh-JPEmH9xLeYu5fiGRLnIdjTIhr1gKHv1ETYaOHWf85dFISBl0hA3VdQY9UOVq4vGdIBmJdNRtvKWjtKVrh-AxDZlUHUbMInw?auto=format&w=750",
      collectionName: "Bored Ape Yacht",
    },
    {
      img: "https://i.seadn.io/gae/oOw7tZlWP1B1TX1yFs0OpL5rM4AsQRks4hDpN6fdk704CeewTAchAr9qiUqUDyb7ktpTVWey4atVRUNFoIL35IB2uKRYekgVEzl-rw?auto=format&w=750",
      collectionName: "Bored Ape Yacht",
    },
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
