import { brandIdentity } from "./brand-identity";

export const productLanguageCopy = {
  alphaPilotName: brandIdentity.localPilotName,
  alphaPilotShortName: brandIdentity.localPilotShortName,
  alphaPilotScope: "Sydney/North Shore alpha pilot",
  alphaPilotDescription:
    `${brandIdentity.localPilotShortName} / ${brandIdentity.localPilotName} is the Sydney/North Shore alpha pilot for trying calm, low-pressure meetup ideas.`,
  currentLocalAppName: brandIdentity.currentLocalAppName,
  currentLocalAppDescription:
    `${brandIdentity.currentLocalAppName} is the current local app identity prepared from the alpha pilot learning.`,
  globalFutureDirectionName: brandIdentity.globalFutureName,
  globalFutureDirectionDescription:
    `${brandIdentity.globalFutureName} is the future broader product direction after local pilot learning is clearer; it is not live or production-ready.`,
  retiredNamingNote:
    "SoftShore remains historical naming exploration, not the name of the current local pilot.",
} as const;
