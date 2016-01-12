# Gamblr Server
This is the backend of the Gamblr application. It is built with NodeJS using Express.

# Setup
1. Pull from github
2. Download dependencies using **npm install**
3. Run mongodb locally
4. Create database 'gamblr'
5. Seed the Games collection using this mongo insert statement:
```json
db.games.insert(
  [
    {
      "name": "Poker",
      "alias": "poker",
    },
    {
      "name": "Blackjack",
      "alias": "blackjack",
    }
  ]
);
```
6. Start the server with **node app.js**

https://github.com/Automattic/mongoosew
