import { russo } from "@/styles/fonts";

const Shares = () => {
  return (
    <div className="flex flex-col space-y-10">
      <div className="flex justify-between items-center">
        <p>Total number of shares: </p>
        <p className={`${russo.variable} font-heading text-2xl text-right`}>
          1,124.32
        </p>
      </div>
      <div className="flex justify-between items-center">
        <p>of which owned by you: </p>
        <p className={`${russo.variable} font-heading text-2xl text-right`}>
          14.32 (10.00%)
        </p>
      </div>

      {/* Maturity actions */}
      <div className="bg-offWhite px-10 py-6 rounded-xl">
        <div className="flex flex-col justify-between items-center mb-5">
          <p>Loan matures in: </p>
          <p className={`${russo.variable} font-heading text-2xl text-right`}>
            20 days
          </p>
        </div>

        <div className="flex flex-col justify-between items-center space-y-4">
          <button
            disabled
            className={`bg-green disabled:bg-green-100 rounded-xl p-10 py-3 ${russo.variable} font-heading text-dark hover:scale-105 disabled:hover:scale-100 transition w-64 disabled:cursor-not-allowed`}
          >
            Collect repayment
          </button>
          <button
            disabled
            className={`bg-red disabled:bg-red-100 rounded-xl p-10 py-3 ${russo.variable} font-heading text-dark hover:scale-105 disabled:hover:scale-100 transition w-64 disabled:cursor-not-allowed`}
          >
            Liquidate collateral
          </button>
        </div>
      </div>
    </div>
  );
};

export default Shares;
