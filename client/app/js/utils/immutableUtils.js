/**
 * Usage:
 *
 * var data = Immutable.Map({ a: 1, b: 2, c: 3, d: 4 });
 * data.filter(keyIn(['a', 'c'])); // pick
 * // Map { a: 1, c: 3 }
 * data.filterNot(keyIn(['a', 'c'])); // omit
 * // Map { b: 2, d: 4 }
 *
 */
export function keyIn(keys) {
  const keySet = keys.toSeq().map(k => k.toString()).toSet();
  return (v, k) => keySet.has(k);
}
