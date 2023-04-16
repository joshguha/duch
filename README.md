# DUCH Auctions

A novel NFT-based lending protocol that auctions distribution shares of debt to uncover optimal prices, improve capital efficiency and unlock NFT liquidity.

## Background

Current NFT-based lending markets are based on three main models: protocol to peer, pool to peer and peer to peer.

### Protocol to Peer

Protocol-to-peer lending markets, such as [JPEG’d][1], allow borrowers to interact directly with the lending protocol. Borrowers lock their NFTs as collateral in a CDP and receive the protocol's native stablecoin in return. If the Loan-to-Value (LTV) ratio exceeds a certain threshold, the protocol liquidates the NFT collateral through an auction. Pros include instant liquidity and zero marginal cost for loans, but limitations include borrowing only the native stablecoin and the need for external adoption of the stablecoin. Scaling across NFT classes/categories is challenging, and an external oracle is required for certain functions.

### Peer to Peer

P2P lending markets, like [NFTfi][2], offer flexible structures for loans based on mutual agreement. Borrowers submit loan requests with NFT collateral, and lenders extend offers. No oracle is required, and loans are issued in widely accepted tokens. Defaults are resolved between the borrower and lender. Pros include no need for an auction and scalability across NFT classes. Cons include less immediate liquidity and complexity in user experience.

### Peer to pool

In pool-to-peer (pool2p) lending, users trade with a pool of assets sourced from multiple lenders. Borrowers deposit NFT collateral and draw loans at variable interest rates. Liquidation occurs when the Loan-to-Value (LTV) reaches the liquidation ratio. Pros include strong liquidity, scalability, and risk isolation. Cons include capital inefficiency and reliance on an external oracle.

---

Is there a way to marry the benefits of pooled capital without the reliance on an external price oracle which always values assets at the floor price of their respective collection. Can an auction be used to appropriately price the loan itself relative to its unique NFT collateral?

## Enter DUCH

Duch is a set of smart contracts which allow lenders to auction of shares of a loan backed by the lender's NFT using a descending clearing-price auction where the 'price' of a share of the loan is determined by the inverse of the interest rate. The lender sets a maximum interest rate and a desired principal. The auction starts of at an interest rate of 0 and increases non-linearly over the auction period.

The market-clearing descending price auction has the desirable property of economic ['incentive-compatibility'][3] since lenders' bidding at their true valuation is their dominant strategy. Thus, the auction is designed to uncover true market valuations surrounding the particular NFT-backed loan, thus enhance capital efficiency and increase the amount of available capital for an NFT owner through competition between lenders over fractionalized units of the loan.

The front-end Next.js app is still a work in progress.

Please feel free to shoot me an email if you have any questions on the project at joshguha@gmail.com!

[1]: https://jpegd.io/
[2]: https://nftfi.com/
[3]: https://a16zcrypto.com/posts/article/nft-sales-market-clearing-gas-wars-auction-mechanism-design-for-builders/
