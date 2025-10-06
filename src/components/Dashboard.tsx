import { Card, Row, Col, Statistic, Spin } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import PriceChart from './PriceChart';
import { PriceHistoryRecord } from '../services/priceHistoryService';

interface GoldPrice {
  goldPriceUsdOz: number;
  exchangeRate: number;
  goldPriceRmbGram: number;
}

interface Investment {
  id: number;
  grams: number;
  pricePerGram: number;
  totalCostRmb: number;
  createdAt: string;
}

interface DashboardProps {
  goldPrice: GoldPrice | null;
  investments: Investment[];
  priceHistory: PriceHistoryRecord[];
}

const Dashboard: React.FC<DashboardProps> = ({ goldPrice, investments, priceHistory }) => {
  const calculateTotals = () => {
    if (!goldPrice || investments.length === 0) {
      return {
        totalGrams: 0,
        totalCost: 0,
        currentValue: 0,
        profit: 0,
        profitRate: 0,
      };
    }

    const totalGrams = investments.reduce((sum, inv) => sum + inv.grams, 0);
    const totalCost = investments.reduce((sum, inv) => sum + inv.totalCostRmb, 0);

    const currentValue = totalGrams * goldPrice.goldPriceRmbGram;
    
    const profit = currentValue - totalCost;
    const profitRate = totalCost > 0 ? (profit / totalCost) * 100 : 0;

    return {
      totalGrams,
      totalCost,
      currentValue,
      profit,
      profitRate,
    };
  };

  const totals = calculateTotals();

  if (!goldPrice) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
          <p style={{ marginTop: '16px' }}>正在加载金价数据...</p>
        </div>
      </Card>
    );
  }

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="当前金价（美元/盎司）"
              value={goldPrice.goldPriceUsdOz}
              precision={2}
              prefix="$"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="当前金价（人民币/克）"
              value={goldPrice.goldPriceRmbGram}
              precision={2}
              prefix="¥"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="汇率（美元→人民币）"
              value={goldPrice.exchangeRate}
              precision={4}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="持有黄金（克）"
              value={totals.totalGrams}
              precision={2}
              suffix="g"
            />
          </Card>
        </Col>
      </Row>

      {investments.length > 0 && (
        <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
          <Col xs={24} sm={12} lg={8}>
            <Card>
              <Statistic
                title="总成本"
                value={totals.totalCost}
                precision={2}
                prefix="¥"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Card>
              <Statistic
                title="当前价值"
                value={totals.currentValue}
                precision={2}
                prefix="¥"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Card>
              <Statistic
                title="收益"
                value={totals.profit}
                precision={2}
                valueStyle={{ color: totals.profit >= 0 ? '#3f8600' : '#cf1322' }}
                prefix={
                  <span>
                    {totals.profit >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                    {' ¥'}
                  </span>
                }
                suffix={
                  <span style={{ fontSize: '14px', marginLeft: '8px' }}>
                    ({totals.profitRate >= 0 ? '+' : ''}{totals.profitRate.toFixed(2)}%)
                  </span>
                }
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* 金价走势图 */}
      <div style={{ marginTop: '16px' }}>
        <PriceChart priceHistory={priceHistory} />
      </div>
    </div>
  );
};

export default Dashboard;
