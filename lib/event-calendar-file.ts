type BuildEventCalendarFileOptions = {
  title: string;
  venue: string;
  dateLabel: string;
  timeLabel: string;
  description: string;
  fallbackNow?: Date;
};

const monthByName: Record<string, number> = {
  jan: 0,
  january: 0,
  feb: 1,
  february: 1,
  mar: 2,
  march: 2,
  apr: 3,
  april: 3,
  may: 4,
  jun: 5,
  june: 5,
  jul: 6,
  july: 6,
  aug: 7,
  august: 7,
  sep: 8,
  sept: 8,
  september: 8,
  oct: 9,
  october: 9,
  nov: 10,
  november: 10,
  dec: 11,
  december: 11,
};

const sanitizeFilename = (title: string) =>
  `${title
    .toLowerCase()
    .replace(/—/g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "nsn-event"}.ics`;

const escapeCalendarText = (value: string) =>
  value
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;")
    .replace(/—/g, "-");

const pad = (value: number) => String(value).padStart(2, "0");

const formatCalendarDate = (date: Date) =>
  `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${pad(date.getHours())}${pad(date.getMinutes())}00`;

const parseTimeParts = (value: string) => {
  const match = value.match(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/i);

  if (!match) return null;

  const meridiem = match[3].toLowerCase();
  const rawHour = Number(match[1]);
  const minutes = Number(match[2] ?? "0");
  const hour = meridiem === "pm" && rawHour < 12
    ? rawHour + 12
    : meridiem === "am" && rawHour === 12
      ? 0
      : rawHour;

  return { hour, minutes };
};

const parseEventStart = (dateLabel: string, timeLabel: string, fallbackNow: Date) => {
  const timeParts = parseTimeParts(dateLabel) ?? parseTimeParts(timeLabel);
  const dateMatch = dateLabel.match(/\b(\d{1,2})\s+([A-Za-z]+)\b/);

  if (dateMatch && timeParts) {
    const month = monthByName[dateMatch[2].toLowerCase()];

    if (month !== undefined) {
      return new Date(
        fallbackNow.getFullYear(),
        month,
        Number(dateMatch[1]),
        timeParts.hour,
        timeParts.minutes,
      );
    }
  }

  const fallback = new Date(fallbackNow);
  fallback.setHours(timeParts?.hour ?? 9, timeParts?.minutes ?? 0, 0, 0);

  if (fallback.getTime() < fallbackNow.getTime()) {
    fallback.setDate(fallback.getDate() + 1);
  }

  return fallback;
};

export const getEventCalendarSaveCopy = (title: string) => ({
  title: "Save to local calendar?",
  body: `NSN can create a local calendar file for ${title}. This does not reserve a spot, message anyone, or connect live host tracking.`,
  saveLabel: "Save",
  cancelLabel: "Cancel",
});

export const buildEventCalendarFile = ({
  title,
  venue,
  dateLabel,
  timeLabel,
  description,
  fallbackNow = new Date(),
}: BuildEventCalendarFileOptions) => {
  const startsAt = parseEventStart(dateLabel, timeLabel, fallbackNow);
  const endsAt = new Date(startsAt.getTime() + 2 * 60 * 60 * 1000);
  const calendarDescription = `${description} Prototype only: this calendar file does not reserve a spot, message anyone, or connect live safety support.`;
  const content = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//NSN//Local Prototype Event//EN",
    "BEGIN:VEVENT",
    `UID:${sanitizeFilename(title).replace(/\.ics$/, "")}@nsn.local`,
    `DTSTAMP:${formatCalendarDate(fallbackNow)}`,
    `DTSTART:${formatCalendarDate(startsAt)}`,
    `DTEND:${formatCalendarDate(endsAt)}`,
    `SUMMARY:${escapeCalendarText(title)}`,
    `LOCATION:${escapeCalendarText(venue)}`,
    `DESCRIPTION:${escapeCalendarText(calendarDescription)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return {
    content,
    filename: sanitizeFilename(title),
    mimeType: "text/calendar;charset=utf-8",
  };
};
