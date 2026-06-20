import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import type { NetworkRiskAssessment } from "../../lib/security/network-risk";
import { buildAuthNetworkRiskResponse } from "./authNetworkRisk";
import { sdk } from "./sdk";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
  networkRisk: NetworkRiskAssessment | null;
};

export async function createContext(opts: CreateExpressContextOptions): Promise<TrpcContext> {
  let user: User | null = null;
  let networkRisk: NetworkRiskAssessment | null = null;

  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    // Authentication is optional for public procedures.
    user = null;
  }

  try {
    networkRisk = await buildAuthNetworkRiskResponse(opts.req);
  } catch (error) {
    // Network risk is a soft signal and must not break auth/session checks.
    networkRisk = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
    networkRisk,
  };
}
