export type BrandIdentityConfig = {
  appDisplayName: string;
  currentLocalAppName: string;
  globalFutureName: string;
  localPilotName: string;
  localPilotShortName: string;
};

export const brandIdentity: BrandIdentityConfig = {
  appDisplayName: "SofterHello",
  currentLocalAppName: "SofterHello",
  globalFutureName: "SoftHello",
  localPilotName: "North Shore Nights",
  localPilotShortName: "NSN",
};

export function getBrandIdentitySummary(identity: BrandIdentityConfig = brandIdentity) {
  return `${identity.currentLocalAppName} is the current local app identity. ${identity.localPilotName} (${identity.localPilotShortName}) remains the Sydney/North Shore alpha pilot name. ${identity.globalFutureName} is reserved for the broader global/future direction.`;
}
