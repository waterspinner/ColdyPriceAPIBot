const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot('5706559664:AAF6nPLa6o0zuV05WL4bICHR8SQNulOinpc', {polling: true});

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "Hi! I can fetch Osmosis token prices for you with token symbols. Just send the symbol, e.g. OSMO, and I will fetch the real time price for you.");
}) 

bot.on('message', async (msg) => {
    const token = msg.text;
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
          } else {
            bot.sendMessage(msg.chat.id, "Sorry, I couldn't find the price for that token.");
          }
        } catch (error) {
          bot.sendMessage(msg.chat.id, "Sorry, I couldn't fetch the price information.");
        }
});

