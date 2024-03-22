const Parser  = require("rss-parser");
const { feed_url } = require('../config.json');
const logger = require('../src/app-logger');

module.exports = {
    getLatest: async (callback) => {

        logger.info(`fetching latest feed from: ${feed_url}`)

        const parser = new Parser();
        const feed = await parser.parseURL(feed_url);

        const item = feed.items[0];

        callback(item);
    },

    checkForUpdates: async(callback) => {
        logger.info(`Checking for updates from: ${feed_url}`)

        const parser = new Parser();
        const feed = await parser.parseURL(feed_url);

        const item = feed.items[0];

        const today = new Date();
        const latestPubDate = new Date(item.pubDate);

        if (latestPubDate < today) {
            logger.info(`No new updates from: ${feed_url}`)

            callback();
        } else {
            logger.info(`New updates from: ${feed_url}`)

            callback(item);
        }
    }
}
