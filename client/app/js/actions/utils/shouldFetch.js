export default function shouldFetch(meta) {
  if (!meta) return true;
  if (meta.isFetching) return false;
  if (!meta.lastUpdated) return true;
  return meta.didInvalidate;
}
