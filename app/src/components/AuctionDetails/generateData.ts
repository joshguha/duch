const GRANULARITY = 100;

export function generateData(
  auctionStart: number,
  auctionEnd: number,
  maxInterestRateAPR: number
) {
  const tMAX = auctionEnd - auctionStart;
  const k = maxInterestRateAPR / Math.sqrt(tMAX);

  function calculateValue(date: number) {
    const t = date - auctionStart;
    return k * Math.sqrt(t);
  }

  const dates = [];
  const interval = (auctionEnd - auctionStart) / GRANULARITY;
  for (let i = 0; i < GRANULARITY; i++) {
    dates.push(auctionStart + i * interval);
  }

  const data = dates.map((date) => ({ date, value: calculateValue(date) }));

  return data;
}
