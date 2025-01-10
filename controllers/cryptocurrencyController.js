import axios from 'axios';
import fetchCryptoData from "../utils/fetchCryptoData.js";
import Cryptocurrency from '../models/Cryptocurrency.model.js';
import cron from 'node-cron';

// CoinGecko API base URL
const COINGECKO_API_BASE_URL = 'https://api.coingecko.com/api/v3/coins/markets';

// CoinGecko IDs for Bitcoin, Matic, and Ethereum
const COINS = ['bitcoin', 'matic-network', 'ethereum'];

// Function to fetch cryptocurrency data
const fetchCryptocurrencyData = async (req, res) => {
    try {

        console.log('Fetching Cryptocurrency Data...');

        const cryptocurrencies = ['bitcoin', 'matic-network', 'ethereum'];

        const data = await fetchCryptoData(cryptocurrencies);

        for (const crypto of data) {
            const existingCrypto = await Cryptocurrency.findOne({ id: crypto.id });

            if (existingCrypto) {
                // If cryptocurrency already exists, update it
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
                // If cryptocurrency does not exist, create a new document
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
        }
        res.status(200).send({ data });
        console.log("done");
    } catch (error) {
        console.error('Error fetching cryptocurrency data:', error);
        res.status(500).send(`Error updating cryptocurrency data.${error}`);
    }
};

export default fetchCryptocurrencyData;
