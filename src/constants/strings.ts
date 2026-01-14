export const STRINGS = {
  appName: 'Quote Vault',

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

    signupSuccess: 'Account created successfully.',
    resetEmailSent: 'Password reset email sent',

    loginRequiredTitle: 'Login Required', 
    loginRequiredMessage: 'You need to be logged in to save quotes.',
  },

  dailyQuote:{
    title:'Daily Quote',
    todayQuote:'Quote of the day!',
    swipeRightSide:'Swipe Right for Feed →',
  },

  home:{
    title:'Home',
    save:'Save',
    like:'Like',
    liked:'Liked',
    share:'Share',
    more:'More',
    collect:'Collect',
  },

  profile: {
    title: 'Profile',
    profileTab:'Profile Tab',
    emailLabel: 'Email:',
    logoutButton: 'Logout',
    tabs: {
        likes: 'Likes',
        collections: 'Collections',
    }
  },

  settings:{
    title: 'Settings',
    dailyQuoteNotification:'Daily Quote Notification',
    logout :'Logout',
    darkMode:'Dark Mode',
  },

  errors: {
    generalTitle: 'Error',
    favoriteUpdate: 'Could not update favorite status.',
    logonFailed:'Login Failed',
    loginRequired:'Login Required',
    loginRequiredMessage:'You need to be logged in to perform this action.',
    failedToGetDailyQuote:'Failed to load the quote',
    failedToLoadQuotes:'Failed to load quotes.',
  },

  success:{
    title:"Success",
    favoriteAdded: 'Quote added to favorites.',
  },

  collections:{
    title:'Collections',
    noQuotesFound:'No quotes found!',
    noQuotesInCollection : 'No quotes found in the collection',
  },

  common:{
    cancel:'Cancel',
    close:'Close',
  },

} as const;
