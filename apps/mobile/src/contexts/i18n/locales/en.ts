const profile = {
  header: {
    text: 'Summoner\'s Helper Profile'
  },
  personalInfo: {
    title: 'Personal Information',
    email: 'Email',
    username: 'Username'
  },
  riotAccount: {
    title: 'Riot Account',
    gameName: 'Game Name',
    tagLine: 'Tagline',
    server: 'Server'
  },
  bindAccount: {
    title: 'No account linked',
    hint: 'Link your Riot account to connect your game data to your profile.',
    button: 'Link Riot Account'
  },
  toggleTheme: 'Change theme',
  logout: {
    button: 'Log out',
    title: 'Are you sure?',
    content: 'Are you sure you want to log out?'
  },
  snackbar: 'Could not log out. Please try again.'
}

const myGuides = {
  feedback: {
    loading: 'Loading...',
    error: 'An error occurred',
    loadMore: 'Load more',
    emptyList: 'You do not have any builds yet',
  },
  filter: {
    buttons: {
      toggle: 'Filters',
      clear: 'Clear',
      submit: 'Search'
    },
    fields: {
      title: {
        label: 'Title',
        placeholder: 'Title'
      },
      champion: {
        title: 'Champion',
        placeholder: 'Select a champion'
      },
      role: {
        title: 'Select a role',
        placeholder: 'Select a role'
      }
    }
  }
}

const riot = {
  server: {
    br1: 'Brazil',
    eun1: 'Europe Nordic & East',
    euw1: 'Europe West',
    jp1: 'Japan',
    kr: 'Korea',
    la1: 'Latin America North',
    la2: 'Latin America South',
    me1: 'Middle East',
    na1: 'North America',
    oc1: 'Oceania',
    ru: 'Russia',
    sg2: 'Singapore, Malaysia, and Others (SEA)',
    tr1: 'Turkey',
    tw2: 'Taiwan',
    vn2: 'Vietnam',
  }
}

const recentGuides = {
  title: 'Recent Guides'
}

const quickSearchbar = {
  searchbarPlaceholder: 'Search for a guide',
  advancedSearchButton: 'Advanced Search',
  emptyText: 'No results found'
}

const recentGuidesList = {
  reload: 'Oops! An error occurred... Click to try again!',
  loadMore: 'Load more',
  error: 'Error loading builds'
}

const advancedSearch = {
  form: {
    fields: {
      champion: {
        title: 'Champion',
        placeholder: 'Select a champion'
      },
      title: {
        label: 'Search by title',
        placeholder: 'Search by title'
      },
      role: {
        title: 'Champion role',
        placeholder: 'Search by champion role'
      },
      createdBy: {
        title: 'Guide creator',
        placeholder: 'Search by guide creator'
      },
      deprecatedPatch: {
        label: 'Search for outdated guides'
      }
    },
    actions: {
      clear: 'Clear',
      submit: 'Search'
    },
  },
  feedback: {
    loading: 'Loading...',
    error: 'An error occurred...',
  },
  listEmpty: {
    empty: 'Update the filters to find a guide',
    fromSearch: 'No guides found'
  },
  loadMore: 'Load more',
  error: 'Error loading builds'
}

const guideListItem = {
  view: 'View',
  edit: 'Edit guide'
}

const createGuide = {
  error: 'Failed to save. Please try again.',
  saveButton: {
    loading: 'Saving...',
    text: 'Save'
  },
  steppers: {
    intro: 'Introduction',
    spells: 'Summoner Spells',
    primaryRunes: 'Primary Runes',
    secondaryRunes: 'Secondary Runes',
    bonus: 'Bonuses',
    items: 'Items',
    progression: 'Ability Progression',
    threats: 'Threats',
    review: 'Review'
  },
  snack: {
    close: 'Close',
    success: 'Saved successfully!'
  }
}

const stepper = {
  error: 'There must be more than one element',
  footer: {
    next: 'Next step',
    previous: 'Previous step'
  },
  contextError: 'StepperContext must be used within StepperProvider'
}

const userPicker = {
  title: 'Select a user',
  searchbar: 'Search for a user here',
  cancel: 'Cancel'
}

const displayUserList = {
  idle: 'Search for a user',
  notFound: 'No users found'
}

const commentSection = {
  loadMore: 'Load more',
  empty: 'No comments yet. Be the first!'
}

const replies = {
  empty: {
    text: 'This comment has no replies',
    button: 'Reply'
  }
}

const postComment = {
  error: 'Could not post the comment',
  button: 'Comment',
  replyTo: 'Reply',
  title: 'New Comment',
  placeholder: 'Write your comment...'
}

const replyCard = {
  replyTo: 'Replying to'
}

const comment = {
  reply: 'Reply',
  replies: 'Replies',
  deletedUser: 'Deleted'
}

const sideMenu = {
  report: 'Report comment'
}

const error = {
  text: 'Oops! An error occurred... Please try again later!'
}

const introForm = {
  title: {
    label: 'Title',
    placeholder: 'Title'
  },
  intro: {
    label: 'Introduction',
    placeholder: 'Introduction'
  },
  champion: {
    title: 'Select a champion',
    placeholder: 'Select a champion'
  },
  role: {
    title: 'Select a role',
    placeholder: 'Select a role'
  }
}

const progressionForm = {
  description: {
    label: 'Ability progression',
    placeholder: 'Ability progression description'
  },
  noChampionData: 'No champion selected'
}

const bonusForm = {
  description: {
    label: 'Description',
    placeholder: 'Bonus description'
  },
  slotOne: {
    title: 'Select a bonus',
    placeholder: 'Select a bonus'
  },
  slotTwo: {
    title: 'Select a second bonus',
    placeholder: 'Select a second bonus'
  },
  slotThree: {
    title: 'Select a third bonus',
    placeholder: 'Select a third bonus'
  }
}

const slotBonus = {
  AdaptiveForce: 'Adaptive Force',
  AdaptiveForceScaling: 'Adaptive Force per Level',
  Armor: 'Armor',
  AttackSpeed: 'Attack Speed',
  CDRScaling: 'Ability Haste per Level',
  HealthPlus: 'Health',
  HealthScaling: 'Health per Level',
  MagicRes: 'Ability Haste',
  MovementSpeed: 'Movement Speed',
  Tenacity: 'Tenacity',
}

const slotBonusDescription = {
  AdaptiveForce: 'Increases attack damage or ability power.',
  AdaptiveForceScaling: 'Increases adaptive force per level.',
  Armor: 'Reduces physical damage taken.',
  AttackSpeed: 'Increases attack speed.',
  CDRScaling: 'Reduces ability cooldowns.',
  HealthPlus: 'Increases maximum health.',
  HealthScaling: 'Increases health per level.',
  MagicRes: 'Allows you to use abilities more frequently.',
  MovementSpeed: 'Increases movement speed.',
  Tenacity: 'Reduces the duration of crowd control effects.',
}

const bonusLabelShards = {
  AdaptiveForce: 'AD / AP',
  AdaptiveForceScaling: 'AD / AP',
  Armor: 'ARMOR',
  AttackSpeed: 'ATK. SPD.',
  CDRScaling: 'ABILITY HASTE',
  HealthPlus: 'HEALTH',
  HealthScaling: 'HEALTH',
  MagicRes: 'ABILITY HASTE',
  MovementSpeed: 'MOVE SPD.',
  Tenacity: 'TENACITY',
}

const spellsForm = {
  firstSpell: {
    title: 'Select a summoner spell',
    placeholder: 'Select a summoner spell'
  },
  secondSpell: {
    title: 'Select a second summoner spell',
    placeholder: 'Select a second summoner spell'
  },
  description: {
    label: 'Summoner spell description',
    placeholder: 'Describe how to use the summoner spells'
  }
}

const mainRuneForm = {
  primaryRune: {
    title: 'Primary Path',
    placeholder: 'Select a path'
  },
  first: {
    title: 'First Rune',
    placeholder: 'Select the first rune'
  },
  second: {
    title: 'Second Rune',
    placeholder: 'Select the second rune'
  },
  third: {
    title: 'Third Rune',
    placeholder: 'Select the third rune'
  },
  fourth: {
    title: 'Fourth Rune',
    placeholder: 'Select the fourth rune'
  },
  description: {
    label: 'Rune description',
    placeholder: 'Rune description'
  }
}

const secondaryRuneForm = {
  secondaryRune: {
    title: 'Secondary Path',
    placeholder: 'Select a path'
  },
  first: {
    title: 'First Rune',
    placeholder: 'Select the first rune'
  },
  second: {
    title: 'Second Rune',
    placeholder: 'Select the second rune'
  },
  third: {
    title: 'Third Rune',
    placeholder: 'Select the third rune'
  },
  description: {
    label: 'Rune description',
    placeholder: 'Rune description'
  }
}

const threatsForm = {
  fields: {
    description: {
      label: 'Threats description',
      placeholder: 'Threats description'
    },
    addThreat: {
      select: {
        title: 'Select a threat',
        placeholder: 'Select a threat'
      },
      description: {
        label: 'Threat description',
        placeholder: 'Threat description'
      }
    },
    removeThreatButton: 'Remove threat'
  },
  addThreatButton: 'Add threat'
}

const itemsForm = {
  fields: {
    description: 'Items description',
    placeholder: 'Describe your item choices'
  },

  addNewBlockButton: 'Add a new block',
  removeBlockButton: 'Remove block',
  addItem: 'Add',
  searchbar: 'Search items'
}

const itemContext = {
  error: 'ItemSelectionContext must be used within ItemSelectionProvider'
}

const itemDialog = {
  title: 'Are you sure?',
  content: 'The item will be removed from the list',
  cancel: 'Cancel',
  remove: 'Yes, remove it'
}

const itemsFields = {
  block: {
    name: 'Item block name',
    description: 'Item block description'
  }
}

const login = {
  fields: {
    email: {
      label: 'Email',
      placeholder: 'Your email'
    },
    password: {
      label: 'Password',
      placeholder: 'Your password'
    }
  },
  submit: 'Log in',
  goToRegister: 'Go to sign up'
}

const register = {
  fields: {
    email: {
      label: 'Email',
      placeholder: 'Your email'
    },
    username: {
      label: 'Username',
      placeholder: 'Your username'
    },
    password: {
      label: 'Password',
      placeholder: 'Your password'
    }
  },
  submit: 'Sign up'
}

const errorFeedback = {
  text: 'Failed to load Data Dragon data...',
  button: 'Try again!'
}

const loadingFeedback = {
  default: 'Loading...',
  i18n: 'Loading language settings...'
}

const abilitiesProgressionSection = {
  header: 'Ability Progression'
}

const bonusSection = {
  header: 'Bonuses',
  description: 'Description',
  first: 'First Bonus',
  second: 'Second Bonus',
  third: 'Third Bonus'
}

const introductionSection = {
  header: 'General Information',
  intro: 'Introduction',
  champion: 'Champion'
}

const itemsSection = {
  header: 'Items',
  description: 'Description'
}

const runesSection = {
  header: 'Runes',
  mainRune: {
    title: 'Primary Path',
    description: 'Description',
    first: 'First Rune',
    second: 'Second Rune',
    third: 'Fourth Rune',
  },
  secondaryRune: {
    title: 'Secondary Path',
    description: 'Description',
    first: 'First Rune',
    second: 'Second Rune',
    third: 'Fourth Rune',
  }
}

const spellSection = {
  header: 'Summoner Spells',
  description: 'Description',
  first: 'First Summoner Spell',
  second: 'Second Summoner Spell',
}

const threatsSection = {
  header: 'Threats',
  description: 'Threats description'
}

const changeLanguage = {
  anchor: 'Change language',
  placeholder: 'Change language',
  title: 'Language',
  action: 'Select language',
  saveLangErrors: {
    change: 'Could not change language preference',
    persistence: 'Could not save language preference'
  },
  snackbar: {
    error: 'It was not possible to change language'
  }
}

const reviewGuide = {
  save: 'Save'
}

const viewGuide = {
  reportGuide: 'Report guide',
  titles: {
    intro: 'Introduction',
    spells: 'Summoner Spells',
    runes: 'Runes',
    bonus: 'Bonuses',
    items: 'Items',
    progression: 'Ability Progression',
    threats: 'Threats',
    comments: 'Comments'
  }
}

const progressionContent = {
  loading: 'Loading...',
  error: 'An error occurred while loading the data'
}

const difficulty = {
  '1': 'Very Easy',
  '2': 'Easy',
  '3': 'Intermediate',
  '4': 'Difficult',
  '5': 'Very Difficult'
}

const heroBanner = {
  title: 'Guide',
  difficulty: 'Difficulty'
}

const runesContent = {
  header: 'Runes',
  mainRune: 'Primary Path',
  secondaryRune: 'Secondary Path',
  first: 'First Rune',
  second: 'Second Rune',
  third: 'Third Rune',
  fourth: 'Fourth Rune',
}

const general = {
  yes: 'yes',
  no: 'no'
}

const screens = {
  Profile: 'Profile',
  MyGuides: 'My Guides',
  Home: 'Recent',

  BindRiotAccount: 'Bind Riot Account',
  CreateGuide: 'Create Guide',
  EditGuide: 'Edit Guide',
  ViewGuide: 'View Guide',
  Report: 'Report',

  Login: 'Login',
  Register: 'Register'
}

const enUS = {
  changeLanguage,
  profile,
  riot,
  general,
  screens,
  myGuides,
  recentGuides,
  quickSearchbar,
  recentGuidesList,
  advancedSearch,
  guideListItem,
  createGuide,
  stepper,
  error,
  userPicker,
  displayUserList,
  commentSection,
  replies,
  postComment,
  replyCard,
  comment,
  sideMenu,
  introForm,
  progressionForm,
  bonusForm,
  slotBonus,
  slotBonusDescription,
  bonusLabelShards,
  spellsForm,
  mainRuneForm,
  secondaryRuneForm,
  threatsForm,
  itemsForm,
  itemContext,
  itemDialog,
  itemsFields,
  login,
  register,
  errorFeedback,
  loadingFeedback,
  abilitiesProgressionSection,
  bonusSection,
  introductionSection,
  itemsSection,
  runesSection,
  spellSection,
  threatsSection,
  reviewGuide,
  viewGuide,
  progressionContent,
  heroBanner,
  difficulty,
  runesContent
}

export default enUS
