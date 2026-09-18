import dayjs from "dayjs";

export function fmtDateRange(
  start: string | Date,
  end: string | Date,
  type: "date" | "time"
) {
  const s = dayjs(start);
  const e = dayjs(end);

  if (type === "date") {
    const sameDay = s.isSame(e, "day");
    const dayStr = s.format("ddd D MMM");
    const endDay = e.format("ddd D MMM");
    return sameDay ? dayStr : `${dayStr} → ${endDay}`;
  }

  if (type === "time") {
    const times = `${s.format("HH:mm")} – ${e.format("HH:mm")}`;
    return times;
  }

  return "";
}
