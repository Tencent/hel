export function randomNumber(lessThan = 100) {
  const seed = Math.random();
  return parseInt(seed * lessThan, 10);
}
