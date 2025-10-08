export interface Investment {
  id: number;
  grams: number;
  pricePerGram: number;
  totalCostRmb: number;
  createdAt: string;
}

export type RateType = 'CNH' | 'CNY';

const STORAGE_KEY = 'gold-investments';
const RATE_TYPE_KEY = 'gold-rate-type';

// 汇率类型相关
export const getRateType = (): RateType => {
  try {
    const rateType = localStorage.getItem(RATE_TYPE_KEY);
    return (rateType === 'CNY' || rateType === 'CNH') ? rateType : 'CNH';
  } catch (error) {
    console.error('读取汇率类型失败:', error);
    return 'CNH';
  }
};

export const saveRateType = (rateType: RateType): void => {
  try {
    localStorage.setItem(RATE_TYPE_KEY, rateType);
  } catch (error) {
    console.error('保存汇率类型失败:', error);
  }
};

// 投资记录相关

export const getInvestments = (): Investment[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('读取投资记录失败:', error);
    return [];
  }
};

export const saveInvestment = (grams: number, pricePerGram: number): Investment => {
  const investments = getInvestments();
  const totalCostRmb = grams * pricePerGram;
  
  const newInvestment: Investment = {
    id: Date.now(),
    grams,
    pricePerGram,
    totalCostRmb,
    createdAt: new Date().toISOString(),
  };

  investments.push(newInvestment);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(investments));
  
  return newInvestment;
};

export const deleteInvestment = (id: number): void => {
  const investments = getInvestments();
  const filtered = investments.filter(inv => inv.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

export const clearAllInvestments = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
