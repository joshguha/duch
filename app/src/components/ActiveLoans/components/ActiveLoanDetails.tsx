import { AiOutlineClockCircle } from "react-icons/ai";
import { NavigationContext } from "@/contexts/Navigation";
import { useActiveLoanDetails } from "@/hooks/useActiveLoanDetails";
import { useContext } from "react";
import { russo } from "@/styles/fonts";
import Loader from "@/components/Loader";

const ActiveLoanDetails = () => {
  const { selectedActiveLoan } = useContext(NavigationContext);

  const { activeLoanDetails, loading } =
    useActiveLoanDetails(selectedActiveLoan);

  return (
    <div className="flex flex-1 justify-center items-center animate-fadeIn">
      {loading || !activeLoanDetails ? (
        <Loader />
      ) : (
        <div className="animate-fadeIn flex flex-1">
          <div className="w-1/2 flex justify-center items-center">
            <img
              src={activeLoanDetails.img}
              alt="Collateral NFT Image"
              width="500"
              height="500"
            />
          </div>
          <div className="w-1/2 flex flex-col justify-center">
            {/* Collateral details */}
            <div className="mb-5">
              <p className={`text-4xl mb-5 ${russo.variable} font-heading`}>
                Active loan details
              </p>
              <div className="flex items-end space-x-4">
                <p className={`text-2xl ${russo.variable} font-heading`}>
                  Bored Apes Yacht Club
                </p>
                <p className="text-xl text-green">#1242</p>
              </div>
            </div>

            {/* Active Loan timing */}
            <div className="flex space-x-12 my-5 items-center">
              <div>
                <p className="mb-2 text-3xl text-green">90 days</p>
                <p>Term</p>
              </div>
              <div>
                <p className="mb-2 text-l">10th April 2022, 21:00</p>
                <p>Loan started</p>
              </div>
              <div>
                <p className="mb-2 text-l">10th May 2022, 12:00</p>
                <p>Loan matures</p>
              </div>
            </div>

            {/* Loan value */}
            <div className="my-5">
              <p className={`text-4xl mb-2 text-green`}>1,242.12 USDCx</p>
              <p className="text-xl">Maturity loan value</p>
            </div>

            {/* Composition */}
            <div className="flex space-x-12 my-5 items-center">
              <div>
                <p className="mb-2 text-xl">1,024.24 USDCx</p>
                <p>of which principal</p>
              </div>
              <div>
                <p className="mb-2 text-xl">124.24 USDCx</p>
                <p>of which interest</p>
              </div>
            </div>

            {/* Other stats */}
            <div className="flex space-x-12 my-5 items-center">
              <div>
                <p className={`text-4xl mb-2 text-green`}>12%</p>
                <p>Repaid (234.62 USDCx)</p>
              </div>
              <div>
                <p className="mb-2 text-4xl text-green">23.24%</p>
                <p>Effective APR</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveLoanDetails;
