import { ethers } from "ethers";

const BLOCK_INTERVAL = 1000;

export async function scanBlocks(
  contract: ethers.Contract,
  filter: ethers.EventFilter,
  firstBlock: number,
  lastBlock: number
) {
  let results: ethers.Event[] = [];
  console.log(firstBlock, lastBlock);
  let block = firstBlock;
  let counter = 1;
  while (block < lastBlock) {
    const result = await contract.queryFilter(
      filter,
      block,
      block + BLOCK_INTERVAL
    );
    console.log(counter);
    counter++;
    block += BLOCK_INTERVAL;
    results = [...results, ...result];
  }

  return results;
}
