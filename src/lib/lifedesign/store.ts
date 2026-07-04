import { createLocalStore } from "@/lib/local-store";
import type { LifeDesignPlan } from "./types";

const plansStore = createLocalStore<LifeDesignPlan>(
  "blueprint.life_design_plans",
);

export const subscribePlans = plansStore.subscribe;
export const getPlans = plansStore.get;
export const replacePlans = plansStore.replace;

export { getServerSnapshot } from "@/lib/local-store";
