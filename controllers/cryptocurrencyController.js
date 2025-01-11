import axios from 'axios';
import fetchCryptoData from "../utils/fetchCryptoData.js";
import Cryptocurrency from '../models/Cryptocurrency.model.js';
import cron from 'node-cron';
import Price from '../models/price.js';
const COINGECKO_API_BASE_URL = 'https://api.coingecko.com/api/v3/coins/markets';

const COINS = ['bitcoin', 'matic-network', 'ethereum'];

// const fetchCryptocurrencyData = async (req, res) => {
//     try {

//         console.log('Fetching Cryptocurrency Data...');

//         const cryptocurrencies = ['bitcoin', 'matic-network', 'ethereum'];

//         const data = await fetchCryptoData(cryptocurrencies);

//         for (const crypto of data) {
//             const existingCrypto = await Cryptocurrency.findOne({ id: crypto.id });

//             if (existingCrypto) {
//                 // If cryptocurrency already exists, update it
//                 existingCrypto.current_price.value = crypto.current_price.value;
//                 existingCrypto.market_data.market_cap.value = crypto.market_data.market_cap.value;
//                 existingCrypto.market_data.circulating_supply = crypto.market_data.circulating_supply;
//                 existingCrypto.price_change.value_24h = crypto.price_change.value_24h;
//                 existingCrypto.historical_data.all_time_high.price = crypto.historical_data.all_time_high.price;
//                 existingCrypto.historical_data.all_time_low.price = crypto.historical_data.all_time_low.price;
//                 existingCrypto.price_range_24h.high = crypto.price_range_24h.high;
//                 existingCrypto.price_range_24h.low = crypto.price_range_24h.low;
//                 existingCrypto.trend.is_ath = crypto.trend.is_ath;
//                 existingCrypto.trend.is_bullish = crypto.trend.is_bullish;
//                 existingCrypto.last_updated = new Date(crypto.last_updated);

//                 existingCrypto.security.data_hash = crypto.security.data_hash;


//                 existingCrypto.image.url = crypto.image.url;

//                 await existingCrypto.save();
//             } else {
//                 // If cryptocurrency does not exist, create a new document
//                 const newCrypto = new Cryptocurrency({
//                     id: crypto.id,
//                     symbol: crypto.symbol,
//                     name: crypto.name,
//                     image: crypto.image,
//                     current_price: crypto.current_price,
//                     market_data: crypto.market_data,
//                     price_change: crypto.price_change,
//                     historical_data: crypto.historical_data,
//                     price_range_24h: crypto.price_range_24h,
//                     trend: crypto.trend,
//                     analytics: crypto.analytics,
//                     conversion: crypto.conversion,
//                     security: crypto.security,
//                     last_updated: new Date(crypto.last_updated),
//                 });

//                 await newCrypto.save();
//             }
//         }
//         res.status(200).send({ data });
//         console.log("done");
//     } catch (error) {
//         console.error('Error fetching cryptocurrency data:', error);
//         res.status(500).send(`Error updating cryptocurrency data.${error}`);
//     }
// };
// const fetchCryptocurrencyData = async (req, res) => {
//     try {
//         console.log('Fetching Cryptocurrency Data...');

//         const cryptocurrencies = ['bitcoin', 'matic-network', 'ethereum'];

//         const data = await fetchCryptoData(cryptocurrencies);

//         for (const crypto of data) {
//             const existingCrypto = await Cryptocurrency.findOne({ id: crypto.id });

//             if (existingCrypto) {
//                 // Update the existing cryptocurrency document
//                 existingCrypto.current_price.value = crypto.current_price.value;
//                 existingCrypto.market_data.market_cap.value = crypto.market_data.market_cap.value;
//                 existingCrypto.market_data.circulating_supply = crypto.market_data.circulating_supply;
//                 existingCrypto.price_change.value_24h = crypto.price_change.value_24h;
//                 existingCrypto.historical_data.all_time_high.price = crypto.historical_data.all_time_high.price;
//                 existingCrypto.historical_data.all_time_low.price = crypto.historical_data.all_time_low.price;
//                 existingCrypto.price_range_24h.high = crypto.price_range_24h.high;
//                 existingCrypto.price_range_24h.low = crypto.price_range_24h.low;
//                 existingCrypto.trend.is_ath = crypto.trend.is_ath;
//                 existingCrypto.trend.is_bullish = crypto.trend.is_bullish;
//                 existingCrypto.last_updated = new Date(crypto.last_updated);
//                 existingCrypto.security.data_hash = crypto.security.data_hash;
//                 existingCrypto.image.url = crypto.image.url;

//                 await existingCrypto.save();
//             } else {
//                 // Create a new cryptocurrency document
//                 const newCrypto = new Cryptocurrency({
//                     id: crypto.id,
//                     symbol: crypto.symbol,
//                     name: crypto.name,
//                     image: crypto.image,
//                     current_price: crypto.current_price,
//                     market_data: crypto.market_data,
//                     price_change: crypto.price_change,
//                     historical_data: crypto.historical_data,
//                     price_range_24h: crypto.price_range_24h,
//                     trend: crypto.trend,
//                     analytics: crypto.analytics,
//                     conversion: crypto.conversion,
//                     security: crypto.security,
//                     last_updated: new Date(crypto.last_updated),
//                 });

//                 await newCrypto.save();
//             }

//             // Save the price to the `prices` schema
//             const newPrice = new Price({
//                 coin: crypto.id, // Use the cryptocurrency's ID (e.g., bitcoin, ethereum)
//                 price: crypto.current_price.value, // Current price
//                 timestamp: new Date(crypto.last_updated), // Timestamp of the price
//             });

//             await newPrice.save();
//         }

//         res.status(200).send({ data });
//         console.log("Cryptocurrency data and prices updated successfully.");
//     } catch (error) {
//         console.error('Error fetching cryptocurrency data:', error);
//         res.status(500).send(`Error updating cryptocurrency data.${error}`);
//     }
// };

const fetchCryptocurrencyData = async (req, res) => {
    try {
        console.log('Fetching Cryptocurrency Data...');

        const cryptocurrencies = ['bitcoin', 'matic-network', 'ethereum'];

        const data = await fetchCryptoData(cryptocurrencies);

        // Check if data is an array
        if (!Array.isArray(data)) {
            throw new Error('Fetched data is not an array.');
        }

        for (const crypto of data) {
            const existingCrypto = await Cryptocurrency.findOne({ id: crypto.id });

            if (existingCrypto) {
                // Update the existing cryptocurrency document
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
                // Create a new cryptocurrency document
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

            // Save the price to the `prices` schema
            const newPrice = new Price({
                coin: crypto.id, // Use the cryptocurrency's ID (e.g., bitcoin, ethereum)
                price: crypto.current_price.value, // Current price
                timestamp: new Date(crypto.last_updated), // Timestamp of the price
            });

            await newPrice.save();
        }

        res.status(200).send({ data });
        console.log("Cryptocurrency data and prices updated successfully.");
    } catch (error) {
        console.error('Error fetching cryptocurrency data:', error);
        res.status(500).send(`Error updating cryptocurrency data.${error}`);
    }
};


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


export { fetchCryptocurrencyData, getCryptoStats };
