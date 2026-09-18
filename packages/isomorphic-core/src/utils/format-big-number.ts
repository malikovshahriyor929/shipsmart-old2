const formatNumber = (num: number): string => {
  if (!Number.isFinite(num)) return "0";

  if (num >= 1_000_000) {
    const millions = num / 1_000_000;
    const str = millions.toFixed(1);
    return (str.endsWith(".0") ? str.slice(0, -2) : str) + "M";
  }

  if (num >= 1_000) {
    return num.toLocaleString("en-US");
  }

  return String(num);
};
export default formatNumber;
