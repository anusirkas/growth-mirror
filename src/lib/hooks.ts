import { useSyncExternalStore } from "react";
import { exampleJournal } from "../data/exampleJournal";
import { readJournal, replaceJournal, serverJournal, subscribeJournal, weekStartOf } from "./journal";

export const useJournal = () => useSyncExternalStore(subscribeJournal, readJournal, serverJournal);

const SEEDED_KEY = "growth-mirror-examples-seeded";

/** Adds the example weeks once, on a first visit with an empty journal. */
export function seedExamplesOnce() {
  try {
    if (localStorage.getItem(SEEDED_KEY) || readJournal().length) return;
    localStorage.setItem(SEEDED_KEY, "1");
    replaceJournal(exampleJournal(weekStartOf(new Date())));
  } catch {
    /* storage unavailable: start empty */
  }
}

export type Route = { page: "write" } | { page: "history"; id?: string } | { page: "progress" };

function parse(hash: string): Route {
  const [, page, id] = hash.replace(/^#/, "").split("/");
  if (page === "history") return { page: "history", id: id ? decodeURIComponent(id) : undefined };
  if (page === "progress") return { page: "progress" };
  return { page: "write" };
}

const subscribeHash = (cb: () => void) => {
  window.addEventListener("hashchange", cb);
  return () => window.removeEventListener("hashchange", cb);
};

/** Tiny hash router: #/, #/history, #/history/:id, #/progress. Shareable and needs no server config. */
export function useRoute(): Route {
  const hash = useSyncExternalStore(subscribeHash, () => window.location.hash, () => "");
  return parse(hash);
}

export const href = (route: Route) =>
  route.page === "write" ? "#/" : route.page === "history" && route.id ? `#/history/${encodeURIComponent(route.id)}` : `#/${route.page}`;
