import Loader from "../Loader";
import ActiveLoanProfile from "./components/ActiveLoanProfile";
import { useActiveLoans } from "@/hooks/useActiveLoans";

const ActiveLoans = () => {
  const { activeLoans, loading } = useActiveLoans();
  return (
    <div className="flex justify-center items-center flex-1 flex-wrap	animate-fadeIn">
      {loading ? (
        <Loader />
      ) : (
        activeLoans.map(({ img, collectionName }, index) => (
          <ActiveLoanProfile
            key={index}
            img={img}
            collectionName={collectionName}
          />
        ))
      )}
    </div>
  );
};

export default ActiveLoans;
