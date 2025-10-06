export interface Investment {
  id: number;
  grams: number;
  pricePerGram: number;
  totalCostRmb: number;
  createdAt: string;
}

const STORAGE_KEY = 'gold-investments';

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
