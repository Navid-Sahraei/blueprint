/**
 * The card deck for the values sort — 36 values in the tradition of ACT
 * card-sort exercises, with one-line glosses written for this product.
 * Order is fixed; the draft's history length indexes into it.
 */

export interface ValueCard {
  name: string;
  gloss: string;
}

export const DECK: ValueCard[] = [
  { name: "Honesty", gloss: "Telling the truth, especially when it costs something." },
  { name: "Growth", gloss: "Being measurably better at year’s end than at its start." },
  { name: "Health", gloss: "Treating the body as load-bearing structure." },
  { name: "Family", gloss: "Showing up for the people who share your name or your table." },
  { name: "Adventure", gloss: "Seeking out the unfamiliar on purpose." },
  { name: "Craft", gloss: "Doing the work well even where nobody checks." },
  { name: "Courage", gloss: "Acting while afraid, not after the fear passes." },
  { name: "Curiosity", gloss: "Following questions past the point of usefulness." },
  { name: "Freedom", gloss: "Keeping your own say over your time and choices." },
  { name: "Connection", gloss: "Being genuinely known by a few people." },
  { name: "Contribution", gloss: "Leaving things better than you found them." },
  { name: "Discipline", gloss: "Keeping the promises you make to yourself." },
  { name: "Creativity", gloss: "Making new things instead of only consuming them." },
  { name: "Spirituality", gloss: "Practicing a connection to something larger than yourself." },
  { name: "Justice", gloss: "Taking unfairness personally, even when it isn’t yours." },
  { name: "Learning", gloss: "Staying a student on purpose." },
  { name: "Beauty", gloss: "Noticing and making things worth looking at." },
  { name: "Loyalty", gloss: "Staying when leaving would be easier." },
  { name: "Independence", gloss: "Carrying your own weight by preference." },
  { name: "Kindness", gloss: "Defaulting to warmth, especially with strangers." },
  { name: "Order", gloss: "Building systems so the days don’t leak." },
  { name: "Play", gloss: "Doing some things for no reason but the doing." },
  { name: "Mastery", gloss: "Going deep on one thing rather than wide on many." },
  { name: "Security", gloss: "Building slack into money, time, and health." },
  { name: "Generosity", gloss: "Giving before the ledger asks you to." },
  { name: "Integrity", gloss: "Acting the same observed and unobserved." },
  { name: "Leadership", gloss: "Taking responsibility for outcomes bigger than your own." },
  { name: "Humility", gloss: "Holding your opinions lighter than your standards." },
  { name: "Gratitude", gloss: "Keeping score of what went right." },
  { name: "Ambition", gloss: "Wanting large things without apology." },
  { name: "Presence", gloss: "Being where your feet are." },
  { name: "Friendship", gloss: "Tending the people you chose." },
  { name: "Nature", gloss: "Spending real time under open sky." },
  { name: "Partnership", gloss: "Building the central relationship deliberately." },
  { name: "Wisdom", gloss: "Preferring judgment over information." },
  { name: "Humor", gloss: "Refusing to take yourself entirely seriously." },
];
