import mongoose, { Schema } from "mongoose";

const CryptocurrencySchema = new Schema({
    id: {
        type: String,
        description: "Unique identifier for the cryptocurrency, e.g., 'bitcoin'.",
        index: true,
        required: true,
    },
    symbol: {
        type: String,
        description: "Short symbol for the cryptocurrency, e.g., 'btc'.",
        required: true,
        unique: true,
        minlength: 1,
        maxlength: 10,
    },
    name: {
        type: String,
        description: "Full name of the cryptocurrency, e.g., 'Bitcoin'.",
        required: true,
    },
    image: {
        url: {
            type: String,
            description: "URL of the cryptocurrency image.",
            validate: {
                validator: function (v) {
                    return /^(ftp|http|https):\/\/[^ "]+$/.test(v);  // Regular expression for URL validation
                },
                message: '{VALUE} is not a valid URL!'
            },
        }
    },
    current_price: {
        value: {
            type: Number,
            description: "Current price of the cryptocurrency in USD.",
            required: true,
            min: 0
        },
        currency: {
            type: String,
            description: "Currency of the displayed price, default is 'USD'.",
            default: "USD"
        }
    },
    market_data: {
        market_cap: {
            value: {
                type: Number,
                description: "Market capitalization in USD.",
                required: true,
                min: 0
            }
        },
        circulating_supply: {
            type: Number,
            description: "Current number of tokens in circulation.",
            required: true,
            min: 0
        }
    },
    price_change: {
        value_24h: {
            type: Number,
            description: "Price change in the last 24 hours in USD."
        }
    },
    historical_data: {
        all_time_high: {
            price: {
                type: Number,
                description: "All-time high price in USD.",
                min: 0
            }
        },
        all_time_low: {
            price: {
                type: Number,
                description: "All-time low price in USD.",
                min: 0
            }
        }
    },
    price_range_24h: {
        high: {
            type: Number,
            description: "Highest price in the last 24 hours in USD.",
            min: 0
        },
        low: {
            type: Number,
            description: "Lowest price in the last 24 hours in USD.",
            min: 0
        }
    },
    trend: {
        is_ath: {
            type: Boolean,
            description: "True if the current price is at an all-time high."
        },
        is_bullish: {
            type: Boolean,
            description: "True if the price trend is upward (positive 24-hour change)."
        }
    },
    analytics: {
        moving_average: {
            d50: {
                type: Number,
                description: "50-day moving average price in USD.",
                min: 0
            }
        }
    },
    conversion: {
        usd: {
            type: Number,
            description: "Price in USD."
        }
    },
    security: {
        data_hash: {
            type: String,
            description: "SHA-256 hash of the data for integrity verification.",
        },
        version: {
            type: String,
            description: "Schema version for tracking changes.",
            default: "1.0.0"
        }
    },
    last_updated: {
        type: Date,
        description: "Timestamp of the last data update.",
        required: true
    }
}, { timestamps: true });

CryptocurrencySchema.methods.populateRelatedData = async function () {

    return this.populate('market_data').execPopulate();
};

CryptocurrencySchema.pre('save', function (next) {

    if (this.isModified('price_change.value_24h')) {
        this.trend.is_bullish = this.price_change.value_24h > 0;
    }
    next();
});

const Cryptocurrency = mongoose.model('Cryptocurrency', CryptocurrencySchema);

export default Cryptocurrency;
