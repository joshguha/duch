import { BigNumber } from "ethers";
import moment from "moment";

export function formatTimestamp(timestamp: BigNumber) {
  return moment(timestamp.toNumber() * 1000).format("Do MMMM YYYY, HH:mm ");
}
