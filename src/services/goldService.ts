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
      // 优先使用 fawazahmed0 currency API (免费且支持 CNH 和 CNY)
      const exchangeResponse = await axios.get('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json');
      
      if (preferredRateType === 'CNH') {
        // 用户选择离岸人民币
        exchangeRate = exchangeResponse.data.usd.cnh;
        actualRateType = 'CNH';
        console.log(`✓ 成功获取离岸人民币汇率 (CNH): ${exchangeRate}`);
      } else {
        // 用户选择在岸人民币
        exchangeRate = exchangeResponse.data.usd.cny;
        actualRateType = 'CNY';
        console.log(`✓ 成功获取在岸人民币汇率 (CNY): ${exchangeRate}`);
      }
      
      if (!exchangeRate || exchangeRate <= 0) {
        throw new Error('Invalid exchange rate');
      }
    } catch (err) {
      console.warn('主API失败，尝试备用API:', err);
      // 备用方案1：使用 open.er-api.com (仅支持 CNY)
      try {
        const exchangeResponse = await axios.get('https://open.er-api.com/v6/latest/USD');
        exchangeRate = exchangeResponse.data.rates.CNY;
        actualRateType = 'CNY';
        console.warn('⚠ 主API失败，使用在岸人民币汇率（CNY）作为备用');
      } catch (err2) {
        // 备用方案2：使用 exchangerate-api.com (仅支持 CNY)
        const exchangeResponse = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
        exchangeRate = exchangeResponse.data.rates.CNY;
        actualRateType = 'CNY';
        console.warn('⚠ 备用API也失败，使用在岸人民币汇率（CNY）作为最终备用');
      }
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
