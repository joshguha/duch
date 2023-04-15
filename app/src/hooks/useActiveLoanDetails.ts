import { useState, useEffect } from "react";

export type ActiveLoanDetails = {
  img: string;
  collectionName: string;
};

export const useActiveLoanDetails = (selectedActiveLoan: string) => {
  const [activeLoanDetails, setActiveLoanDetails] =
    useState<ActiveLoanDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async function () {
      const newActiveLoanDetails = await fetchActiveLoanDetails(
        selectedActiveLoan
      );
      setActiveLoanDetails(newActiveLoanDetails);
      setLoading(false);
    })();
  }, []);

  return {
    activeLoanDetails,
    loading,
  };
};

// Fetcher

async function fetchActiveLoanDetails(selectedActiveLoan: string) {
  await new Promise((res) => setTimeout(res, 1000));
  return {
    img: "https://i.seadn.io/gae/J1Bqsh-JPEmH9xLeYu5fiGRLnIdjTIhr1gKHv1ETYaOHWf85dFISBl0hA3VdQY9UOVq4vGdIBmJdNRtvKWjtKVrh-AxDZlUHUbMInw?auto=format&w=750",
    collectionName: "Bored Ape Yacht",
  };
}
