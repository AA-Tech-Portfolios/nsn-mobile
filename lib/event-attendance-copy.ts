import type { EventMembershipStatus } from "./softhello-mvp";
import { getRsvpLabel } from "./softhello-mvp";
import type { EventItem } from "./nsn-data";

export function getCurrentRsvpCopy(status: EventMembershipStatus) {
  return `Current RSVP: ${getRsvpLabel(status)}`;
}

export function getExpectedGroupSizeValue(event: EventItem) {
  return event.comfortSignals?.groupSize ?? event.people.replace(/\s*people$/i, "");
}

export function getExpectedGroupSizeCopy(event: EventItem) {
  return `Expected group size: ${getExpectedGroupSizeValue(event)}`;
}
