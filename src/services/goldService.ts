import axios from 'axios';

export interface GoldPrice {
  goldPriceUsdOz: number;
  exchangeRate: number;
  goldPriceRmbGram: number;
  rateType: 'CNH' | 'CNY'; // 汇率类型
}

export type RateType = 'CNH' | 'CNY';

export const fetchGoldPrice = async (preferredRateType: RateType = 'CNH'): Promise<GoldPrice> => {
  try {
    const goldResponse = await axios.get('https://api.gold-api.com/price/XAU');
    const goldPriceUsdOz = goldResponse.data.price;

    // 尝试从多个API源获取人民币汇率
    let exchangeRate: number;
    let actualRateType: RateType = preferredRateType;
    
    try {
      // 优先使用 exchangerate.host API (支持 CNH 和 CNY)
      const exchangeResponse = await axios.get('https://api.exchangerate.host/latest?base=USD&symbols=CNH,CNY');
      
      if (preferredRateType === 'CNH') {
        // 用户选择离岸人民币
        exchangeRate = exchangeResponse.data.rates.CNH || exchangeResponse.data.rates.CNY;
        actualRateType = exchangeResponse.data.rates.CNH ? 'CNH' : 'CNY';
      } else {
        // 用户选择在岸人民币
        exchangeRate = exchangeResponse.data.rates.CNY;
        actualRateType = 'CNY';
      }
    } catch (err) {
      // 备用方案：使用 exchangerate-api.com (仅支持 CNY)
      const exchangeResponse = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
      exchangeRate = exchangeResponse.data.rates.CNY;
      actualRateType = 'CNY';
      console.log('使用在岸人民币汇率（CNY）作为备用');
    }

    const GRAMS_PER_OUNCE = 31.1035;
    const goldPriceRmbGram = (goldPriceUsdOz / GRAMS_PER_OUNCE) * exchangeRate;

    return {
      goldPriceUsdOz,
      exchangeRate,
      goldPriceRmbGram,
      rateType: actualRateType,
    };
  } catch (error) {
    console.error('获取金价失败，使用默认值:', error);
    const goldPriceUsdOz = 3920.0;
    const exchangeRate = 7.14; // 默认汇率
    const GRAMS_PER_OUNCE = 31.1035;
    const goldPriceRmbGram = (goldPriceUsdOz / GRAMS_PER_OUNCE) * exchangeRate;

    return {
      goldPriceUsdOz,
      exchangeRate,
      goldPriceRmbGram,
      rateType: preferredRateType,
    };
  }
};
