/**
 * Single source of truth for portfolio products + projects.
 * Home, Our Work, footer, llms.txt, JSON-LD, and site-audit all read from here
 * (via products.json). Do not duplicate product lists elsewhere.
 */
import data from "./products.json";

export type PortfolioProduct = (typeof data.products)[number];
export type PortfolioProject = (typeof data.projects)[number];

export const products = data.products;
export const projects = data.projects;

/** Stable ordered names — used by site-audit consistency checks. */
export const PRODUCT_NAMES = products.map((p) => p.name);
export const PROJECT_NAMES = projects.map((p) => p.name);
export const PRODUCT_IDS = products.map((p) => p.id);

export function productById(id: string) {
  return products.find((p) => p.id === id);
}
