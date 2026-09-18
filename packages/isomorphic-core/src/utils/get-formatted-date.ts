export function getDateRangeStateValues(state: string | null) {
  if (!state) {
    return null;
  }
  return new Date(state);
}
export const formatDateToStringMonth = (dateString?: string) => {
  if (!dateString) return null;
  const [datePart] = dateString.split(" ");
  const [day, month, year] = datePart.split(".").map(Number);
  const date = new Date(year, month - 1, day); 
  const dayNum = date.getDate();
  const ordinalSuffix =
    dayNum > 3 && dayNum < 21
      ? "th"
      : ["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"][
          dayNum % 10
        ];
  return `${dayNum}${ordinalSuffix} ${date.toLocaleString("en-US", { month: "long" })}, ${year}`;
};

export function getTimeDistance(date: string | null |undefined): { 
    value: string; 
    isPast: boolean;
  } {
    if (!date) return { value: "N/A", isPast: false };
    
    const targetDate = new Date(date).getTime();
    const currentDate = new Date().getTime();
    const isPast = targetDate < currentDate;
    
    // Calculate difference in milliseconds
    const diffMs = Math.abs(targetDate - currentDate);
    
    // Convert to days
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    // If more than 30 days, convert to months
    if (days > 30) {
      const months = Math.floor(days / 30);
      return { 
        value: `${months} ${months === 1 ? 'month' : 'months'}`,
        isPast 
      };
    }
    
    return { 
      value: `${days} ${days === 1 ? 'day' : 'days'}`,
      isPast 
    };
  }