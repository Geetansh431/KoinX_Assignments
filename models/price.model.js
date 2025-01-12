import mongoose from "mongoose";

const PriceSchema = new mongoose.Schema({
  coin: { type: String, required: true },
  price: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("Price", PriceSchema);
