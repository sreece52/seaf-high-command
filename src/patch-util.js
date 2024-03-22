const Parser  = require("rss-parser");
const { feed_url } = require('../config.json');

module.exports = {
    getLatest: async (callback) => {
        const parser = new Parser();
        const feed = await parser.parseURL(feed_url);

        const item = feed.items[0];

        callback(item);
    },

    checkForUpdates: async(callback) => {
        const parser = new Parser();
        const feed = await parser.parseURL(feed_url);

        const item = feed.items[0];

        const today = new Date();
        const latestPubDate = new Date(item.pubDate);

        if (latestPubDate < today) {
            callback();
        } else {
            callback(item);
        }
    }
}
