export const STRINGS = {
  appName: 'QuoteVault',

  auth: {
    loginTitle: 'Login',
    signupTitle: 'Signup',
    forgotPasswordTitle: 'Reset Password',

    emailPlaceholder: 'Email',
    passwordPlaceholder: 'Password',

    loginButton: 'Login',
    signupButton: 'Signup',
    cancelButton:'Cancel',
    createAccountButton: 'Create Account',
    backToLoginButton: 'Back to Login',
    forgotPasswordButton: 'Forgot Password',
    sendResetEmailButton: 'Send Reset Email',

    signupSuccess: 'Account created. You can login.',
    resetEmailSent: 'Password reset email sent',

    loginRequiredTitle: 'Login Required', 
    loginRequiredMessage: 'You need to be logged in to save quotes.',
  },

  profile: {
    title: 'Profile',
    emailLabel: 'Email:',
    logoutButton: 'Logout',
    tabs: {
        likes: 'Likes',
        collections: 'Collections',
    }
  },

  settings:{
    title: 'Settings',
  },

  errors: {
    generalTitle: 'Error',
    favoriteUpdate: 'Could not update favorite status.',
    logonFailed:'Login Failed'
  },

  success:{
    title:"Success",
    favoriteAdded: 'Quote added to favorites.',
  }

} as const;
