import React from 'react';
import { Layout, Card, Statistic, Row, Col, Table, Progress, Badge, Typography, Divider } from 'antd';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
  SafetyOutlined, 
  WarningOutlined, 
  ClockCircleOutlined 
} from '@ant-design/icons';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
     
export default function MiningDashboardApp() {
  // Sample data for charts and tables
  const safetyMetrics = [
    { name: 'Shaft A', oxygen: 19.5, temperature: 28, risk: 'Low' },
    { name: 'Shaft B', oxygen: 18.2, temperature: 32, risk: 'Medium' },
    { name: 'Shaft C', oxygen: 16.8, temperature: 35, risk: 'High' }
  ];

  const riskDistribution = [
    { name: 'Low Risk', value: 65 },
    { name: 'Medium Risk', value: 25 },
    { name: 'High Risk', value: 10 }
  ];

  const COLORS = ['#52c41a', '#faad14', '#f5222d'];

  const emergencyData = [
    { key: '1', type: 'Low Oxygen', location: 'Shaft B', timestamp: '10:45 AM' },
    { key: '2', type: 'High Temperature', location: 'Shaft C', timestamp: '11:20 AM' }
  ];

  const workerColumns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Position', dataIndex: 'position', key: 'position' },
    { title: 'Current Location', dataIndex: 'location', key: 'location' },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status', 
      render: (status) => (
        <Badge 
          status={status === 'Safe' ? 'success' : 'error'} 
          text={status} 
        />
      )
    }
  ];

  const workerData = [
    { key: '1', name: 'John Miner', position: 'Drill Operator', location: 'Shaft A', status: 'Safe' },
    { key: '2', name: 'Sarah Excavator', position: 'Geologist', location: 'Shaft B', status: 'At Risk' }
  ];

  return (
    <Layout 
      style={{ 
        minHeight: '100vh', 
        background: '#f0f2f5',
        fontFamily: "'Inter', sans-serif"
      }}
    >
      <Header 
        style={{ 
          background: 'linear-gradient(to right, #1890ff, #40a9ff)', 
          padding: '0 24px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}
      >
        <Title 
          level={3} 
          style={{ 
            color: 'white', 
            margin: 0,
            fontWeight: 600 
          }}
        >
          <SafetyOutlined style={{ marginRight: 12 }} />
          Mining Safety Monitoring
        </Title>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <WarningOutlined 
            style={{ 
              color: 'yellow', 
              fontSize: '20px', 
              marginRight: 8 
            }} 
          />
          <Text strong style={{ color: 'white' }}>
            2 Active Alerts
          </Text>
        </div>
      </Header>
      
      <Content style={{ margin: '24px 16px', padding: 24, background: 'white', borderRadius: 8 }}>
        <Row gutter={24}>
          <Col span={16}>
            <Card 
              title="Shaft Environmental Conditions" 
              extra={<ClockCircleOutlined />}
              style={{ 
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                borderRadius: 8 
              }}
            >
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={safetyMetrics}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="oxygen" fill="#8884d8" name="Oxygen Level" />
                  <Bar dataKey="temperature" fill="#82ca9d" name="Temperature" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          
          <Col span={8}>
            <Card 
              title="Risk Distribution" 
              style={{ 
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                borderRadius: 8,
                height: '100%'
              }}
            >
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={riskDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {riskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>

        <Divider />

        <Row gutter={24}>
          <Col span={12}>
            <Card 
              title="Emergency Log" 
              style={{ 
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                borderRadius: 8 
              }}
            >
              <Table 
                columns={[
                  { title: 'Type', dataIndex: 'type', key: 'type' },
                  { title: 'Location', dataIndex: 'location', key: 'location' },
                  { title: 'Time', dataIndex: 'timestamp', key: 'timestamp' }
                ]} 
                dataSource={emergencyData} 
                size="small"
              />
            </Card>
          </Col>
          
          <Col span={12}>
            <Card 
              title="Worker Status" 
              style={{ 
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                borderRadius: 8 
              }}
            >
              <Table 
                columns={workerColumns} 
                dataSource={workerData} 
                size="small"
              />
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}