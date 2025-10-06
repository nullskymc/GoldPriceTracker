import axios from 'axios';

interface GoldPriceResponse {
  price: number;
  symbol: string;
  name: string;
  updatedAt: string;
}

interface ExchangeRateResponse {
  rates: {
    CNY: number;
  };
}

export const getGoldPrice = async (): Promise<{ goldPriceUsdOz: number; exchangeRate: number }> => {
  try {
    const goldResponse = await axios.get<GoldPriceResponse>('https://api.gold-api.com/price/XAU');
    const goldPriceUsdOz = goldResponse.data.price;

    const exchangeResponse = await axios.get<ExchangeRateResponse>(
      'https://api.exchangerate-api.com/v4/latest/USD'
    );
    const exchangeRate = exchangeResponse.data.rates.CNY;

    return {
      goldPriceUsdOz,
      exchangeRate,
    };
  } catch (error) {
    console.error('Error fetching gold price:', error);
    return {
      goldPriceUsdOz: 3920.0,
      exchangeRate: 7.12,
    };
  }
};
