const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const get = require('axios');

require('dotenv').config({ path: './.env' });
const logger = require('./logger');

const client = new Client({
    intents : [
        GatewayIntentBits.Guilds
    ]
})

let isOffline = false;

client.on('ready', () => {
    logger.info('ZEC Tracker Running...')
    setInterval(getData, 10 * 2000)
})

const getData = async () => {
    try {
        const res = await get(`https://api.coingecko.com/api/v3/simple/price?ids=zcash&vs_currencies=usd`);
        const zecPrice = res.data.zcash.usd;

        if (isOffline) {
            logger.info('Bot is back online.');
            isOffline = false;
        }

        client.user.setActivity(`ZEC $${Number(zecPrice).toFixed(2)}`, { type: ActivityType.Watching });
    } catch (err) {
        if (err.code == 'ECONNRESET') {
            logger.info('ECONNRESET');
            logger.error('Connection was reset - ECONNRESET error.');
        } else if (err.code === 'ENOTFOUND') {
            if (!isOffline) {
                logger.info('ENOTFOUND');
                logger.error('Cannot resolve the API - ENOTFOUND error.');
                isOffline = true;
            }
            // Optionally, you can use setTimeout here to wait before retrying
        } else {
            logger.error(`Error: ${err.message || err.code || 'Unknown error'}`);
        }
    }
}

client.login(process.env.DISCORD_TOKEN)