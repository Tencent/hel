export function delay(ms = 1000) {
  return new Promise((r) => setTimeout(r, ms));
}
