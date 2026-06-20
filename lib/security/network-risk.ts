export type NetworkRiskFlag = "none" | "vpn_or_proxy";
export type NetworkRiskLevel = "normal" | "soft_verification" | "stronger_review";
export type NetworkRiskReason =
  | "network_privacy_service"
  | "suspicious_signup_pattern"
  | "banned_device_or_session_pattern"
  | "suspicious_location_change"
  | "abuse_report_signal";
export type NetworkRiskProviderStatus = "disabled" | "enabled";

export type NetworkRiskDetectorResult = {
  likelyVpnOrProxy: boolean;
  providerStatus?: NetworkRiskProviderStatus;
};

export type NetworkRiskDetector = (
  ipAddress: string | null,
) => Promise<NetworkRiskDetectorResult> | NetworkRiskDetectorResult;

export type NetworkRiskSignals = {
  suspiciousSignupPattern?: boolean;
  bannedDeviceOrSessionPattern?: boolean;
  suspiciousLocationChange?: boolean;
  abuseReportSignal?: boolean;
};

export type NetworkRiskAssessment = {
  networkRiskFlag: NetworkRiskFlag;
  riskLevel: NetworkRiskLevel;
  riskScoreDelta: number;
  requiresExtraVerification: boolean;
  automaticBlock: false;
  providerStatus: NetworkRiskProviderStatus;
  verificationCopy: string | null;
  reasons: NetworkRiskReason[];
};

export const SOFT_NETWORK_VERIFICATION_COPY =
  "For community safety, we need one extra check before you continue.";

export function createDisabledNetworkRiskProvider(): NetworkRiskDetector {
  return () => ({ likelyVpnOrProxy: false, providerStatus: "disabled" });
}

export function createMockNetworkRiskProvider(
  result: NetworkRiskDetectorResult,
): NetworkRiskDetector {
  return () => ({ ...result, providerStatus: result.providerStatus ?? "enabled" });
}

export function createServerNetworkRiskProvider(): NetworkRiskDetector {
  if (process.env.NETWORK_RISK_DETECTION_ENABLED !== "true") {
    return createDisabledNetworkRiskProvider();
  }

  const mockResult = process.env.NETWORK_RISK_MOCK_RESULT;
  return createMockNetworkRiskProvider({
    likelyVpnOrProxy: mockResult === "vpn_or_proxy",
    providerStatus: "enabled",
  });
}

export async function assessNetworkRisk({
  ipAddress,
  signals = {},
  detector = createDisabledNetworkRiskProvider(),
}: {
  ipAddress: string | null;
  signals?: NetworkRiskSignals;
  detector?: NetworkRiskDetector;
}): Promise<NetworkRiskAssessment> {
  const detectorResult = await detector(ipAddress);
  const likelyVpnOrProxy = detectorResult.likelyVpnOrProxy;
  const providerStatus = detectorResult.providerStatus ?? "enabled";
  const reasons: NetworkRiskReason[] = [];

  if (likelyVpnOrProxy) {
    reasons.push("network_privacy_service");
  }

  if (signals.suspiciousSignupPattern) {
    reasons.push("suspicious_signup_pattern");
  }
  if (signals.bannedDeviceOrSessionPattern) {
    reasons.push("banned_device_or_session_pattern");
  }
  if (signals.suspiciousLocationChange) {
    reasons.push("suspicious_location_change");
  }
  if (signals.abuseReportSignal) {
    reasons.push("abuse_report_signal");
  }

  if (!likelyVpnOrProxy) {
    return {
      networkRiskFlag: "none",
      riskLevel: "normal",
      riskScoreDelta: 0,
      requiresExtraVerification: false,
      automaticBlock: false,
      providerStatus,
      verificationCopy: null,
      reasons,
    };
  }

  const hasAdditionalSignal = reasons.length > 1;

  return {
    networkRiskFlag: "vpn_or_proxy",
    riskLevel: hasAdditionalSignal ? "stronger_review" : "soft_verification",
    riskScoreDelta: hasAdditionalSignal ? 45 : 20,
    requiresExtraVerification: true,
    automaticBlock: false,
    providerStatus,
    verificationCopy: SOFT_NETWORK_VERIFICATION_COPY,
    reasons,
  };
}
