// Turns Firebase's technical error codes into sentences a shop owner understands.
export function friendlyError(err) {
  switch (err.code) {
    case 'auth/email-already-in-use':
      return 'That email is already registered. Try logging in instead.'
    case 'auth/invalid-email':
      return 'That email address does not look right.'
    case 'auth/weak-password':
      return 'Choose a password with at least 6 characters.'
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Email or password is wrong.'
    case 'auth/too-many-requests':
      return 'Too many attempts. Wait a few minutes and try again.'
    case 'auth/network-request-failed':
      return 'No internet connection. Check your network and try again.'
    default:
      return err.message || 'Something went wrong. Please try again.'
  }
}
