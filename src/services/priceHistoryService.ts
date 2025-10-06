export interface PriceHistoryRecord {
  timestamp: string;
  goldPriceRmbGram: number;
  goldPriceUsdOz: number;
  exchangeRate: number;
}

const STORAGE_KEY = 'gold-price-history';
const MAX_RECORDS = 100; // 最多保存100条记录

export const getPriceHistory = (): PriceHistoryRecord[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('读取价格历史失败:', error);
    return [];
  }
};

export const addPriceRecord = (
  goldPriceRmbGram: number,
  goldPriceUsdOz: number,
  exchangeRate: number
): void => {
  try {
    const history = getPriceHistory();
    const newRecord: PriceHistoryRecord = {
      timestamp: new Date().toISOString(),
      goldPriceRmbGram,
      goldPriceUsdOz,
      exchangeRate,
    };

    // 添加新记录
    history.push(newRecord);

    // 如果超过最大记录数，删除最旧的记录
    if (history.length > MAX_RECORDS) {
      history.shift();
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('保存价格历史失败:', error);
  }
};

export const clearPriceHistory = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
