type EventDetailLookupState = {
  routeEventId?: string;
  hasDemoEvent: boolean;
  hasCreatedEvent: boolean;
  createdEventsLoaded: boolean;
};

export function shouldWaitForCreatedEventLookup({
  routeEventId,
  hasDemoEvent,
  hasCreatedEvent,
  createdEventsLoaded,
}: EventDetailLookupState) {
  return Boolean(routeEventId && !hasDemoEvent && !hasCreatedEvent && !createdEventsLoaded);
}

export function shouldShowMissingEvent({
  routeEventId,
  hasDemoEvent,
  hasCreatedEvent,
  createdEventsLoaded,
}: EventDetailLookupState) {
  return Boolean(routeEventId && !hasDemoEvent && !hasCreatedEvent && createdEventsLoaded);
}
