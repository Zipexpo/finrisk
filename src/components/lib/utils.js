import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const formatMoney = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export const colorScheme = [
  "var(--color-chrome)",
  "var(--color-safari)",
  "var(--color-firefox)",
  "var(--color-edge)",
  "var(--color-other)",
];

export function getIntersection(p1, p2, p3, p4) {
  // Extract coordinates
  const x1 = p1[0],
    y1 = p1[1];
  const x2 = p2[0],
    y2 = p2[1];
  const x3 = p3[0],
    y3 = p3[1];
  const x4 = p4[0],
    y4 = p4[1];

  // Calculate the denominator of the parametric equations
  const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

  // If denom is 0, the lines are parallel
  if (denom === 0) return null;

  // Parametric equation constants
  const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
  const u = ((x1 - x3) * (y1 - y2) - (y1 - y3) * (x1 - x2)) / denom;

  // Check if t and u are within the range [0, 1]
  if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
    // Intersection point using parametric equation
    const intersectX = x1 + t * (x2 - x1);
    const intersectY = y1 + t * (y2 - y1);
    return { x: intersectX, y: intersectY };
  }

  // No intersection
  return null;
}
