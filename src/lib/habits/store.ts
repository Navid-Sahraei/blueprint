import { createLocalStore } from "@/lib/local-store";
import type { Habit, HabitWeeklyReview } from "./types";

const habitsStore = createLocalStore<Habit>("blueprint.habits");
const reviewsStore = createLocalStore<HabitWeeklyReview>(
  "blueprint.habit_reviews",
);

export const subscribeHabits = habitsStore.subscribe;
export const getHabits = habitsStore.get;
export const replaceHabits = habitsStore.replace;

export const subscribeReviews = reviewsStore.subscribe;
export const getReviews = reviewsStore.get;
export const replaceReviews = reviewsStore.replace;

export { getServerSnapshot } from "@/lib/local-store";
