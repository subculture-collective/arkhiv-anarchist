// Many catalog titles are source file names without the extension, such as
// "01 LittleGreenSongbook SCREEN". Shown as they are, a long run-together word
// cannot wrap and splits mid-word. This separates the words for display only;
// the stored title and the original file name are unchanged.
export function displayTitle(title: string): string {
  return title
    .split(" ")
    .map((word) =>
      word.length < 12
        ? word
        : word.replace(/_/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2"),
    )
    .join(" ");
}
