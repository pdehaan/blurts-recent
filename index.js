#!/usr/bin/env node

import CachedFetch from "@11ty/eleventy-fetch";

const BREACH_COUNT = process.env.COUNT || 5;

const breaches = await getRecentBreaches();
breaches.forEach((b) =>
  console.log(
    `[${b.AddedDate.toLocaleDateString()}] ${b.Name} (${b.Domain}) ${b.IsSensitive ? "-- sensitive" : ""}`.trim()
  )
);

async function getRecentBreaches(count = BREACH_COUNT, duration = "15m") {
  const CACHE_OPTIONS = { duration, type: "json" };
  const breaches = await CachedFetch(
    "https://haveibeenpwned.com/api/v3/breaches",
    CACHE_OPTIONS
  );

  return breaches
    .map((b) => Object.assign(b, { AddedDate: new Date(b.AddedDate) }))
    .sort((a, b) => b.AddedDate - a.AddedDate)
    .slice(0, count);
}
