export function average(arr) {
  if (arr.length === 0) return 0;
  return arr.reduce((prev, curr, _, array) => prev + curr / array.length);
}
