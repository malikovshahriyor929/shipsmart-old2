const getProgressColor = (p: number): string =>
  p === 100 ? "#0DA000" : p > 20 ? "#EE5D26" : "#FF0000";

export default getProgressColor;
