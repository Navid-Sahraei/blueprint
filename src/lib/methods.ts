/**
 * The five-layer framework — Blueprint's core content model.
 *
 * Content standards (binding, from the product spec):
 * - Every scientific claim carries a real, checkable citation.
 * - Practitioner books are labeled as such, never passed off as studies.
 * - Known controversies (10,000-hour rule, 21-day myth, gratitude effect
 *   sizes) are stated plainly, not smoothed over.
 */

export type SourceKind = "peer-reviewed" | "book" | "practitioner";

export interface Source {
  kind: SourceKind;
  citation: string;
}

export interface Method {
  slug: string;
  name: string;
  route: string;
  layerId: 1 | 2 | 3 | 4 | 5;
  tagline: string;
  description: string;
  whyItWorks: string;
  sources: Source[];
  /** Honest caveat shown in the UI where the science is nuanced or contested. */
  honestyNote?: string;
  features: string[];
  freeTier: boolean;
}

export interface Layer {
  id: 1 | 2 | 3 | 4 | 5;
  name: string;
  question: string;
}

export const LAYERS: Layer[] = [
  { id: 1, name: "Direction", question: "Where am I going this year?" },
  { id: 2, name: "Big Moves", question: "What makes this year unforgettable and hard?" },
  { id: 3, name: "Execution", question: "How do I protect the work that matters?" },
  { id: 4, name: "Growth & Mastery", question: "How do I actually get better?" },
  { id: 5, name: "Learning Loop", question: "How does the system get better?" },
];

export const METHODS: Method[] = [
  {
    slug: "values-compass",
    name: "Values Compass",
    route: "/app/values",
    layerId: 1,
    tagline: "Identify 3–5 core values before you set a single goal.",
    description:
      "A digital card-sort exercise that surfaces what you actually care about, so every goal you set later can be checked against it. You rank a deck of value cards, keep the top three to five, and write one sentence per value on how it should show up this year.",
    whyItWorks:
      "Values clarification is a core component of Acceptance and Commitment Therapy, and goals people hold for their own reasons sustain motivation better than goals imposed from outside — the central finding of Self-Determination Theory.",
    sources: [
      {
        kind: "peer-reviewed",
        citation:
          "A-Tjak, J. G. L., et al. (2015). A meta-analysis of the efficacy of acceptance and commitment therapy. Psychotherapy and Psychosomatics, 84(1), 30–36.",
      },
      {
        kind: "peer-reviewed",
        citation:
          "Ryan, R. M., & Deci, E. L. (2000). Self-determination theory and the facilitation of intrinsic motivation, social development, and well-being. American Psychologist, 55(1), 68–78.",
      },
      {
        kind: "book",
        citation:
          "Pink, D. H. (2009). Drive: The Surprising Truth About What Motivates Us. Riverhead Books. (A popularization of Self-Determination Theory — Ryan & Deci is the primary source.)",
      },
    ],
    features: [
      "Digital values card-sort with ranking",
      "One-sentence personal definition per value",
      "Values shown alongside goals across every other module",
    ],
    freeTier: false,
  },
  {
    slug: "odyssey-plan",
    name: "Life Design / Odyssey Plan",
    route: "/app/life-design",
    layerId: 1,
    tagline: "Draft three parallel five-year versions of your life.",
    description:
      "Three co-possible paths — not ranked alternatives: the life you're already living, the life if that path became impossible, and the life if money and image didn't matter. Sketching all three breaks the assumption that there is one correct plan.",
    whyItWorks:
      "Developed at Stanford's Life Design Lab, the Odyssey Plan applies design-thinking methods — prototyping, reframing — to life planning.",
    sources: [
      {
        kind: "book",
        citation:
          "Burnett, B., & Evans, D. (2016). Designing Your Life: How to Build a Well-Lived, Joyful Life. Knopf.",
      },
    ],
    honestyNote:
      "This method's support comes from design-thinking pedagogy and practitioner outcomes, not randomized controlled trials. Treat it as a structured brainstorming tool, not a clinically validated intervention.",
    features: [
      "Three parallel five-year canvases",
      "Simple visual timeline per path",
      "Prompts adapted from the Stanford Life Design curriculum",
    ],
    freeTier: false,
  },
  {
    slug: "annual-okrs",
    name: "Annual Goals / OKRs",
    route: "/app/goals",
    layerId: 1,
    tagline: "One objective, two to four measurable key results, per quarter.",
    description:
      "A quarterly OKR builder with weekly check-ins. Specific, challenging goals — with measurable key results attached — instead of vague resolutions.",
    whyItWorks:
      "The OKR format comes from Andy Grove at Intel and was popularized by John Doerr. Its underlying mechanism, Goal-Setting Theory, is one of the best-replicated findings in organizational psychology: specific, challenging goals reliably beat vague 'do your best' goals, provided you have the ability and commit to them.",
    sources: [
      {
        kind: "peer-reviewed",
        citation:
          "Locke, E. A., & Latham, G. P. (2002). Building a practically useful theory of goal setting and task motivation: A 35-year odyssey. American Psychologist, 57(9), 705–717.",
      },
      {
        kind: "book",
        citation: "Grove, A. S. (1983). High Output Management. Random House.",
      },
      {
        kind: "book",
        citation:
          "Doerr, J. (2018). Measure What Matters. Portfolio/Penguin.",
      },
    ],
    features: [
      "Quarterly objective + key result builder",
      "Weekly percent-complete check-ins",
      "Key results linkable to WOOP plans and reviews",
    ],
    freeTier: false,
  },
  {
    slug: "misogi",
    name: "Misogi OS",
    route: "/app/misogi",
    layerId: 2,
    tagline: "One extremely hard annual challenge with a real chance of failure.",
    description:
      "Select, train for, and debrief a single defining challenge for the year. A candidate vault scored on fear and pull, a 50% rule check (you should have roughly even odds), a countdown, a linked training log, and a structured debrief — with a distinct, gentler flow for challenges that ended in failure, because a well-chosen failure carries equal value.",
    whyItWorks:
      "Mastery experiences are the strongest source of self-efficacy in Bandura's framework — succeeding (or genuinely attempting) something you doubted you could do changes what you believe you can do next. Research on lifetime adversity also finds that people with moderate adversity histories show better resilience outcomes than people with none.",
    sources: [
      {
        kind: "peer-reviewed",
        citation:
          "Bandura, A. (1977). Self-efficacy: Toward a unifying theory of behavioral change. Psychological Review, 84(2), 191–215.",
      },
      {
        kind: "peer-reviewed",
        citation:
          "Seery, M. D., Holman, E. A., & Silver, R. C. (2010). Whatever does not kill us: Cumulative lifetime adversity, vulnerability, and resilience. Journal of Personality and Social Psychology, 99(6), 1025–1041.",
      },
      {
        kind: "book",
        citation:
          "Easter, M. (2021). The Comfort Crisis. Rodale Books. (Popularized the modern misogi, based on performance scientist Dr. Marcus Elliott's reinterpretation of the ritual.)",
      },
    ],
    honestyNote:
      "A misogi should be difficult, not reckless. Blueprint shows a safety disclaimer throughout this module and recommends medical clearance for physically demanding challenges.",
    features: [
      "Candidate vault with Fear × Pull scoring",
      "The 50% rule check and event countdown",
      "Linked training log",
      "Structured debrief — including a dedicated 'failed, worth it' flow",
    ],
    freeTier: false,
  },
  {
    slug: "adventure-ledger",
    name: "Adventure Ledger",
    route: "/app/adventures",
    layerId: 2,
    tagline: "Six small, novel experiences, spaced across the year.",
    description:
      "Sometimes called Kevin's Rule: roughly one new experience every two months. An idea board, a year calendar, category prompts (Nature, Skill, Place, People, Solo), and a short savoring debrief after each one.",
    whyItWorks:
      "Experiences produce more lasting well-being than material purchases; anticipating an experience is itself a source of happiness; and novelty counteracts hedonic adaptation — the tendency of any static life to fade to baseline.",
    sources: [
      {
        kind: "peer-reviewed",
        citation:
          "Van Boven, L., & Gilovich, T. (2003). To do or to have? That is the question. Journal of Personality and Social Psychology, 85(6), 1193–1202.",
      },
      {
        kind: "peer-reviewed",
        citation:
          "Kumar, A., Killingsworth, M. A., & Gilovich, T. (2014). Waiting for merlot: Anticipatory consumption of experiential and material purchases. Psychological Science, 25(10), 1924–1931.",
      },
      {
        kind: "peer-reviewed",
        citation:
          "Lyubomirsky, S., Sheldon, K. M., & Schkade, D. (2005). Pursuing happiness: The architecture of sustainable change. Review of General Psychology, 9(2), 111–131.",
      },
      {
        kind: "practitioner",
        citation:
          "The 'six adventures a year' rule is attributed to entrepreneur Jesse Itzler's account of a friend's practice — a practitioner heuristic, not a research finding. The mechanisms above are what the research supports.",
      },
    ],
    features: [
      "Idea board: Idea → Scheduled → Booked → Done",
      "Year calendar with spacing view",
      "Idea prompts by category",
      "Post-adventure savoring debrief",
    ],
    freeTier: false,
  },
  {
    slug: "deep-work",
    name: "Deep Work & Time Blocking",
    route: "/app/deep-work",
    layerId: 3,
    tagline: "Protect a small number of high-value, focus-intensive blocks.",
    description:
      "A weekly time-block planner and a deep-work session logger with focus ratings, plus a weekly hours trend so you can see whether the important work is actually getting protected.",
    whyItWorks:
      "Switching tasks leaves 'attention residue' — part of your attention stays with the previous task, measurably degrading performance on the next one. Blocking contiguous time for one demanding task is the direct countermeasure.",
    sources: [
      {
        kind: "peer-reviewed",
        citation:
          "Leroy, S. (2009). Why is it so hard to do my work? The challenge of attention residue when switching between work tasks. Organizational Behavior and Human Decision Processes, 109(2), 168–181.",
      },
      {
        kind: "book",
        citation:
          "Newport, C. (2016). Deep Work: Rules for Focused Success in a Distracted World. Grand Central. (A practitioner framework built on this and related cognitive-psychology literature — not itself a peer-reviewed study.)",
      },
    ],
    features: [
      "Weekly time-block calendar",
      "Session timer/logger with focus rating",
      "Weekly deep-work-hours trend",
    ],
    freeTier: false,
  },
  {
    slug: "woop",
    name: "WOOP / Mental Contrasting",
    route: "/app/woop",
    layerId: 3,
    tagline: "Wish, Outcome, Obstacle, Plan — a goal becomes an if-then plan.",
    description:
      "A guided four-step exercise that takes any goal and produces a concrete if-then implementation plan. Attach a WOOP to any objective or key result, or run it standalone.",
    whyItWorks:
      "WOOP (mental contrasting with implementation intentions) is one of the most rigorously tested motivation techniques in the literature, with randomized controlled trials across health, academic, and interpersonal domains. Its 'Plan' step is an implementation intention — the meta-analytic effect across 94 studies is medium-to-large (d ≈ 0.65).",
    sources: [
      {
        kind: "peer-reviewed",
        citation:
          "Oettingen, G. (2012). Future thought and behaviour change. European Review of Social Psychology, 23(1), 1–63.",
      },
      {
        kind: "peer-reviewed",
        citation:
          "Gollwitzer, P. M. (1999). Implementation intentions: Strong effects of simple plans. American Psychologist, 54(7), 493–503.",
      },
      {
        kind: "peer-reviewed",
        citation:
          "Gollwitzer, P. M., & Sheeran, P. (2006). Implementation intentions and goal achievement: A meta-analysis of effects and processes. Advances in Experimental Social Psychology, 38, 69–119.",
      },
      {
        kind: "book",
        citation:
          "Oettingen, G. (2014). Rethinking Positive Thinking: Inside the New Science of Motivation. Current.",
      },
    ],
    features: [
      "Linear four-step guided form",
      "Attach to any OKR key result",
      "Saved if-then statement cards",
    ],
    freeTier: false,
  },
  {
    slug: "habit-foundry",
    name: "Habit Foundry",
    route: "/app/habits",
    layerId: 4,
    tagline: "Install exactly one new habit per quarter — four per year.",
    description:
      "A habit pipeline (Backlog → Installing → Automatic → Dropped), a four-field install form (tiny version, anchor, if-then plan, identity line), and a weekly diagnostic review. Deliberately no daily checkbox grid: daily ticking belongs somewhere frictionless like a paper calendar or phone widget — the app's job is the weekly diagnosis, not habit-tracking theater.",
    whyItWorks:
      "In the landmark real-world study of habit formation, automaticity took between 18 and 254 days to develop, with a median of 66 — not the popular '21 days.' Starting at temporal landmarks (new quarter, birthday, Monday) measurably boosts aspirational behavior, and if-then implementation intentions substantially raise follow-through.",
    sources: [
      {
        kind: "peer-reviewed",
        citation:
          "Lally, P., van Jaarsveld, C. H. M., Potts, H. W. W., & Wardle, J. (2010). How are habits formed: Modelling habit formation in the real world. European Journal of Social Psychology, 40(6), 998–1009.",
      },
      {
        kind: "peer-reviewed",
        citation:
          "Dai, H., Milkman, K. L., & Riis, J. (2014). The fresh start effect: Temporal landmarks motivate aspirational behavior. Management Science, 60(10), 2563–2582.",
      },
      {
        kind: "peer-reviewed",
        citation:
          "Wood, W., & Neal, D. T. (2007). A new look at habits and the habit–goal interface. Psychological Review, 114(4), 843–863.",
      },
      {
        kind: "book",
        citation:
          "Clear, J. (2018). Atomic Habits. Avery. (Identity-based habits framing.)",
      },
      {
        kind: "book",
        citation:
          "Fogg, B. J. (2019). Tiny Habits: The Small Changes That Change Everything. Houghton Mifflin Harcourt. (The 'tiny version' scaling-down principle.)",
      },
    ],
    honestyNote:
      "The '21 days to form a habit' figure is a myth. The best real-world data (Lally et al., 2010) puts the median at 66 days, with a range of 18 to 254. Blueprint's quarterly cadence exists precisely to give a habit the time it actually needs.",
    features: [
      "Habit pipeline (Kanban)",
      "Four-field install form: tiny version, anchor, if-then, identity line",
      "Weekly diagnostic review — adherence out of 7 plus one adjustment",
    ],
    freeTier: true,
  },
  {
    slug: "deliberate-practice",
    name: "Deliberate Practice Tracker",
    route: "/app/practice",
    layerId: 4,
    tagline: "Structured, feedback-driven practice toward one skill.",
    description:
      "One active skill at a time. Log each session's specific sub-skill focus, the feedback you received, and how hard it sat relative to your current level. A monthly 'what changed' reflection replaces an hours counter — on purpose.",
    whyItWorks:
      "Ericsson's research found that what separates expert performers is the structure of their practice — specific goals, immediate feedback, working at the edge of current ability — not accumulated hours.",
    sources: [
      {
        kind: "peer-reviewed",
        citation:
          "Ericsson, K. A., Krampe, R. T., & Tesch-Römer, C. (1993). The role of deliberate practice in the acquisition of expert performance. Psychological Review, 100(3), 363–406.",
      },
      {
        kind: "book",
        citation:
          "Ericsson, A., & Pool, R. (2016). Peak: Secrets from the New Science of Expertise. Houghton Mifflin Harcourt.",
      },
    ],
    honestyNote:
      "The '10,000-hour rule' from Malcolm Gladwell's Outliers (2008) is a simplification Ericsson himself publicly disputed. The defining variable in his research is the structure of practice, not raw hours — which is why this module tracks feedback and difficulty, and deliberately has no hours-accumulated counter.",
    features: [
      "One active skill with a defined feedback source",
      "Session logger: sub-skill focus, feedback, difficulty",
      "Monthly 'what changed' reflection",
    ],
    freeTier: false,
  },
  {
    slug: "annual-review",
    name: "Annual / Quarterly Review",
    route: "/app/review",
    layerId: 5,
    tagline: "Close the loop each quarter; design the next one from evidence.",
    description:
      "An auto-populated review that pulls live stats from every module you run — habits installed, adventures completed, misogi status, OKR completion — plus a guided written reflection: what worked, what didn't, one change for next quarter.",
    whyItWorks:
      "Field and lab experiments show that deliberately reflecting on completed work measurably improves subsequent performance — codifying experience beats accumulating more of it. The quarterly ritual follows Kolb's experiential learning cycle: experience, reflect, conceptualize, experiment.",
    sources: [
      {
        kind: "peer-reviewed",
        citation:
          "Di Stefano, G., Gino, F., Pisano, G. P., & Staats, B. R. (2016). Making experience count: The role of reflection in individual learning. Harvard Business School Working Paper 14-093.",
      },
      {
        kind: "book",
        citation:
          "Kolb, D. A. (1984). Experiential Learning: Experience as the Source of Learning and Development. Prentice Hall.",
      },
    ],
    features: [
      "Auto-populated cross-module summary",
      "Guided reflection form",
      "Quarterly and annual cadence with archive",
    ],
    freeTier: false,
  },
  {
    slug: "gratitude",
    name: "Gratitude Practice",
    route: "/app/gratitude",
    layerId: 5,
    tagline: "Three things a week. Optional, and honestly framed.",
    description:
      "A lightweight weekly gratitude log — three items, once a week, toggled on or off from settings. Kept separate from the core habit engine on purpose.",
    whyItWorks:
      "The original counting-blessings experiment found gratitude journaling improved subjective well-being. Later, larger meta-analytic work confirms the effect is real but more modest than its popular reputation suggests.",
    sources: [
      {
        kind: "peer-reviewed",
        citation:
          "Emmons, R. A., & McCullough, M. E. (2003). Counting blessings versus burdens: An experimental investigation of gratitude and subjective well-being in daily life. Journal of Personality and Social Psychology, 84(2), 377–389.",
      },
      {
        kind: "peer-reviewed",
        citation:
          "Davis, D. E., et al. (2016). Thankful for the little things: A meta-analysis of gratitude interventions. Journal of Counseling Psychology, 63(1), 20–31.",
      },
    ],
    honestyNote:
      "Meta-analytic effect sizes for gratitude interventions are real but modest. This module is offered as a small, pleasant practice — not a transformation.",
    features: ["Three items per week", "On/off toggle in settings"],
    freeTier: false,
  },
];

export function getMethod(slug: string): Method | undefined {
  return METHODS.find((m) => m.slug === slug);
}

export function methodsByLayer(layerId: Layer["id"]): Method[] {
  return METHODS.filter((m) => m.layerId === layerId);
}

export const SOURCE_KIND_LABEL: Record<SourceKind, string> = {
  "peer-reviewed": "Peer-reviewed",
  book: "Book",
  practitioner: "Practitioner heuristic",
};
