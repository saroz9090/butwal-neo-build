/**
 * Nepal Standard Time (NPT = UTC + 5:45) Business Hours Utility
 * Office Hours: Sunday to Friday, 9:00 AM to 6:00 PM NPT
 * Saturday: Closed (On Appointment)
 */

export interface BusinessStatus {
  isOpen: boolean;
  statusText: string;
  statusDetail: string;
  currentTimeFormatted: string;
  currentDayName: string;
  isSaturday: boolean;
  nepalHours: number;
  nepalMinutes: number;
}

export function getNepalBusinessStatus(): BusinessStatus {
  const now = new Date();
  
  // Convert UTC timestamp to Nepal Time (UTC + 5 hours 45 minutes = 345 minutes)
  const utcMs = now.getTime() + (now.getTimezoneOffset() * 60000);
  const nepalOffsetMs = (5 * 60 + 45) * 60000;
  const nepalDate = new Date(utcMs + nepalOffsetMs);

  const day = nepalDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 5 = Friday, 6 = Saturday
  const hours = nepalDate.getHours();
  const minutes = nepalDate.getMinutes();
  const totalMinutes = hours * 60 + minutes;

  const openTimeMinutes = 9 * 60; // 09:00 AM = 540 minutes
  const closeTimeMinutes = 18 * 60; // 06:00 PM = 1080 minutes

  const isWorkingDay = day >= 0 && day <= 5; // Sunday to Friday
  const isWithinHours = totalMinutes >= openTimeMinutes && totalMinutes < closeTimeMinutes;
  const isOpen = isWorkingDay && isWithinHours;

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const currentDayName = days[day];

  // Format 12-hour time
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const currentTimeFormatted = `${displayHours}:${displayMinutes} ${ampm} NPT`;

  let statusText = "Closed Now";
  let statusDetail = "";

  if (day === 6) {
    statusText = "Closed (Saturday)";
    statusDetail = "Weekend: Opens Sunday at 9:00 AM NPT";
  } else if (isOpen) {
    statusText = "Open Now";
    const remainingMinutes = closeTimeMinutes - totalMinutes;
    const remainingHours = Math.floor(remainingMinutes / 60);
    const remMins = remainingMinutes % 60;
    if (remainingHours > 0) {
      statusDetail = `Closes at 6:00 PM (${remainingHours}h ${remMins}m remaining)`;
    } else {
      statusDetail = `Closes soon at 6:00 PM (${remMins}m remaining)`;
    }
  } else {
    statusText = "Closed Now";
    if (totalMinutes < openTimeMinutes) {
      const waitMins = openTimeMinutes - totalMinutes;
      const waitHours = Math.floor(waitMins / 60);
      const remWaitMins = waitMins % 60;
      statusDetail = `Opens today at 9:00 AM (in ${waitHours > 0 ? `${waitHours}h ` : ""}${remWaitMins}m)`;
    } else {
      // After 6:00 PM
      if (day === 5) {
        statusDetail = "Closed for weekend: Opens Sunday at 9:00 AM NPT";
      } else {
        statusDetail = "Opens tomorrow at 9:00 AM NPT";
      }
    }
  }

  return {
    isOpen,
    statusText,
    statusDetail,
    currentTimeFormatted,
    currentDayName,
    isSaturday: day === 6,
    nepalHours: hours,
    nepalMinutes: minutes
  };
}
