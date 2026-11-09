window.DECENT_CONFIG = {
  appName: 'Umbrella Academy',
  subtitle: 'Advanced practice for the Umbrella Group',
  chain: null,
  ens: { enabled: false },
  theme: { 'bg-1': '#171126', 'bg-2': '#302344', accent: '#ddc0ff', 'accent-2': '#b36ed6' },
  ipfsAdapter: { version: 1, label: 'Academy practice', capabilities: {}, getStatus: async () => ({}) },
  about: {
    title: 'About Umbrella Academy',
    summary: 'Advanced training and practice for the Umbrella Group, building on Decent Code Camp.',
    sections: [
      { title: 'Practice in context', body: 'For graduates familiar with BigNuten, DBusk, DJuke and DVert, and future homestead work. This is not a second beginner academy.' },
      { title: 'Availability and privacy', body: 'Membership and the historical flash-loan prototype are not deployed services. Wallet connection grants no membership. IPFS storage is unavailable; provider selection does not verify storage. UCAN authorization is not implemented.' }
    ]
  },
  links: [{ label: 'Source', url: 'https://github.com/TheJollyLaMa/UmbrellaAcademy' }]
};
