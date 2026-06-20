import { describe, expect, it } from "vitest";
import { assessNetworkRisk, createDisabledNetworkRiskProvider } from "./network-risk";

describe("assessNetworkRisk", () => {
  it("keeps a normal connection at normal risk", async () => {
    const assessment = await assessNetworkRisk({
      ipAddress: "203.0.113.10",
      detector: async () => ({ likelyVpnOrProxy: false }),
    });

    expect(assessment).toMatchObject({
      networkRiskFlag: "none",
      riskLevel: "normal",
      riskScoreDelta: 0,
      requiresExtraVerification: false,
      verificationCopy: null,
    });
  });

  it("requires soft verification when a VPN or proxy is detected", async () => {
    const assessment = await assessNetworkRisk({
      ipAddress: "203.0.113.20",
      detector: async () => ({ likelyVpnOrProxy: true }),
    });

    expect(assessment).toMatchObject({
      networkRiskFlag: "vpn_or_proxy",
      riskLevel: "soft_verification",
      riskScoreDelta: 20,
      requiresExtraVerification: true,
      verificationCopy: "For community safety, we need one extra check before you continue.",
    });
    expect(assessment.reasons).toEqual(["network_privacy_service"]);
  });

  it("raises stronger risk when VPN or proxy combines with a suspicious signup pattern", async () => {
    const assessment = await assessNetworkRisk({
      ipAddress: "203.0.113.30",
      signals: { suspiciousSignupPattern: true },
      detector: async () => ({ likelyVpnOrProxy: true }),
    });

    expect(assessment).toMatchObject({
      networkRiskFlag: "vpn_or_proxy",
      riskLevel: "stronger_review",
      riskScoreDelta: 45,
      requiresExtraVerification: true,
    });
    expect(assessment.reasons).toEqual(["network_privacy_service", "suspicious_signup_pattern"]);
  });

  it("uses a disabled local-dev fallback by default", async () => {
    const provider = createDisabledNetworkRiskProvider();

    const assessment = await assessNetworkRisk({
      ipAddress: "127.0.0.1",
      detector: provider,
    });

    expect(assessment).toMatchObject({
      providerStatus: "disabled",
      networkRiskFlag: "none",
      riskLevel: "normal",
      riskScoreDelta: 0,
      requiresExtraVerification: false,
    });
  });
});
