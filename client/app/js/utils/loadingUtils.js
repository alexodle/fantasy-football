export function hasLoaded(meta) {
  return meta && meta.lastUpdated != null;
}

export function hasFailed(meta) {
  return meta && meta.didFailFetching;
}
