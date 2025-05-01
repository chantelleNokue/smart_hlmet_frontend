"use client"

import React, { useState } from 'react'
import { 
  Tabs, 
  Card, 
  Select, 
  Button, 
  Typography, 
  Row, 
  Col 
} from 'antd'
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts'
import { 
  DownloadOutlined, 
  ReloadOutlined 
} from '@ant-design/icons'

const { Title, Text } = Typography
const { TabPane } = Tabs
const { Option } = Select

// Mock data for analytics (same as previous code)
const mockData = {
  production: {
    current: [
      { name: "Section A", value: 420 },
      { name: "Section B", value: 380 },
      { name: "Section C", value: 290 },
      { name: "Section D", value: 350 },
    ],
    yesterday: [
      { name: "Section A", value: 400 },
      { name: "Section B", value: 390 },
      { name: "Section C", value: 310 },
      { name: "Section D", value: 340 },
    ],
    lastWeek: [
      { name: "Section A", value: 380 },
      { name: "Section B", value: 360 },
      { name: "Section C", value: 280 },
      { name: "Section D", value: 320 },
    ],
    lastMonth: [
      { name: "Section A", value: 350 },
      { name: "Section B", value: 330 },
      { name: "Section C", value: 260 },
      { name: "Section D", value: 300 },
    ],
    lastYear: [
      { name: "Section A", value: 320 },
      { name: "Section B", value: 310 },
      { name: "Section C", value: 240 },
      { name: "Section D", value: 280 },
    ],
  },
  safety: {
    current: [
      { name: "Incidents", value: 2 },
      { name: "Near Misses", value: 8 },
      { name: "Safe Days", value: 45 },
    ],
    yesterday: [
      { name: "Incidents", value: 1 },
      { name: "Near Misses", value: 7 },
      { name: "Safe Days", value: 44 },
    ],
    lastWeek: [
      { name: "Incidents", value: 5 },
      { name: "Near Misses", value: 12 },
      { name: "Safe Days", value: 40 },
    ],
    lastMonth: [
      { name: "Incidents", value: 8 },
      { name: "Near Misses", value: 25 },
      { name: "Safe Days", value: 30 },
    ],
    lastYear: [
      { name: "Incidents", value: 24 },
      { name: "Near Misses", value: 120 },
      { name: "Safe Days", value: 280 },
    ],
  },
  environmental: {
    current: [
      { name: "Jan", value: 24.5 },
      { name: "Feb", value: 25.1 },
      { name: "Mar", value: 24.8 },
      { name: "Apr", value: 24.2 },
      { name: "May", value: 23.9 },
      { name: "Jun", value: 24.3 },
      { name: "Jul", value: 24.7 },
      { name: "Aug", value: 25.2 },
      { name: "Sep", value: 25.5 },
      { name: "Oct", value: 24.9 },
      { name: "Nov", value: 24.6 },
      { name: "Dec", value: 24.4 },
    ],
  },
  equipment: {
    current: [
      { name: "Operational", value: 75 },
      { name: "Maintenance", value: 15 },
      { name: "Breakdown", value: 10 },
    ],
    yesterday: [
      { name: "Operational", value: 78 },
      { name: "Maintenance", value: 12 },
      { name: "Breakdown", value: 10 },
    ],
    lastWeek: [
      { name: "Operational", value: 72 },
      { name: "Maintenance", value: 18 },
      { name: "Breakdown", value: 10 },
    ],
    lastMonth: [
      { name: "Operational", value: 70 },
      { name: "Maintenance", value: 20 },
      { name: "Breakdown", value: 10 },
    ],
    lastYear: [
      { name: "Operational", value: 68 },
      { name: "Maintenance", value: 22 },
      { name: "Breakdown", value: 10 },
    ],
  },
}

// Colors for pie chart
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

export default function Analytics() {
  const [timeFilter, setTimeFilter] = useState("current")
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 1000)
  }

  return (
    <div style={{ padding: '20px' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: '20px' }}>
        {/* <Col>
          <Title level={2}>Analytics</Title>
        </Col> */}
        <Col>
          <Row gutter={[8, 0]} align="middle">
            <Col>
              <Select 
                style={{ width: 180 }} 
                value={timeFilter} 
                onChange={setTimeFilter}
              >
                <Option value="current">Current</Option>
                <Option value="yesterday">Yesterday</Option>
                <Option value="lastWeek">Last Week</Option>
                <Option value="lastMonth">Last Month</Option>
                <Option value="lastYear">Last Year</Option>
              </Select>
            </Col>
            <Col>
              <Button 
                icon={<ReloadOutlined spin={refreshing} />} 
                onClick={handleRefresh}
              />
            </Col>
            <Col>
              <Button icon={<DownloadOutlined />} />
            </Col>
          </Row>
        </Col>
      </Row>

      <Tabs defaultActiveKey="production">
        <TabPane tab="Production" key="production">
          <Card 
            title="Production Output by Section" 
            extra={<Text type="secondary">Daily production output in tons for each mine section</Text>}
          >
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={mockData.production[timeFilter]} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Production (tons)" fill="#1890ff" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabPane>

        <TabPane tab="Safety" key="safety">
          <Card 
            title="Safety Metrics" 
            extra={<Text type="secondary">Safety incidents, near misses, and consecutive safe days</Text>}
          >
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={mockData.safety[timeFilter]} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Count" fill="#52c41a" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabPane>

        <TabPane tab="Environmental" key="environmental">
          <Card 
            title="Average Temperature Trend" 
            extra={<Text type="secondary">Monthly average temperature readings in the mine</Text>}
          >
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={mockData.environmental.current} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[23, 26]} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  name="Temperature (°C)"
                  stroke="#eb2f96"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </TabPane>

        <TabPane tab="Equipment" key="equipment">
          <Card 
            title="Equipment Status" 
            extra={<Text type="secondary">Current status of mining equipment</Text>}
          >
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={mockData.equipment[timeFilter]}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {mockData.equipment[timeFilter].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </TabPane>
      </Tabs>
    </div>
  )
}