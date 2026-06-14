import { allEvents, type EventItem, type MeetupTrustProfile, type PrototypeVerificationState } from "./nsn-data";

export type SoftHelloComfortPreference = "Small groups" | "Text-first" | "Quiet" | "Flexible pace" | "Indoor backup";

export type SoftHelloVerificationLevel = "Readiness not reviewed" | "Prototype contact preview" | "Prototype readiness reviewed";

export type TrustEvidence = {
  contactEmail?: string | null;
  contactPhone?: string | null;
  identitySelfieUri?: string | null;
  hasIdentityDocument?: boolean;
};

export type EventMembershipStatus =
  | "none"
  | "interested"
  | "going"
  | "deciding_later"
  | "running_late"
  | "unable"
  | "not_this_time"
  | "left"
  | "joined";

export type AttendTogetherStatus = "solo" | "bringing_someone" | "maybe_bringing_someone";

export type EventMembership = {
  eventId: string;
  status: EventMembershipStatus;
  attendTogetherStatus?: AttendTogetherStatus;
  joinedAt?: string;
  leftAt?: string;
  updatedAt?: string;
};

export type SafetyReportReason =
  | "Safety concern"
  | "Safety threat"
  | "Unsafe behaviour"
  | "Harassment"
  | "Underage risk"
  | "Underage concern"
  | "Impersonation"
  | "Fraud"
  | "Fake identity"
  | "Fake profile"
  | "Possible account compromise"
  | "Spam"
  | "Spam/bot behaviour"
  | "Boundary violation"
  | "No-show pattern"
  | "Hate or discrimination"
  | "Privacy concern"
  | "Other";

export type SafetyReportRoute = "host_review" | "app_review";

export type SafetyReport = {
  id: string;
  eventId: string;
  reportedUserId: string;
  reportedUserName?: string;
  reason: SafetyReportReason;
  route?: SafetyReportRoute;
  createdAt: string;
  cancelUntil?: string;
  cancelledAt?: string;
};

export type PostEventFeedback = {
  eventId: string;
  comfort: "Good" | "Mixed" | "Unsafe";
  wouldMeetAgain: boolean;
  createdAt: string;
};

export type SavedPlace = {
  id: string;
  venue: string;
  category: string;
  sourceEventId: string;
  sourceEventTitle: string;
  weather: string;
  savedAt: string;
};

export const defaultComfortPreferences: SoftHelloComfortPreference[] = ["Small groups", "Text-first", "Quiet"];

export const verificationLevels: SoftHelloVerificationLevel[] = ["Readiness not reviewed", "Prototype contact preview", "Prototype readiness reviewed"];

export const prototypeVerificationStates: PrototypeVerificationState[] = ["unverified", "pending", "verified", "host-verified"];

export const verificationRank: Record<SoftHelloVerificationLevel, number> = {
  "Readiness not reviewed": 0,
  "Prototype contact preview": 1,
  "Prototype readiness reviewed": 2,
};

export function canMeetInPerson(level: SoftHelloVerificationLevel) {
  return verificationRank[level] >= verificationRank["Prototype readiness reviewed"];
}

export function canChatPrivately(level: SoftHelloVerificationLevel) {
  return verificationRank[level] >= verificationRank["Prototype contact preview"];
}

export function deriveVerificationLevel(evidence: TrustEvidence): SoftHelloVerificationLevel {
  const hasContactDetails = Boolean(evidence.contactEmail?.trim() || evidence.contactPhone?.trim());
  const hasIdentityProof = Boolean(evidence.identitySelfieUri && evidence.hasIdentityDocument);

  if (hasContactDetails && hasIdentityProof) {
    return "Prototype readiness reviewed";
  }

  if (hasContactDetails) {
    return "Prototype contact preview";
  }

  return "Readiness not reviewed";
}

export function getEffectivePrototypeVerificationLevel(
  evidence: TrustEvidence,
  selectedPrototypeLevel: SoftHelloVerificationLevel = "Readiness not reviewed"
): SoftHelloVerificationLevel {
  const evidenceLevel = deriveVerificationLevel(evidence);

  return verificationRank[selectedPrototypeLevel] > verificationRank[evidenceLevel] ? selectedPrototypeLevel : evidenceLevel;
}

const meetingSafetyCopyTranslations: Record<string, Record<SoftHelloVerificationLevel, string>> = {
  English: {
    "Readiness not reviewed": "You can browse and prepare in this local prototype. Meetup access is only a local readiness preview.",
    "Prototype contact preview": "This local contact preview can open prototype chat surfaces. No real verification or live messaging system is connected.",
    "Prototype readiness reviewed": "Prototype readiness reviewed on this device. This is a local meetup preview state, not real identity verification.",
  },
};

const verificationLevelLabelTranslations: Record<string, Record<SoftHelloVerificationLevel, string>> = {
  English: {
    "Readiness not reviewed": "Readiness not reviewed",
    "Prototype contact preview": "Prototype contact preview",
    "Prototype readiness reviewed": "Prototype readiness reviewed",
  },
};

export function getMeetingSafetyCopy(level: SoftHelloVerificationLevel, languageBase = "English") {
  const localizedCopy = meetingSafetyCopyTranslations[languageBase] ?? meetingSafetyCopyTranslations.English;

  return localizedCopy[level];
}

export function getVerificationLevelLabel(level: SoftHelloVerificationLevel, languageBase = "English") {
  const localizedLabels = verificationLevelLabelTranslations[languageBase] ?? verificationLevelLabelTranslations.English;

  return localizedLabels[level];
}

export function getPrototypeVerificationStateLabel(state: PrototypeVerificationState) {
  if (state === "host-verified") return "Host details preview";
  if (state === "verified") return "Readiness preview";
  if (state === "pending") return "Readiness preview pending";

  return "Readiness not reviewed";
}

export function isAccountablePrototypeVerificationState(state: PrototypeVerificationState) {
  return state === "verified" || state === "host-verified";
}

export function getEventTrustSummary(trustProfile: MeetupTrustProfile | undefined) {
  if (!trustProfile) {
    return "Prototype readiness details are not set for this meetup yet.";
  }

  const hostLabel = getPrototypeVerificationStateLabel(trustProfile.host.verificationState);
  const coHostCount = trustProfile.coHosts?.length ?? 0;
  const coHostCopy = coHostCount > 0 ? ` · ${coHostCount} co-host${coHostCount === 1 ? "" : "s"}` : "";

  return `${hostLabel} · ${trustProfile.participantLimit.min}-${trustProfile.participantLimit.max} people${coHostCopy}`;
}

export function getWeatherFallbackSuggestions(event: EventItem, condition: "clear" | "rainy" | "windy" = "rainy") {
  const fallbackSuggestions = event.trustProfile?.weatherAlternatives ?? [];
  const isWeatherSensitive = event.weather.toLowerCase().includes("weather") || event.tags.includes("Outdoor");

  if (!isWeatherSensitive && fallbackSuggestions.length === 0) return [];

  if (condition === "clear" && !isWeatherSensitive) return [];

  return fallbackSuggestions.length > 0
    ? fallbackSuggestions
    : ["indoor cafe", "library meetup", "movie", "casual dining", "board games"];
}

export function getEventMembership(eventId: string, memberships: EventMembership[]) {
  return memberships.find((membership) => membership.eventId === eventId) ?? { eventId, status: "none" as const };
}

export function getRsvpLabel(status: EventMembershipStatus) {
  if (status === "interested") return "Interested";
  if (status === "going" || status === "joined") return "Going";
  if (status === "deciding_later") return "Deciding later";
  if (status === "running_late") return "Running late";
  if (status === "unable") return "Unable to make it";
  if (status === "not_this_time") return "Not this time";
  if (status === "left") return "Left plan";

  return "No RSVP yet";
}

export function getRsvpDescription(status: EventMembershipStatus) {
  if (status === "interested") return "This RSVP is saved on this device only. You can decide later without joining the meetup chat.";
  if (status === "going" || status === "joined") return "Marked as going on this device. Meetup chat opens as a prototype preview.";
  if (status === "deciding_later") return "Saved locally as deciding later, without pressure to join or explain yet.";
  if (status === "running_late") return "Saved locally as running late. This does not message anyone or change the meetup plan.";
  if (status === "unable") return "Saved locally as unable to make it. This does not send a cancellation or message anyone.";
  if (status === "not_this_time") return "This plan is marked as not for you this time. You can change it later.";
  if (status === "left") return "You left this local plan preview. You can still choose another RSVP state.";

  return "No RSVP has been saved for this local prototype preview.";
}

export const attendTogetherStatusOptions: AttendTogetherStatus[] = [
  "solo",
  "bringing_someone",
  "maybe_bringing_someone",
];

export function getAttendTogetherLabel(status: AttendTogetherStatus) {
  if (status === "bringing_someone") return "Bringing someone";
  if (status === "maybe_bringing_someone") return "Maybe bringing someone";

  return "Going solo";
}

export function getAttendTogetherDescription(status: AttendTogetherStatus) {
  if (status === "bringing_someone") {
    return "Bring a friend, sibling, partner, parent, or support person. They do not need to be on NSN for this local prototype note.";
  }

  if (status === "maybe_bringing_someone") {
    return "You might bring someone familiar. This stays as a local planning note and does not message anyone.";
  }

  return "Going solo is okay too. You can still arrive slowly, browse first, or change this local note later.";
}

export function shouldOpenMeetupChat(status: EventMembershipStatus) {
  return status === "going" || status === "joined";
}

export function setEventRsvpStatus(
  eventId: string,
  memberships: EventMembership[],
  status: EventMembershipStatus,
  now = new Date().toISOString()
): EventMembership[] {
  const existing = getEventMembership(eventId, memberships);
  const next: EventMembership = {
    ...existing,
    eventId,
    status,
    updatedAt: now,
    joinedAt: status === "going" || status === "joined" ? existing.joinedAt ?? now : existing.joinedAt,
    leftAt: status === "left" ? now : undefined,
  };

  return memberships.some((membership) => membership.eventId === eventId)
    ? memberships.map((membership) => (membership.eventId === eventId ? next : membership))
    : [...memberships, next];
}

export function setEventAttendTogetherStatus(
  eventId: string,
  memberships: EventMembership[],
  attendTogetherStatus: AttendTogetherStatus,
  now = new Date().toISOString()
): EventMembership[] {
  const existing = getEventMembership(eventId, memberships);
  const next: EventMembership = {
    ...existing,
    eventId,
    attendTogetherStatus,
    updatedAt: now,
  };

  return memberships.some((membership) => membership.eventId === eventId)
    ? memberships.map((membership) => (membership.eventId === eventId ? next : membership))
    : [...memberships, next];
}

export function joinEvent(eventId: string, memberships: EventMembership[], now = new Date().toISOString()): EventMembership[] {
  return setEventRsvpStatus(eventId, memberships, "going", now);
}

export function leaveEvent(eventId: string, memberships: EventMembership[], now = new Date().toISOString()): EventMembership[] {
  return setEventRsvpStatus(eventId, memberships, "left", now);
}

export function blockUser(userId: string, blockedUserIds: string[]) {
  return blockedUserIds.includes(userId) ? blockedUserIds : [...blockedUserIds, userId];
}

export function unblockUser(userId: string, blockedUserIds: string[]) {
  return blockedUserIds.filter((blockedUserId) => blockedUserId !== userId);
}

export function createSafetyReport(
  eventId: string,
  reportedUserId: string,
  reason: SafetyReportReason,
  now = new Date().toISOString(),
  options: { reportedUserName?: string; route?: SafetyReportRoute; cancelWindowMinutes?: number } = {}
): SafetyReport {
  const createdAtMs = Date.parse(now);
  const cancelWindowMinutes = options.cancelWindowMinutes ?? 10;

  return {
    id: `${eventId}-${reportedUserId}-${Date.parse(now) || now}`,
    eventId,
    reportedUserId,
    reportedUserName: options.reportedUserName,
    reason,
    route: options.route,
    createdAt: now,
    cancelUntil: Number.isNaN(createdAtMs) ? undefined : new Date(createdAtMs + cancelWindowMinutes * 60 * 1000).toISOString(),
  };
}

export function cancelSafetyReport(reportId: string, reports: SafetyReport[], now = new Date().toISOString()) {
  const nowMs = Date.parse(now);

  return reports.map((report) => {
    if (report.id !== reportId || report.cancelledAt || !report.cancelUntil) {
      return report;
    }

    const cancelUntilMs = Date.parse(report.cancelUntil);

    if (Number.isNaN(nowMs) || Number.isNaN(cancelUntilMs) || nowMs > cancelUntilMs) {
      return report;
    }

    return { ...report, cancelledAt: now };
  });
}

export function savePostEventFeedback(feedback: PostEventFeedback, existing: PostEventFeedback[]) {
  return existing.some((item) => item.eventId === feedback.eventId)
    ? existing.map((item) => (item.eventId === feedback.eventId ? feedback : item))
    : [...existing, feedback];
}

export function savePlace(place: SavedPlace, existing: SavedPlace[]) {
  return existing.some((item) => item.id === place.id)
    ? existing.map((item) => (item.id === place.id ? { ...item, ...place, savedAt: item.savedAt } : item))
    : [place, ...existing];
}

export function removeSavedPlace(placeId: string, existing: SavedPlace[]) {
  return existing.filter((place) => place.id !== placeId);
}

export function pinEvent(eventId: string, pinnedEventIds: string[]) {
  return pinnedEventIds.includes(eventId) ? pinnedEventIds : [eventId, ...pinnedEventIds];
}

export function unpinEvent(eventId: string, pinnedEventIds: string[]) {
  return pinnedEventIds.filter((id) => id !== eventId);
}

export function hideEvent(eventId: string, hiddenEventIds: string[]) {
  return hiddenEventIds.includes(eventId) ? hiddenEventIds : [eventId, ...hiddenEventIds];
}

export function unhideEvent(eventId: string, hiddenEventIds: string[]) {
  return hiddenEventIds.filter((id) => id !== eventId);
}

export function filterEventsForComfort(events: EventItem[], preferences: SoftHelloComfortPreference[]) {
  if (preferences.length === 0) return events;

  return events.filter((event) => {
    if (preferences.includes("Small groups") && !/2|3|4|5|6/.test(event.people)) return false;
    if (preferences.includes("Quiet") && event.tone !== "Quiet" && event.tone !== "Balanced") return false;
    if (preferences.includes("Indoor backup") && !event.tags.includes("Indoor") && !event.weather.toLowerCase().includes("backup")) return false;

    return true;
  });
}

function getComfortMatchScore(event: EventItem, preferences: SoftHelloComfortPreference[]) {
  return preferences.reduce((score, preference) => {
    if (preference === "Small groups" && /2|3|4|5|6/.test(event.people)) return score + 1;
    if (preference === "Quiet" && (event.tone === "Quiet" || event.tone === "Balanced")) return score + 1;
    if (preference === "Indoor backup" && (event.tags.includes("Indoor") || event.weather.toLowerCase().includes("backup"))) return score + 1;
    if (preference === "Flexible pace" && (event.tone === "Quiet" || event.tone === "Balanced")) return score + 1;
    if (preference === "Text-first") return score + 1;

    return score;
  }, 0);
}

export function prioritizeEventsForComfort(events: EventItem[], preferences: SoftHelloComfortPreference[]) {
  if (preferences.length === 0) return events;

  return events
    .map((event, index) => ({ event, index, score: getComfortMatchScore(event, preferences) }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map(({ event }) => event);
}

export const softHelloSampleEvents = allEvents;
