import { Card, Row, Col, Statistic, Spin, Drawer, Radio, Button, Space } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, SettingOutlined } from '@ant-design/icons';
import { useState } from 'react';
import PriceChart from './PriceChart';
import { PriceHistoryRecord } from '../services/priceHistoryService';
import { RateType } from '../services/storageService';

interface GoldPrice {
  goldPriceUsdOz: number;
  exchangeRate: number;
  goldPriceRmbGram: number;
  rateType: 'CNH' | 'CNY';
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
  rateType: RateType;
  onRateTypeChange: (rateType: RateType) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  goldPrice, 
  investments, 
  priceHistory,
  rateType,
  onRateTypeChange 
}) => {
  const [drawerVisible, setDrawerVisible] = useState(false);
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Statistic
                title={`汇率（USD→${goldPrice.rateType}${goldPrice.rateType === 'CNH' ? ' 离岸' : ' 在岸'}）`}
                value={goldPrice.exchangeRate}
                precision={4}
              />
              <Button 
                type="text" 
                icon={<SettingOutlined />} 
                onClick={() => setDrawerVisible(true)}
                style={{ marginTop: -8 }}
              />
            </div>
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

      {/* 汇率设置抽屉 */}
      <Drawer
        title="汇率设置"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={360}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <h3 style={{ marginBottom: 16 }}>选择汇率类型</h3>
            <Radio.Group 
              value={rateType} 
              onChange={(e) => {
                onRateTypeChange(e.target.value);
                setDrawerVisible(false);
              }}
              style={{ width: '100%' }}
            >
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <Radio value="CNH" style={{ width: '100%', padding: '12px', border: '1px solid #d9d9d9', borderRadius: '4px' }}>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '16px' }}>离岸人民币 (CNH)</div>
                    <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
                      境外交易的人民币汇率，市场化程度更高
                    </div>
                  </div>
                </Radio>
                <Radio value="CNY" style={{ width: '100%', padding: '12px', border: '1px solid #d9d9d9', borderRadius: '4px' }}>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '16px' }}>在岸人民币 (CNY)</div>
                    <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
                      境内交易的人民币汇率，受央行管理
                    </div>
                  </div>
                </Radio>
              </Space>
            </Radio.Group>
          </div>
          
          <div style={{ padding: '16px', background: '#f5f5f5', borderRadius: '4px' }}>
            <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
              <strong>提示：</strong>切换汇率类型后，系统会自动刷新金价数据。离岸人民币汇率通常用于国际交易，而在岸人民币汇率用于境内交易。
            </p>
          </div>
        </Space>
      </Drawer>
    </div>
  );
};

export default Dashboard;
