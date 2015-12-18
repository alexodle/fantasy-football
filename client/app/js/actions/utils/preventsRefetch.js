import shouldFetch from './shouldFetch';

export default function preventsRefetch(metaSelector, next) {
  return (dispatch, getState) => {
    const meta = metaSelector(getState());
    if (shouldFetch(meta)) {
      next(dispatch, getState);
    }
  };
}
