import type { IconSymbolName } from "@/components/ui/icon-symbol-map";

export type CommunityRoleKey = "participant" | "host" | "coHost" | "volunteerHelper";

export type CommunityRoleOption = {
  key: CommunityRoleKey;
  title: string;
  copy: string;
  icon: IconSymbolName;
  prototypeOnly: true;
};

export const communityRoleOptions: CommunityRoleOption[] = [
  {
    key: "participant",
    title: "Participant",
    copy: "Optional local prototype role for joining meetups at your own pace.",
    icon: "person.fill",
    prototypeOnly: true,
  },
  {
    key: "host",
    title: "Host",
    copy: "Optional local prototype role for planning meetups. No backend permissions yet.",
    icon: "calendar",
    prototypeOnly: true,
  },
  {
    key: "coHost",
    title: "Co-host",
    copy: "Optional local prototype role for helping with welcome notes, logistics, or details.",
    icon: "group",
    prototypeOnly: true,
  },
  {
    key: "volunteerHelper",
    title: "Volunteer/helper",
    copy: "Optional local prototype role for community support, not authority or moderation.",
    icon: "volunteer",
    prototypeOnly: true,
  },
];

export const meetupAccessShortcutRows = [
  {
    key: "createMeetup",
    title: "Create a Meetup",
    route: "/events",
    params: { action: "create" },
    icon: "add",
  },
  {
    key: "manageMeetups",
    title: "Manage My Meetups",
    route: "/events",
    icon: "calendar",
  },
] as const satisfies readonly {
  key: string;
  title: string;
  route: string;
  params?: Record<string, string>;
  icon: IconSymbolName;
}[];
