/**
 * Get effective time for claim logic.
 * If simTime (HH:MM) is provided in demo mode, use today's date with that time.
 * Otherwise use actual server time.
 */
export function getEffectiveTime(
  timezone: string,
  simTime: string | null
): {
  now: Date;
  localDateStr: string;
  localHour: number;
  localMinute: number;
} {
  let now = new Date();

  if (simTime) {
    const [hStr, mStr] = simTime.split(":");
    const h = parseInt(hStr, 10);
    const m = parseInt(mStr, 10);

    // Get today's date in the given timezone
    const dateInTz = new Date(
      now.toLocaleString("en-US", { timeZone: timezone })
    );
    dateInTz.setHours(h, m, 0, 0);
    now = dateInTz;
  }

  const localStr = now.toLocaleString("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  // Parse the locale string: "MM/DD/YYYY, HH:MM"
  const match = localStr.match(/(\d+)\/(\d+)\/(\d+),\s+(\d+):(\d+)/);
  if (!match) {
    throw new Error("Could not parse locale time string");
  }
  const [, month, day, year, hourStr, minuteStr] = match;
  const localDateStr = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  const localHour = parseInt(hourStr, 10);
  const localMinute = parseInt(minuteStr, 10);

  return { now, localDateStr, localHour, localMinute };
}

export function formatCountdown(
  now: Date,
  timezone: string,
  simTime: string | null
): string {
  if (simTime) {
    const [hStr, mStr] = simTime.split(":");
    const h = parseInt(hStr, 10);
    const m = parseInt(mStr, 10);
    // Calculate minutes until 12:00
    const totalMinutesNow = h * 60 + m;
    const targetMinutes = 12 * 60;
    const diffMinutes = targetMinutes - totalMinutesNow;
    if (diffMinutes <= 0) return "00:00:00";
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`;
  }

  // Real time countdown
  const localDate = new Date(
    now.toLocaleString("en-US", { timeZone: timezone })
  );
  const target = new Date(localDate);
  target.setHours(12, 0, 0, 0);
  if (localDate >= target) return "00:00:00";

  const diffMs = target.getTime() - localDate.getTime();
  const totalSeconds = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
