# Cat Collection

A browser-based cat card collection game. Development starts in a separate improvements branch; see the pull request for implementation details.


## Run locally

```bash
npm install
npm run dev
```

Create a production build with `npm run build`.

## First playable version

- Three in-app sections: Home, Collection and Mini-games.
- Cat roulette with weighted rarity chances: Common 50%, Uncommon 25%, Rare 15%, Epic 8%, Legendary 2%.
- Opening a pack costs 50 in-game coins.
- Duplicate cards award 10 coins.
- A tap mini-game awards 25 coins after 10 taps.
- Collection progress, coin balance and RU/EN preference are stored locally in the browser.
- Cat names, descriptions, and the main interface support Russian and English.

## Security and data limitations

- No real-money payments, cash wagering, account system, or multiplayer features.
- Browser storage is user-controlled and can be edited or cleared. It is only used for local convenience and is not a trusted server-side record.
- The game validates restored coin and collection values and tolerates malformed saved JSON.
- Do not treat local progress as proof of achievements or expose secrets in client-side code.

## Current scope

This is a first playable prototype. The mini-game is a simple tap challenge; further games, accessibility review, automated tests, and production deployment checks remain future work.
