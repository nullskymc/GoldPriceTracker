import { useState, useEffect } from 'react';
import { Layout, message } from 'antd';
import Dashboard from './components/Dashboard';
import InvestmentForm from './components/InvestmentForm';
import InvestmentList from './components/InvestmentList';
import { fetchGoldPrice, GoldPrice } from './services/goldService';
import { getInvestments, saveInvestment, deleteInvestment, Investment } from './services/storageService';
import './App.css';

const { Header, Content } = Layout;

function App() {
  const [goldPrice, setGoldPrice] = useState<GoldPrice | null>(null);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(false);

  const loadGoldPrice = async () => {
    try {
      const price = await fetchGoldPrice();
      setGoldPrice(price);
    } catch (error) {
      message.error('获取金价失败');
      console.error('Error fetching gold price:', error);
    }
  };

  const loadInvestments = () => {
    const data = getInvestments();
    setInvestments(data);
  };

  const handleAddInvestment = (grams: number, pricePerGram: number) => {
    setLoading(true);
    try {
      saveInvestment(grams, pricePerGram);
      message.success('投资记录添加成功');
      loadInvestments();
    } catch (error) {
      message.error('添加投资记录失败');
      console.error('Error adding investment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInvestment = (id: number) => {
    try {
      deleteInvestment(id);
      message.success('删除成功');
      loadInvestments();
    } catch (error) {
      message.error('删除投资记录失败');
      console.error('Error deleting investment:', error);
    }
  };

  useEffect(() => {
    loadGoldPrice();
    loadInvestments();
    
    const interval = setInterval(() => {
      loadGoldPrice();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        background: '#001529', 
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center'
      }}>
        <h1 style={{ color: 'white', margin: 0, fontSize: '24px' }}>
          黄金投资追踪器
        </h1>
      </Header>
      <Content style={{ padding: '24px', background: '#f0f2f5' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Dashboard 
            goldPrice={goldPrice} 
            investments={investments}
          />
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '24px',
            marginTop: '24px'
          }}>
            <InvestmentForm 
              onSubmit={handleAddInvestment}
              loading={loading}
              currentGoldPrice={goldPrice?.goldPriceRmbGram}
            />
            <InvestmentList 
              investments={investments}
              onDelete={handleDeleteInvestment}
            />
          </div>
        </div>
      </Content>
    </Layout>
  );
}

export default App;
