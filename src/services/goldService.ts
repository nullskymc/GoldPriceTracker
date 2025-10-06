import axios from 'axios';

export interface GoldPrice {
  goldPriceUsdOz: number;
  exchangeRate: number;
  goldPriceRmbGram: number;
}

export const fetchGoldPrice = async (): Promise<GoldPrice> => {
  try {
    const goldResponse = await axios.get('https://api.gold-api.com/price/XAU');
    const goldPriceUsdOz = goldResponse.data.price;

    const exchangeResponse = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
    const exchangeRate = exchangeResponse.data.rates.CNY;

    const GRAMS_PER_OUNCE = 31.1035;
    const goldPriceRmbGram = (goldPriceUsdOz / GRAMS_PER_OUNCE) * exchangeRate;

    return {
      goldPriceUsdOz,
      exchangeRate,
      goldPriceRmbGram,
    };
  } catch (error) {
    console.error('获取金价失败，使用默认值:', error);
    const goldPriceUsdOz = 3920.0;
    const exchangeRate = 7.12;
    const GRAMS_PER_OUNCE = 31.1035;
    const goldPriceRmbGram = (goldPriceUsdOz / GRAMS_PER_OUNCE) * exchangeRate;

    return {
      goldPriceUsdOz,
      exchangeRate,
      goldPriceRmbGram,
    };
  }
};
