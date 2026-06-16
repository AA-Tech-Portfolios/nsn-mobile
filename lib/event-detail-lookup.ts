type EventDetailLookupState = {
  routeEventId?: string;
  hasDemoEvent: boolean;
  hasCreatedEvent: boolean;
  createdEventsLoaded: boolean;
};

const hasRouteEventId = (routeEventId?: string) => Boolean(routeEventId?.trim());

export function shouldWaitForCreatedEventLookup({
  routeEventId,
  hasDemoEvent,
  hasCreatedEvent,
  createdEventsLoaded,
}: EventDetailLookupState) {
  return Boolean(hasRouteEventId(routeEventId) && !hasDemoEvent && !hasCreatedEvent && !createdEventsLoaded);
}

export function shouldShowMissingEvent({
  routeEventId,
  hasDemoEvent,
  hasCreatedEvent,
  createdEventsLoaded,
}: EventDetailLookupState) {
  return Boolean((!hasRouteEventId(routeEventId) || (!hasDemoEvent && !hasCreatedEvent)) && createdEventsLoaded);
}
