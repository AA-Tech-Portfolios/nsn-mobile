import type { DateFormatPreference, TemperatureUnitPreference, TimeFormatPreference } from "./app-settings";

type DateContext = {
  locale: string;
  timeZone?: string;
  dateFormatPreference: DateFormatPreference;
  showWeekday: boolean;
};

type TimeContext = {
  locale: string;
  timeZone?: string;
  timeFormatPreference: TimeFormatPreference;
};

const pad2 = (value: number) => String(value).padStart(2, "0");

export function formatPreferredDate(date: Date, context: DateContext) {
  const timeZone = context.timeZone ? { timeZone: context.timeZone } : {};

  if (context.dateFormatPreference === "Device / locale") {
    return date.toLocaleDateString(context.locale, {
      ...(context.showWeekday ? { weekday: "short" as const } : {}),
      day: "numeric",
      month: "long",
      year: "numeric",
      ...timeZone,
    });
  }

  const parts = new Intl.DateTimeFormat("en-AU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    ...timeZone,
  }).formatToParts(date);
  const day = parts.find((part) => part.type === "day")?.value ?? pad2(date.getDate());
  const month = parts.find((part) => part.type === "month")?.value ?? pad2(date.getMonth() + 1);
  const year = parts.find((part) => part.type === "year")?.value ?? String(date.getFullYear());
  const shortYear = year.slice(-2);
  const weekday = context.showWeekday
    ? `${new Intl.DateTimeFormat(context.locale, {
        weekday: "short",
        ...timeZone,
      }).format(date)} `
    : "";

  if (context.dateFormatPreference === "MM/DD/YYYY") return `${weekday}${month}/${day}/${year}`;
  if (context.dateFormatPreference === "YYYY/MM/DD") return `${weekday}${year}/${month}/${day}`;
  if (context.dateFormatPreference === "YY/MM/DD") return `${weekday}${shortYear}/${month}/${day}`;
  if (context.dateFormatPreference === "DD.MM.YYYY") return `${weekday}${day}.${month}.${year}`;
  if (context.dateFormatPreference === "DD-MM-YYYY") return `${weekday}${day}-${month}-${year}`;
  if (context.dateFormatPreference === "YYYY-MM-DD") return `${weekday}${year}-${month}-${day}`;
  return `${weekday}${day}/${month}/${year}`;
}

export function formatPreferredTime(date: Date, context: TimeContext) {
  const hour12 = context.timeFormatPreference === "Device / locale" ? undefined : context.timeFormatPreference === "12-hour clock";

  return date.toLocaleTimeString(context.locale, {
    hour: "2-digit",
    minute: "2-digit",
    ...(hour12 === undefined ? {} : { hour12 }),
    ...(context.timeZone ? { timeZone: context.timeZone } : {}),
  });
}

export function formatEventTimeLabel(time: string, context: TimeContext) {
  const match = time.trim().match(/^(\d{1,2}):(\d{2})\s*([ap]m)$/i);

  if (!match) return time;

  const period = match[3].toLowerCase();
  const hour12 = Number(match[1]);
  const minutes = match[2];
  const hour24 = period === "pm" && hour12 !== 12 ? hour12 + 12 : period === "am" && hour12 === 12 ? 0 : hour12;

  if (context.timeFormatPreference === "24-hour clock") return `${pad2(hour24)}:${minutes}`;
  if (context.timeFormatPreference === "12-hour clock") return `${hour12}:${minutes} ${period}`;
  return time;
}

export function formatTemperatureLabel(temperatureCelsius: number | null, preference: TemperatureUnitPreference) {
  if (temperatureCelsius === null) return null;

  if (preference === "Fahrenheit") {
    return `${Math.round((temperatureCelsius * 9) / 5 + 32)}°F`;
  }

  return `${temperatureCelsius}°C`;
}
