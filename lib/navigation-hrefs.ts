type HrefParamPrimitive = string | number | boolean;
export type HrefParams = Record<
  string,
  HrefParamPrimitive | readonly HrefParamPrimitive[] | null | undefined
>;

const encodeQueryPair = (key: string, value: HrefParamPrimitive) =>
  `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`;

export const buildHref = (pathname: string, params?: HrefParams) => {
  const query = Object.entries(params ?? {}).flatMap(([key, value]) => {
    if (value === null || value === undefined) return [];

    const values = Array.isArray(value) ? value : [value];
    return values.map((item) => encodeQueryPair(key, item));
  });

  return query.length > 0 ? `${pathname}?${query.join("&")}` : pathname;
};
