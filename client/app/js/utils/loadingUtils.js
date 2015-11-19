export function hasLoaded(meta) {
  return meta && meta.get('lastUpdated') != null;
}

export function hasFailed(meta) {
  return meta && meta.get('didFailFetching');
}
