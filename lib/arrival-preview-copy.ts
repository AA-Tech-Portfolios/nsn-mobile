type ArrivalPreviewChipSource = {
  nearbyLandmark?: string;
  meetingPointHint?: string;
  confidenceNotes?: readonly string[];
};

const compactTextList = (items: readonly (string | undefined)[]) =>
  items
    .map((item) => item?.trim())
    .filter((item): item is string => Boolean(item));

export const getArrivalPreviewDetailChips = (
  arrivalPreview?: ArrivalPreviewChipSource,
  fallbackDetails: readonly (string | undefined)[] = [],
  maxItems = 4,
) => {
  const arrivalDetails = compactTextList([
    arrivalPreview?.nearbyLandmark,
    arrivalPreview?.meetingPointHint,
    ...(arrivalPreview?.confidenceNotes ?? []),
  ]);
  const details = arrivalDetails.length > 0 ? arrivalDetails : compactTextList(fallbackDetails);

  return details.slice(0, maxItems);
};
