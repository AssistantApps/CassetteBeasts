import { AppImage } from './image';

export const site = {
  ref: 'assistantCBS',
  cname: 'cassettebeasts.assistantapps.com',
  rootUrl: 'https://cassettebeasts.assistantapps.com/',
  title: 'Assistant for Cassette Beasts',
  theme: {
    colour: '#1b1f22',
    maskColour: '#1b1f22',
    appleStatusBar: '#1b1f22',

    primaryBackground: '#242424',
    brandPrimary: '#ab75e8',
    brandSecondary: '#ab75e8',
    brandTertiary: '#3fbb9f',
    gameCardBackground: '#f3edd8',
    gameCardForeground: '#1f1f1f',
    statHexBackground: '#9dacc2',
  },
  meta: {
    appName: 'Assistant for Cassette Beasts',
    title: 'Assistant for Cassette Beasts',
    description: 'Data from the game Cassette Beasts, automatically generated',
    keywords: 'cassette beasts, cassette, beasts, assistant apps, assistant',
    copyright: 'Bytten Studio Ltd',
  },
  preconnectLinks: [],
  legalNotice:
    'This app is not affiliated with, authorised by Bytten Studio Ltd, its subsidiaries, or its parent companies, whose names, logos and products are displayed in this app. The names Cassette Beasts, Bytten Studio Ltd as well as related names and images are registered trademarks of their respective owners. This app is made by fan(s) for fans. Please do not reach out to Bytten Studio Ltd about bugs within this app',
  twitter: {
    handle: '@AssistantNMS',
    imageAlt: 'Logo of the Assistant Apps',
    metaImageSize: 'summary_large_image',
  },
  images: {
    maskIcon: '/assets/favicon/safari-pinned-tab.svg',
    favicon: {
      ico: '/favicon.ico',
      x16: '/assets/favicon/favicon-16x16.png',
      x32: '/assets/favicon/favicon-32x32.png',
      x96: '/assets/favicon/favicon-96x96.png',
      x192: '/assets/favicon/android-chrome-192x192.png',
    },
    apple: {
      x76: '/assets/favicon/apple-76.png',
      x114: '/assets/favicon/apple-114.png',
      x120: '/assets/favicon/apple-120.png',
      x144: '/assets/favicon/apple-144.png',
      x152: '/assets/favicon/apple-152.png',
    },
    manifest: [
      {
        path: '/assets/favicon/android-chrome-192x192.png',
        sizes: '192x192',
      },
      {
        path: '/assets/favicon/android-chrome-128x128.png',
        sizes: '128x128',
      },
      {
        path: '/assets/favicon/favicon-96x96.png',
        sizes: '96x96',
      },
      {
        path: '/assets/favicon/favicon-64x64.png',
        sizes: '64x64',
      },
      {
        path: '/assets/favicon/favicon-32x32.png',
        sizes: 'x32',
      },
    ],
    meta: {
      width: 1200,
      height: 627,
      url: AppImage.meta,
    },
  },
  google: {
    verificationKey: '',
  },
  github: {
    repo: 'https://github.com/AssistantApps/CassetteBeasts',
  },
  assistantApps: {
    appGuid: '343224c4-4d40-4ce1-68ad-08dcab0020d7',
    name: 'AssistantApps',
    email: 'mailto:support@assistantapps.com',
    website: 'https://assistantapps.com',
    tools: 'https://tools.assistantapps.com',
    github: 'https://assistantapps.com/github',
    discord: 'https://assistantapps.com/discord',
    patreon: 'https://www.patreon.com/AssistantApps',
  },
  humans: {
    kurt: {
      name: 'Kurt Lourens',
      email: 'mailto:hi@kurtlourens.com',
      website: 'https://kurtlourens.com',
      image: 'https://kurtlourens.com/assets/images/KurtAvatar.svg',
      contact: 'hi [at] kurtlourens.com',
      jobTitle: 'Senior Software Engineer',
      additionalName: 'KhaozTopsy',
      location: 'the Netherlands',
      twitter: '@KhaozTopsy',
      discord: '@KhaozTopsy',
    },
  },
  projectStartDate: '2024-07-12',
  contactEmail: 'support@assistantapps.com',
};

export const LocalStorageKey = {
  main: 'assistant-apps-cassette-beasts',
} as const;
