require('dotenv').config();
const apiKey = process.env.API_KEY;
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(`${apiKey}`, {polling: true});

function formatTokenName(token) {
  const lowerCaseSuffix = ".axl";
  const lowerCaseIndex = token.toLowerCase().indexOf(lowerCaseSuffix);
  if (lowerCaseIndex !== -1) {
    const upperCasePrefix = token.substring(0, lowerCaseIndex);
    const lowerCaseSuffix = token.substring(lowerCaseIndex);
    return upperCasePrefix.toUpperCase() + lowerCaseSuffix.toLowerCase();
  } 
  else if (token.toLowerCase().startsWith("ibc")) {
    return "ibc" + token.substring(3);
  }
  else {
    return token.toUpperCase();
  }
}


bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "Hi! I can fetch Osmosis token prices for you with token symbols. Just send the symbol, e.g. OSMO, and I will fetch the real time price for you.");
}) 

bot.on('message', async (msg) => {
    const token = formatTokenName(msg.text);
    const url = `https://price.coldyvalidator.net/price?token=${token}`;
    console.log(url)

    try{
        const response = await fetch(url);
        const data = await response.json();
        console.log(data); // log the response object to the console
        console.log(token);
        console.log(Number(data.prices[token].price.osmodollar).toFixed(2));
        const price = Number(data.prices[token].price.osmodollar).toFixed(2);
        if (price) {
            bot.sendMessage(msg.chat.id, `The price of ${token} is $${price}`);
          } 
          else {
            bot.sendMessage(msg.chat.id, "Sorry, I couldn't find the price for that token.");
          }
        } catch (error) {
          bot.sendMessage(msg.chat.id, "Sorry, I couldn't fetch the price information.");
        }
});

