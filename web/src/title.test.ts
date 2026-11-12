import { describe, expect, it } from "vitest";
import { displayTitle } from "./title";

describe("displayTitle", () => {
  it("separates the words of a run-together file name", () => {
    expect(displayTitle("01 LittleGreenSongbook SCREEN")).toBe(
      "01 Little Green Songbook SCREEN",
    );
    expect(displayTitle("ars_print_pdf_final1")).toBe("ars print pdf final1");
  });
  it("leaves ordinary titles, short names and identifiers alone", () => {
    for (const title of [
      "10 Preliminary Theses on Resistance",
      "0gb6n3",
      "McDonald and iPhone",
      "1856: The Battle in Seattle",
    ]) {
      expect(displayTitle(title)).toBe(title);
    }
  });
});
