import { useContext } from "react";
import { NavigationContext } from "@/contexts/Navigation";
import { russo } from "@/styles/fonts";

const ActiveLoanProfile = ({
  img,
  collectionName,
}: {
  img: string;
  collectionName: string;
}) => {
  const { setLocation, setSelectedActiveLoan } = useContext(NavigationContext);

  const onClick = () => {
    setSelectedActiveLoan("1");
    setLocation("activeLoanDetails");
  };

  return (
    <div
      className="p-5 m-5 flex flex-col space-y-3 w-64 bg-offBlack-10 rounded-lg drop-shadow-xl hover:-translate-y-2 transition animate-fadeIn cursor-pointer"
      onClick={onClick}
    >
      <img src={img} alt="nft" width="250" height="250" />
      <div className="flex flex-col space-y-1">
        <p className={`text-2xl ${russo.variable} font-heading`}>
          {collectionName}
        </p>
        <p className="text-l text-green">{"#1243"}</p>
      </div>
      {/* Loan value and interest */}

      <div className="flex justify-between items-center mb-10">
        <div>
          <p className={`text-2xl  ${russo.variable} font-heading`}>24,239</p>
          <p>USDCx</p>
        </div>
        <div>
          <p className={`text-2xl  ${russo.variable} font-heading text-right`}>
            12.4%
          </p>
          <p className="text-right">APR</p>
        </div>
      </div>

      {/* Term */}
      <div className="mb-10">
        <p className={`text-2xl  ${russo.variable} font-heading`}>90 days</p>
        <p>Term</p>
      </div>

      {/* Maturity */}
      <div className="flex justify-between">
        <p>Matures: </p>
        <p className="text-green">12th May, 12:00</p>
      </div>
    </div>
  );
};

export default ActiveLoanProfile;
