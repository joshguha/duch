import { Rubik_Spray_Paint } from "next/font/google";
import { russo } from "@/styles/fonts";

const rubik = Rubik_Spray_Paint({ weight: "400", subsets: ["latin"] });

const Sidebar = () => {
  return (
    <div className="flex flex-col w-96 bg-white text-dark h-screen border-r-2 border-offWhite">
      <p className={`${rubik.className} text-6xl text-center my-10`}>DUCH</p>
      <div className="px-8">
        <h1 className={`font-sans text-l`}>
          A novel NFT-backed lending protocol that auctions distribution shares
          of debt to uncover optimal prices, improve capital efficiency and
          unlock NFT liquidity.
        </h1>
      </div>
      <div
        className={`${russo.variable} font-heading my-5 py-6 px-4 flex justify-center`}
      >
        <p className="w-1/2 text-xl text-center underline hover:underline cursor-pointer border-r-2">
          Auctions
        </p>
        <p className="w-1/2 text-xl text-center  hover:underline cursor-pointer">
          Active Loans
        </p>
      </div>
      <div className="my-10 px-8">
        <h1 className={`${russo.variable} font-heading text-3xl text-center`}>
          Select an auction
        </h1>
      </div>
      <div className="flex-1"></div>
      <div className="p-8 flex justify-center">
        <button
          className={`bg-green rounded-xl p-10 py-3 ${russo.variable} font-heading text-dark hover:scale-105 transition`}
        >
          Create a Loan Auction
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
