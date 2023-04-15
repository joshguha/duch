import { NavigationContext } from "@/contexts/Navigation";
import { useBids } from "@/hooks/useBids";
import { russo } from "@/styles/fonts";
import { useContext } from "react";

const Bids = () => {
  const { selectedAuction } = useContext(NavigationContext);
  const { bids, loading } = useBids(selectedAuction);

  const sum = bids
    ? bids.userBids.reduce((acc, el) => acc + Number(el.amount), 0)
    : 0;

  return !loading && bids ? (
    <div>
      {/* User bids */}
      <p className={`text-xl ${russo.variable} font-heading`}>Your bids</p>
      <div>
        {bids.userBids.length ? (
          bids.userBids.map(({ amount, timestamp }) => (
            <div className="flex justify-between items-end my-5">
              <p>{timestamp}</p>
              <div>
                <p className="text-xl">{amount}</p>
                <p>USDCx</p>
              </div>
            </div>
          ))
        ) : (
          <p className="my-5">No bids so far</p>
        )}
        {/* Total */}
        <div className="flex justify-between items-center my-5">
          <p className={`text-xl ${russo.variable} font-heading`}>Total: </p>
          <div>
            <p className={`text-xl ${russo.variable} font-heading`}>{sum}</p>
            <p className={`text-l ${russo.variable} font-heading`}>USDCx</p>
          </div>
        </div>
      </div>
      {/* Bid functionality */}
      <div>
        <p className={`text-xl ${russo.variable} font-heading mb-5 mt-10`}>
          Add Bid (USDCx)
        </p>
        <div className="flex justify-between">
          <input
            type="number"
            className={`outline-none box-border mr-5 ${russo.variable} font-heading bg-white border-b-2`}
          />
          <button
            className={`bg-green rounded-xl p-10 py-3 ${russo.variable} font-heading text-dark hover:scale-105 transition`}
          >
            Bid
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default Bids;
