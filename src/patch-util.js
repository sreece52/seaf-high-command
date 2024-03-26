const Parser  = require("rss-parser");
const { feed_url } = require('../config.json');
const logger = require('../src/app-logger');
const child = logger.child({service: "patch_util", feed_url: feed_url})

module.exports = {
    getLatest: async (callback) => {

        child.info(`fetching latest feed`)

        const parser = new Parser();
        const feed = await parser.parseURL(feed_url);

        const item = feed.items[0];

        callback(item);
    },

    checkForUpdates: async(callback) => {
        child.info(`Checking for updates`);

        const parser = new Parser();
        const feed = await parser.parseURL(feed_url);

        const item = feed.items[0];

        const today = new Date();
        const latestPubDate = new Date(item.pubDate);

        if (latestPubDate < today) {
            child.info(`No new updates`);

            callback();
        } else {
            child.info(`New updates found`);

            callback(item);
        }
    }
}
