import preventsRefetch from './preventsRefetch';
import requiresAuth from './requiresAuth';

// Helper method for the 90% use case. By no means do you have to use this.
export default function preventsRefetchAndRequiresAuth(metaSelector, next) {
  return preventsRefetch(metaSelector, requiresAuth(next));
}
