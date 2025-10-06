import { Card } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PriceHistoryRecord } from '../services/priceHistoryService';

interface PriceChartProps {
  priceHistory: PriceHistoryRecord[];
}

const PriceChart: React.FC<PriceChartProps> = ({ priceHistory }) => {
  // 格式化数据用于图表显示
  const chartData = priceHistory.map(record => ({
    time: new Date(record.timestamp).toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }),
    价格: parseFloat(record.goldPriceRmbGram.toFixed(2)),
  }));

  if (priceHistory.length === 0) {
    return (
      <Card title="金价走势图">
        <div style={{ textAlign: 'center', padding: '50px', color: '#999' }}>
          暂无历史数据，系统将自动记录每次获取的金价数据
        </div>
      </Card>
    );
  }

  return (
    <Card title="金价走势图（人民币/克）">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="time" 
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            domain={['auto', 'auto']}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
            formatter={(value: number) => [`¥${value.toFixed(2)}`, '金价']}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="价格" 
            stroke="#faad14" 
            strokeWidth={2}
            dot={{ fill: '#faad14', r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
      <div style={{ marginTop: '16px', textAlign: 'center', color: '#999', fontSize: '12px' }}>
        共 {priceHistory.length} 条记录 · 最多保存 100 条记录
      </div>
    </Card>
  );
};

export default PriceChart;
