import { useState } from "react";
import { russo } from "@/styles/fonts";
import { useAccount, useChainId, useProvider, useSigner } from "wagmi";
import { createLoanAuction } from "./createLoanAuction";

const CreateLoanAuction = () => {
  const { isConnected, address } = useAccount();
  const { data: signer } = useSigner();
  const chainId = useChainId();

  const [nftCollateralAddress, setNFTCollateralAddress] = useState("");
  const [nftTokenId, setNFTTokenId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [auctionDuration, setAuctionDuration] = useState("");
  const [principal, setPrincipal] = useState("");
  const [maxAPR, setMaxAPR] = useState("");
  const [loanTerm, setLoanTerm] = useState("");
  const [denominatedTokenAddress, setDenominatedTokenAddress] = useState("");

  const onClick = () => {
    console.log("click");
    if (!address || !signer) return;
    createLoanAuction(
      nftCollateralAddress,
      nftTokenId,
      startDate,
      startTime,
      auctionDuration,
      principal,
      maxAPR,
      loanTerm,
      denominatedTokenAddress,
      signer,
      chainId,
      address
    );
  };

  return isConnected ? (
    <div className="flex flex-col justify-center items-center flex-1 flex-wrap	animate-fadeIn">
      <div className="flex space-x-10 m-5">
        <div className="flex flex-col justify-center items-center">
          <input
            className="bg-white outline-none text-dark p-2 w-96"
            value={nftCollateralAddress}
            onChange={(e) => setNFTCollateralAddress(e.target.value)}
          />
          <p className="m-5">NFT Collateral Address</p>
        </div>
        <div className="flex flex-col justify-center items-center">
          <input
            className="bg-white outline-none text-dark p-2 w-96"
            value={nftTokenId}
            onChange={(e) => setNFTTokenId(e.target.value)}
          />
          <p className="m-5">NFT Token ID</p>
        </div>
      </div>

      <div className="flex space-x-10 mb-5">
        <div className="flex flex-col justify-center items-center">
          <input
            className="bg-white outline-none text-dark p-2 w-96"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <p className="m-5">Start Date (MM/DD/YYYY)</p>
        </div>

        <div className="flex flex-col justify-center items-center">
          <input
            className="bg-white outline-none text-dark p-2 w-96"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
          <p className="m-5">Start Time 24hr (HH:MM:SS)</p>
        </div>
      </div>

      <div className="flex space-x-10 mb-5">
        <div className="flex flex-col justify-center items-center">
          <input
            className="bg-white outline-none text-dark p-2 w-96"
            value={auctionDuration}
            onChange={(e) => setAuctionDuration(e.target.value)}
          />
          <p className="m-5">Auction duration (days)</p>
        </div>
      </div>

      <div className="flex space-x-10 mb-5">
        <div className="flex flex-col justify-center items-center">
          <input
            className="bg-white outline-none text-dark p-2 w-96"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
          />
          <p className="m-5">Max Principal</p>
        </div>

        <div className="flex flex-col justify-center items-center">
          <input
            className="bg-white outline-none text-dark p-2 w-96"
            value={maxAPR}
            onChange={(e) => setMaxAPR(e.target.value)}
          />
          <p className="m-5">Max APR (%)</p>
        </div>
      </div>

      <div className="flex space-x-10 ">
        <div className="flex flex-col justify-center items-center">
          <input
            className="bg-white outline-none text-dark p-2 w-96"
            value={loanTerm}
            onChange={(e) => setLoanTerm(e.target.value)}
          />
          <p className="m-5">Loan term (days)</p>
        </div>

        <div className="flex flex-col justify-center items-center">
          <input
            className="bg-white outline-none text-dark p-2 w-96"
            value={denominatedTokenAddress}
            onChange={(e) => setDenominatedTokenAddress(e.target.value)}
          />
          <p className="m-5">Denominated Token Address</p>
        </div>
      </div>

      <button
        className={`bg-green rounded-xl p-10 py-3 ${russo.variable} font-heading text-dark hover:scale-105 transition`}
        onClick={onClick}
      >
        Create a Loan Auction
      </button>
    </div>
  ) : (
    <div className="flex flex-1 flex-col items-center justify-center">
      <p className="text-36">Connect your wallet</p>
    </div>
  );
};

export default CreateLoanAuction;
