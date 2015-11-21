import Immutable from 'immutable';

/**
 * Usage:
 *
 * const data = Immutable.Map({ a: 1, b: 2, c: 3, d: 4 });
 *
 * data.filter(keyIn(['a', 'c'])); // pick
 * // Map { a: 1, c: 3 }
 *
 * data.filterNot(keyIn(['a', 'c'])); // omit
 * // Map { b: 2, d: 4 }
 *
 */
export function keyIn(keys) {
  const keySet = keys.toSeq().map(k => k.toString()).toSet();
  return (v, k) => keySet.has(k);
}

/**
 * Usage:
 *
 * const data = Immutable.fromJS([ {id: 1}, {id: 5}, {id: 10} ]);
 *
 * indexBy(data, 'id');
 * // Map { 1: {id: 1}, 5: {id: 5}, 10: {id: 10} }
 *
 * indexBy(data.toKeyedSeq())
 * // KeyedSeq [ [1, {id: 1}], [5, {id: 5}], [10, {id: 10}]] ]
 */
export function indexBy(list, key) {
  const isSeq = Immutable.Seq.isSeq(list);
  const indexedBySeq = list.toKeyedSeq().mapKeys((k, v) => v.get(key));
  if (isSeq) return indexedBySeq;
  return indexedBySeq.toMap();
}
