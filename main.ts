import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry line — verbatim, do not change.
const LINE =
  "Please unplug the router, count to ten, and then plug it back in—but this time, with feeling, like you mean it.";

// Sealed gate (verified in the kit's RULES.txt): entry.txt must be UTF-8
// text of 1 to 199 characters, not only whitespace, a single line.
// The brief says "under 200" — the sealed gate is 1-199, so 200 is invalid.
const MAX_CHARS = 199;

function fail(message: string): never {
  console.error(`entry rejected: ${message}`);
  process.exit(1);
}

if (LINE.length < 1 || LINE.length > MAX_CHARS) {
  fail(`entry must be 1-${MAX_CHARS} characters, got ${LINE.length}`);
}
if (/\r|\n/.test(LINE)) {
  fail("entry must be a single line");
}
// Control characters (other than the trailing newline we add) would make
// the file fail the UTF-8 text gate; reject them here.
if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(LINE)) {
  fail("entry must not contain control characters");
}
if (LINE.trim().length === 0) {
  fail("entry must not be only whitespace");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE + "\n", "utf8");
// Read-back check: what landed on disk must be exactly the line + newline.
if (readFileSync(outPath, "utf8") !== LINE + "\n") {
  fail("read-back mismatch: entry.txt on disk differs from the line");
}
console.log(`wrote ${LINE.length} characters to entry.txt`);
