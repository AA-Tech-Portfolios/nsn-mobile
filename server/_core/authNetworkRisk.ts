import {
  assessNetworkRisk,
  createDisabledNetworkRiskProvider,
  createServerNetworkRiskProvider,
  type NetworkRiskAssessment,
  type NetworkRiskDetector,
  type NetworkRiskSignals,
} from "../../lib/security/network-risk";

type RequestLike = {
  headers?: Record<string, string | string[] | undefined>;
  ip?: string;
  socket?: { remoteAddress?: string };
};

export function getRequestIpAddress(req: RequestLike): string | null {
  const forwardedFor = req.headers?.["x-forwarded-for"];
  const forwardedValue = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor;

  if (forwardedValue) {
    const firstForwardedIp = forwardedValue.split(",")[0]?.trim();
    if (firstForwardedIp) return firstForwardedIp;
  }

  const cfConnectingIp = req.headers?.["cf-connecting-ip"];
  if (typeof cfConnectingIp === "string" && cfConnectingIp.trim()) {
    return cfConnectingIp.trim();
  }

  const realIp = req.headers?.["x-real-ip"];
  if (typeof realIp === "string" && realIp.trim()) {
    return realIp.trim();
  }

  return req.ip ?? req.socket?.remoteAddress ?? null;
}

export async function buildAuthNetworkRiskResponse(
  req: RequestLike,
  options: {
    signals?: NetworkRiskSignals;
    detector?: NetworkRiskDetector;
  } = {},
): Promise<NetworkRiskAssessment> {
  const ipAddress = getRequestIpAddress(req);

  try {
    return await assessNetworkRisk({
      ipAddress,
      signals: options.signals,
      detector: options.detector ?? createServerNetworkRiskProvider(),
    });
  } catch (error) {
    return assessNetworkRisk({
      ipAddress,
      detector: createDisabledNetworkRiskProvider(),
    });
  }
}
