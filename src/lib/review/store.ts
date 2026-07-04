import { createLocalStore } from "@/lib/local-store";
import type { Review } from "./types";

const reviewsStore = createLocalStore<Review>("blueprint.reviews");

export const subscribeReviews = reviewsStore.subscribe;
export const getReviews = reviewsStore.get;
export const replaceReviews = reviewsStore.replace;

export { getServerSnapshot } from "@/lib/local-store";
