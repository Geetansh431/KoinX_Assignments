import express from 'express';
import { fetchCryptocurrencyData, getDeviation, getCryptoStats } from '../controllers/cryptocurrencyController.js';

const router = express.Router();

router.get('/update-crypto-data', fetchCryptocurrencyData);
router.get('/stats', getCryptoStats)
router.get("/deviation", getDeviation);


export default router;