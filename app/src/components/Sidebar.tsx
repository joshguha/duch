import { Rubik_Spray_Paint } from "next/font/google";
import { Russo_One } from "next/font/google";

// If loading a variable font, you don't need to specify the font weight
const rubik = Rubik_Spray_Paint({ weight: "400", subsets: ["latin"] });
const russo = Russo_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-russo",
});

const Sidebar = () => {
  return (
    <div className="w-96 bg-light text-dark h-screen  border-r-2 border-offWhite">
      <p className={`${rubik.className} text-6xl text-center my-10`}>DUCH</p>
      <div
        className={`${russo.variable} font-sans my-5 py-6 flex justify-center`}
      >
        <p className="w-1/2 text-xl text-center underline hover:underline cursor-pointer border-r-2">
          Auctions
        </p>
        <p className="w-1/2 text-xl text-center  hover:underline cursor-pointer">
          Loans
        </p>
      </div>
      <div className="my-10 px-8">
        <h1 className={`${russo.variable} font-sans text-3xl text-center`}>
          Select an auction
        </h1>
      </div>
    </div>
  );
};

export default Sidebar;
