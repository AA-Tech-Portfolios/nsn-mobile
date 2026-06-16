import type { EventMembershipStatus } from "./softhello-mvp";
import { getRsvpLabel } from "./softhello-mvp";
import type { EventItem } from "./nsn-data";

export function getCurrentRsvpCopy(status: EventMembershipStatus) {
  return `Current RSVP: ${getRsvpLabel(status)}`;
}

type GroupSizeRange = {
  min: number;
  max: number;
};

const parseGroupSizeRange = (value?: string): GroupSizeRange | null => {
  const matches = value?.match(/\d+/g);

  if (!matches?.length) {
    return null;
  }

  const min = Number(matches[0]);
  const max = Number(matches[1] ?? matches[0]);

  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    return null;
  }

  return { min: Math.min(min, max), max: Math.max(min, max) };
};

const formatGroupSizeRange = ({ min, max }: GroupSizeRange) => {
  return min === max ? String(min) : `${min}–${max}`;
};

export function getExpectedGroupSizeValue(event: EventItem) {
  const eventCapacity = parseGroupSizeRange(event.people);
  const comfortGroupSize = parseGroupSizeRange(event.comfortSignals?.groupSize);

  if (eventCapacity && comfortGroupSize) {
    const min = Math.min(Math.max(comfortGroupSize.min, eventCapacity.min), eventCapacity.max);
    const max = Math.min(comfortGroupSize.max, eventCapacity.max);

    if (min > max) {
      return formatGroupSizeRange(eventCapacity);
    }

    return formatGroupSizeRange({
      min,
      max,
    });
  }

  return event.comfortSignals?.groupSize ?? event.people.replace(/\s*people$/i, "");
}

export function getExpectedGroupSizeCopy(event: EventItem) {
  return `Expected group size: ${getExpectedGroupSizeValue(event)}`;
}
