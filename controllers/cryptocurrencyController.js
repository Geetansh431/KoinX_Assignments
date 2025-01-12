import axios from 'axios';
import fetchCryptoData from "../utils/fetchCryptoData.js";
import Cryptocurrency from '../models/cryptocurrency.model.js';
import cron from 'node-cron';
import Price from '../models/price.model.js';
import calculateStandardDeviation from '../utils/calculateStandardDeviation.js';

const COINS = ['bitcoin', 'matic-network', 'ethereum'];

const fetchCryptocurrencyData = async (req, res) => {
    try {
        console.log('Fetching Cryptocurrency Data...');
        const cryptocurrencies = ['bitcoin', 'matic-network', 'ethereum'];

        const data = await fetchCryptoData(cryptocurrencies);

        if (!Array.isArray(data)) {
            throw new Error('Fetched data is not an array.');
        }
        console.log(data);

        for (const crypto of data) {
            const existingCrypto = await Cryptocurrency.findOne({ id: crypto.id });

            if (existingCrypto) {
                existingCrypto.current_price.value = crypto.current_price.value;
                existingCrypto.market_data.market_cap.value = crypto.market_data.market_cap.value;
                existingCrypto.market_data.circulating_supply = crypto.market_data.circulating_supply;
                existingCrypto.price_change.value_24h = crypto.price_change.value_24h;
                existingCrypto.historical_data.all_time_high.price = crypto.historical_data.all_time_high.price;
                existingCrypto.historical_data.all_time_low.price = crypto.historical_data.all_time_low.price;
                existingCrypto.price_range_24h.high = crypto.price_range_24h.high;
                existingCrypto.price_range_24h.low = crypto.price_range_24h.low;
                existingCrypto.trend.is_ath = crypto.trend.is_ath;
                existingCrypto.trend.is_bullish = crypto.trend.is_bullish;
                existingCrypto.last_updated = new Date(crypto.last_updated);
                existingCrypto.security.data_hash = crypto.security.data_hash;
                existingCrypto.image.url = crypto.image.url;

                await existingCrypto.save();
            } else {
                const newCrypto = new Cryptocurrency({
                    id: crypto.id,
                    symbol: crypto.symbol,
                    name: crypto.name,
                    image: crypto.image,
                    current_price: crypto.current_price,
                    market_data: crypto.market_data,
                    price_change: crypto.price_change,
                    historical_data: crypto.historical_data,
                    price_range_24h: crypto.price_range_24h,
                    trend: crypto.trend,
                    analytics: crypto.analytics,
                    conversion: crypto.conversion,
                    security: crypto.security,
                    last_updated: new Date(crypto.last_updated),
                });

                await newCrypto.save();
            }

            const newPrice = new Price({
                coin: crypto.id,
                price: crypto.current_price.value,
                timestamp: new Date(crypto.last_updated),
            });

            await newPrice.save();
        }

        console.log("Cryptocurrency data and prices updated successfully.");
        res.status(200).send({ message: "data updated successfully" })
    } catch (error) {
        console.error('Error fetching cryptocurrency data:', error);
        res.status(500).send({ error: "error updating data" })
    }
};

cron.schedule('0 */2 * * *', async () => {
    console.log('Cron job started: Fetching cryptocurrency data...');
    await fetchCryptocurrencyData();
});

const getCryptoStats = async (req, res) => {
    try {
        const { coin } = req.query;

        if (!COINS.includes(coin)) {
            return res.status(400).send('Invalid coin. Valid options are bitcoin, matic-network, ethereum.');
        }

        const cryptocurrency = await Cryptocurrency.findOne({ id: coin });

        if (!cryptocurrency) {
            return res.status(404).send(`Cryptocurrency data for ${coin} not found.`);
        }

        const response = {
            price: cryptocurrency.current_price.value,
            marketCap: cryptocurrency.market_data.market_cap.value,
            "24hChange": cryptocurrency.price_change.value_24h,
        };

        res.status(200).send(response);
    } catch (error) {
        console.error('Error fetching cryptocurrency stats:', error);
        res.status(500).send(`Error fetching cryptocurrency stats.${error}`);
    }
};

const getDeviation = async (req, res) => {
    try {
        const { coin } = req.query;

        if (!coin) {
            return res.status(400).json({ error: "Please provide a valid coin parameter." });
        }

        const prices = await Price.find({ coin }).sort({ timestamp: -1 });

        if (prices.length === 0) {
            return res.status(404).json({ error: "No records found for the requested coin." });
        }

        const priceValues = prices.map((record) => record.price);

        const deviation = calculateStandardDeviation(priceValues);

        res.json({ deviation: deviation.toFixed(2) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error." });
    }
};

export { fetchCryptocurrencyData, getCryptoStats, getDeviation };
