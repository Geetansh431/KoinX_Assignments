import axios from 'axios';
import Cryptocurrency from '../models/Cryptocurrency.model.js';

const fetchCryptoData = async (coinGeckoIds) => {
    try {
        
        const ids = Array.isArray(coinGeckoIds) ? coinGeckoIds : [coinGeckoIds];
        const response = await axios.get(`https://api.coingecko.com/api/v3/coins/markets`, {
            params: {
                vs_currency: 'usd',
                ids: ids.join(',')
            }
        });

        const cryptoData = response.data.map(data => ({
            id: data.id,
            symbol: data.symbol,
            name: data.name,
            image: { url: data.image.large },
            current_price: { value: data.current_price },
            market_data: {
                market_cap: { value: data.market_cap },
                circulating_supply: data.circulating_supply,
            },
            price_change: { value_24h: data.price_change_24h },
            historical_data: {
                all_time_high: { price: data.ath },
                all_time_low: { price: data.atl },
            },
            price_range_24h: {
                high: data.high_24h,
                low: data.low_24h,
            },
            trend: {
                is_ath: data.current_price === data.ath,
                is_bullish: data.price_change_24h > 0,
            },
            analytics: { moving_average: { d50: data.moving_average_50?.usd || 0 } },
            conversion: { usd: data.current_price },
            security: { data_hash: '', version: '1.0.0' },
            last_updated: new Date(data.last_updated),
        }));

        return cryptoData;

    } catch (error) {
        console.error(`Error fetching data:`, error);
        return null;
    }
};

export default fetchCryptoData;
