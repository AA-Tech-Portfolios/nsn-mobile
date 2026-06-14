export type MyCircleRelationship =
  | "Friend"
  | "Family member"
  | "Partner"
  | "Support person"
  | "Other trusted person";

export type MyCircleMember = {
  id: string;
  displayName: string;
  relationship: MyCircleRelationship;
  note: string;
};

export const myCircleRelationshipOptions: MyCircleRelationship[] = [
  "Friend",
  "Family member",
  "Partner",
  "Support person",
  "Other trusted person",
];

export const prototypeMyCircleMembers: MyCircleMember[] = [
  {
    id: "circle-friend",
    displayName: "Friend",
    relationship: "Friend",
    note: "Someone you may want to plan attendance with.",
  },
  {
    id: "circle-family",
    displayName: "Family",
    relationship: "Family member",
    note: "A familiar person who can help the arrival feel easier.",
  },
  {
    id: "circle-partner",
    displayName: "Partner",
    relationship: "Partner",
    note: "Someone close who may attend alongside you.",
  },
  {
    id: "circle-support",
    displayName: "Support",
    relationship: "Support person",
    note: "A person who helps you feel more settled before or during a meetup.",
  },
  {
    id: "circle-other",
    displayName: "Familiar person",
    relationship: "Other trusted person",
    note: "Someone familiar you choose for planning support.",
  },
];

export function getMyCirclePrototypeSummary() {
  return "My Circle is a local prototype area for familiar people who can help you share or plan attendance. It stays on this device and does not message anyone.";
}
