import { describe, expect, it } from "vitest";
import { buildAuthNetworkRiskResponse, getRequestIpAddress } from "./authNetworkRisk";

describe("auth network risk helpers", () => {
  it("reads a coarse client IP from forwarding headers", () => {
    const req = {
      headers: {
        "x-forwarded-for": "203.0.113.40, 10.0.0.2",
      },
      ip: "10.0.0.1",
    };

    expect(getRequestIpAddress(req)).toBe("203.0.113.40");
  });

  it("returns soft safety copy for auth responses without naming the VPN signal", async () => {
    const response = await buildAuthNetworkRiskResponse(
      { headers: {}, ip: "203.0.113.50" },
      { detector: async () => ({ likelyVpnOrProxy: true }) },
    );

    expect(response).toMatchObject({
      networkRiskFlag: "vpn_or_proxy",
      riskLevel: "soft_verification",
      requiresExtraVerification: true,
      verificationCopy: "For community safety, we need one extra check before you continue.",
      automaticBlock: false,
    });
    expect(response.verificationCopy).not.toMatch(/vpn|proxy/i);
  });
});
