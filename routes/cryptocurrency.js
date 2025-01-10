import express from 'express';
import fetchCryptocurrencyData from '../controllers/cryptocurrencyController.js'; // Adjust path if needed

const router = express.Router();

router.get('/update-crypto-data',fetchCryptocurrencyData );

export default router;
