import type { AdventureType } from "./types";

/** Seed ideas per category for the idea-prompt generator. */
export const PROMPTS: Record<AdventureType, string[]> = {
  nature: [
    "Watch the sun come up from somewhere you’ve never stood",
    "Sleep outside — a yard, a roof, a tent — for one night",
    "Follow a river on foot as far as a day allows",
    "Swim somewhere cold enough to make you gasp",
    "Learn the name of every tree on your usual walk",
  ],
  skill: [
    "Take a single lesson in something you’ve always ruled out",
    "Cook a cuisine you’ve never attempted, from scratch",
    "Learn to say ten real sentences in a new language",
    "Build something with your hands that takes a full weekend",
    "Enter a beginner’s competition in anything",
  ],
  place: [
    "Take the earliest train to the last stop and explore",
    "Spend a day in the one part of your city you’ve never visited",
    "Drive to the nearest place you can’t pronounce",
    "Visit a museum for one exhibit only, then leave",
    "Get intentionally lost for two hours, no phone",
  ],
  people: [
    "Host a dinner for people who don’t already know each other",
    "Call the person you’ve meant to call for a year",
    "Ask a stranger doing something interesting how they got into it",
    "Spend a full day with someone twice your age",
    "Write and send a real letter, on paper",
  ],
  solo: [
    "Take yourself to dinner at the place you’ve been saving",
    "Spend a day completely unscheduled and unplanned",
    "Sit somewhere public for an hour with no phone, just watching",
    "Sign up for something alone that you’d normally only do with others",
    "Take a trip with no itinerary beyond the first night",
  ],
};
