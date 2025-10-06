import { Card, List, Button, Popconfirm, Tag, Empty } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

interface Investment {
  id: number;
  grams: number;
  pricePerGram: number;
  totalCostRmb: number;
  createdAt: string;
}

interface InvestmentListProps {
  investments: Investment[];
  onDelete: (id: number) => void;
}

const InvestmentList: React.FC<InvestmentListProps> = ({ investments, onDelete }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card title="投资记录" style={{ height: '100%' }}>
      {investments.length === 0 ? (
        <Empty description="暂无投资记录" />
      ) : (
        <List
          dataSource={investments}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Popconfirm
                  title="确认删除"
                  description="确定要删除这条投资记录吗？"
                  onConfirm={() => onDelete(item.id)}
                  okText="确认"
                  cancelText="取消"
                >
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    size="small"
                  >
                    删除
                  </Button>
                </Popconfirm>,
              ]}
            >
              <List.Item.Meta
                title={
                  <div>
                    <Tag color="gold">{item.grams} 克</Tag>
                    <Tag color="blue">买入价: ¥{item.pricePerGram.toFixed(2)}/克</Tag>
                    <Tag color="green">总成本: ¥{item.totalCostRmb.toFixed(2)}</Tag>
                  </div>
                }
                description={formatDate(item.createdAt)}
              />
            </List.Item>
          )}
          style={{ maxHeight: '400px', overflowY: 'auto' }}
        />
      )}
    </Card>
  );
};

export default InvestmentList;
