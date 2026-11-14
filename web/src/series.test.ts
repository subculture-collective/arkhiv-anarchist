import { describe, expect, it } from "vitest";
import data from "./series.json";
import { creatorNames, issueCount, issueLabel, seriesOf } from "./series";

describe("curated series", () => {
  it("gives each series a unique slug and each document one series", () => {
    for (const list of Object.values(data)) {
      const slugs = list.map((series) => series.slug);
      expect(new Set(slugs).size).toBe(slugs.length);
      const ids = list.flatMap((series) => series.issues.map((i) => i.id));
      expect(new Set(ids).size).toBe(ids.length);
      for (const id of ids) expect(id).toMatch(/^[0-9a-f]{64}$/);
    }
  });
  it("finds a document's series and issue", () => {
    const found = seriesOf(
      "anarchist-zines",
      "c1ba795684646fb15492247991ed940ed35203bf78aa379c086c20bfe060f6e0",
    );
    expect(found?.series.name).toBe("Stormwarnings");
    expect(found?.issue).toBe("43–44");
    expect(seriesOf("anarchist-zines", "missing")).toBeUndefined();
  });
  it("counts the formats of one issue once", () => {
    expect(issueCount(["42", "42 (print)", "43–44", "43–44 (print, A4)"])).toBe(2);
  });
  it("labels plain issue numbers", () => {
    expect(issueLabel("3")).toBe("Issue 3");
    expect(issueLabel("Volume 2")).toBe("Volume 2");
    expect(issueLabel("42 (print)")).toBe("Issue 42 (print)");
  });
});

describe("creator suggestions", () => {
  it("splits shared credits and merges spellings that differ in case", () => {
    expect(
      creatorNames([
        "Lucy McKenzie",
        "Lucy Mckenzie",
        "Greta Drummond-Gillett, Layla Gibbon",
        "",
        undefined,
      ]),
    ).toEqual(["Greta Drummond-Gillett", "Layla Gibbon", "Lucy McKenzie"]);
  });
});
