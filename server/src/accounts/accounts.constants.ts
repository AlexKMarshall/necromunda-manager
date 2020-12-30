export const ACCOUNT_NAMES = {
  STASH: 'Stash',
  FIGHTERS: 'Fighters',
  INITIAL_EQUITY: 'Initial Equity',
};

export const ACCOUNTS = [
  { name: ACCOUNT_NAMES.STASH, accountType: { name: 'Asset' } },
  { name: ACCOUNT_NAMES.FIGHTERS, accountType: { name: 'Asset' } },
  {
    name: ACCOUNT_NAMES.INITIAL_EQUITY,
    accountType: { name: 'Equity' },
  },
];
