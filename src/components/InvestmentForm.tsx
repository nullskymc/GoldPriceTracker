import { Card, Form, InputNumber, Button, Statistic } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';

interface InvestmentFormProps {
  onSubmit: (grams: number, pricePerGram: number) => void;
  loading: boolean;
  currentGoldPrice?: number;
}

const InvestmentForm: React.FC<InvestmentFormProps> = ({ onSubmit, loading, currentGoldPrice }) => {
  const [form] = Form.useForm();
  const [grams, setGrams] = useState<number>(0);
  const [pricePerGram, setPricePerGram] = useState<number>(0);

  const totalCost = grams * pricePerGram;

  const handleSubmit = (values: { grams: number; pricePerGram: number }) => {
    onSubmit(values.grams, values.pricePerGram);
    form.resetFields();
    setGrams(0);
    setPricePerGram(0);
  };

  const handleGramsChange = (value: number | null) => {
    setGrams(value || 0);
  };

  const handlePriceChange = (value: number | null) => {
    setPricePerGram(value || 0);
  };

  const useCurrent Price = () => {
    if (currentGoldPrice) {
      form.setFieldValue('pricePerGram', currentGoldPrice);
      setPricePerGram(currentGoldPrice);
    }
  };

  return (
    <Card title="添加投资记录" style={{ height: '100%' }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Form.Item
          label="黄金克数"
          name="grams"
          rules={[
            { required: true, message: '请输入黄金克数' },
            { type: 'number', min: 0.01, message: '克数必须大于0' },
          ]}
        >
          <InputNumber
            style={{ width: '100%' }}
            placeholder="请输入黄金克数"
            min={0.01}
            step={0.01}
            precision={2}
            addonAfter="克"
            onChange={handleGramsChange}
          />
        </Form.Item>

        <Form.Item
          label={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>买入价格（每克）</span>
              {currentGoldPrice && (
                <Button 
                  type="link" 
                  size="small" 
                  onClick={useCurrentPrice}
                  style={{ padding: 0, height: 'auto' }}
                >
                  使用当前金价 ¥{currentGoldPrice.toFixed(2)}
                </Button>
              )}
            </div>
          }
          name="pricePerGram"
          rules={[
            { required: true, message: '请输入每克价格' },
            { type: 'number', min: 0.01, message: '价格必须大于0' },
          ]}
        >
          <InputNumber
            style={{ width: '100%' }}
            placeholder="请输入每克价格"
            min={0.01}
            step={0.01}
            precision={2}
            addonBefore="¥"
            addonAfter="/克"
            onChange={handlePriceChange}
          />
        </Form.Item>

        {totalCost > 0 && (
          <Card size="small" style={{ marginBottom: '16px', backgroundColor: '#f5f5f5' }}>
            <Statistic
              title="总成本"
              value={totalCost}
              precision={2}
              prefix="¥"
              valueStyle={{ fontSize: '20px' }}
            />
          </Card>
        )}

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            icon={<PlusOutlined />}
            loading={loading}
            block
            size="large"
          >
            添加投资记录
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default InvestmentForm;
