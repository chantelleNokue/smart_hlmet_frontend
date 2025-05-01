
import { useState, useEffect } from "react"
import { DatePicker, Select, Button, Card, Tabs, Typography, Space, Table, Tag, Spin, Empty } from "antd"
import { DownloadOutlined, ReloadOutlined } from "@ant-design/icons"
import { generateHistoricalData } from "../../data/mock-data"
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts'

const { Title } = Typography
const { RangePicker } = DatePicker
const { Option } = Select

// Placeholder Chart Components
// const OxygenLevelChart = ({ data }) => (
//   <div style={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//     Oxygen Level Chart Placeholder
//   </div>
// )

// const TemperatureChart = ({ data }) => (
//   <div style={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//     Temperature Chart Placeholder
//   </div>
// )

const AlertsChart = ({ data }) => (
  <div style={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    Alerts Chart Placeholder
  </div>
)

export default function HistoricalData() {
  const [dateRange, setDateRange] = useState(null)
  const [minerId, setMinerId] = useState(null)
  const [dataType, setDataType] = useState("oxygen")
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const [activeTab, setActiveTab] = useState("charts")

  useEffect(() => {
    // Load initial data
    handleFetchData()
  }, [])

  const handleFetchData = () => {
    setLoading(true)
    setTimeout(() => {
      setData(generateHistoricalData(dateRange, minerId, dataType))
      setLoading(false)
    }, 1000)
  }

  const handleDateChange = (dates) => {
    setDateRange(dates)
  }

  const handleMinerChange = (value) => {
    setMinerId(value === "all" ? null : value)
  }

  const handleDataTypeChange = (value) => {
    setDataType(value)
  }

  const handleExport = () => {
    // In a real app, this would generate a CSV or Excel file
    alert("Exporting data... This would download a file in a real application.")
  }

  const OxygenLevelChart = ({ data }) => {
    if (!data || data.length === 0) {
      return <div>No oxygen data available</div>
    }
  
    // Prepare data for chart
    const chartData = data.map(item => ({
      timestamp: new Date(item.timestamp).toLocaleString(),
      oxygenLevel: item.oxygenLevel
    }))
  
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis 
            label={{ value: 'Oxygen Level (%)', angle: -90, position: 'insideLeft' }}
            domain={[18, 'auto']}
          />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="oxygenLevel" 
            stroke="#8884d8" 
            activeDot={{ r: 8 }}
            name="Oxygen Level"
          />
        </LineChart>
      </ResponsiveContainer>
    )
  }
  
  // Temperature Chart
   const TemperatureChart = ({ data }) => {
    if (!data || data.length === 0) {
      return <div>No temperature data available</div>
    }
  
    // Prepare data for chart
    const chartData = data.map(item => ({
      timestamp: new Date(item.timestamp).toLocaleString(),
      temperature: item.temperature
    }))
  
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis 
            label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }}
            domain={[20, 'auto']}
          />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="temperature" 
            stroke="#82ca9d" 
            activeDot={{ r: 8 }}
            name="Temperature"
          />
        </LineChart>
      </ResponsiveContainer>
    )
  }

  const renderCharts = () => {
    if (!data) return <Empty description="No data available" />

    return (
      <div>
        {dataType === "oxygen" || dataType === "all" ? (
          <Card title="Oxygen Levels" style={{ marginBottom: 16 }}>
            <OxygenLevelChart data={data.oxygenData} />
          </Card>
        ) : null}

        {dataType === "temperature" || dataType === "all" ? (
          <Card title="Temperature Readings" style={{ marginBottom: 16 }}>
            <TemperatureChart data={data.temperatureData} />
          </Card>
        ) : null}

        {dataType === "alerts" || dataType === "all" ? (
          <Card title="Alerts History">
            <AlertsChart data={data.alertsData} />
          </Card>
        ) : null}
      </div>
    )
  }

  const renderTable = () => {
    if (!data) return <Empty description="No data available" />

    let tableData = []
    const columns = [
      {
        title: "Timestamp",
        dataIndex: "timestamp",
        key: "timestamp",
        render: (text) => new Date(text).toLocaleString(),
      },
    ]

    if (dataType === "oxygen" || dataType === "all") {
      columns.push({
        title: "Oxygen Level (%)",
        dataIndex: "oxygenLevel",
        key: "oxygenLevel",
        render: (value) => {
          const color = value < 19.5 ? "red" : value < 20 ? "orange" : "green"
          return <Tag color={color}>{value.toFixed(1)}%</Tag>
        },
      })
    }

    if (dataType === "temperature" || dataType === "all") {
      columns.push({
        title: "Temperature (°C)",
        dataIndex: "temperature",
        key: "temperature",
        render: (value) => {
          const color = value > 30 ? "red" : value > 28 ? "orange" : "green"
          return <Tag color={color}>{value.toFixed(1)}°C</Tag>
        },
      })
    }

    if (dataType === "alerts" || dataType === "all") {
      columns.push({
        title: "Alert Type",
        dataIndex: "alertType",
        key: "alertType",
      })
      columns.push({
        title: "Severity",
        dataIndex: "severity",
        key: "severity",
        render: (value) => {
          const color =
            value === "critical" ? "purple" : value === "high" ? "red" : value === "medium" ? "orange" : "blue"
          return <Tag color={color}>{value.toUpperCase()}</Tag>
        },
      })
    }

    if (minerId) {
      columns.push({
        title: "Miner ID",
        dataIndex: "minerId",
        key: "minerId",
      })
    }

    // Combine data for table
    if (dataType === "oxygen" || dataType === "all") {
      tableData = [...tableData, ...data.oxygenData]
    }
    if (dataType === "temperature" || dataType === "all") {
      tableData = [...tableData, ...data.temperatureData]
    }
    if (dataType === "alerts" || dataType === "all") {
      tableData = [...tableData, ...data.alertsData]
    }

    // Sort by timestamp
    tableData.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    return (
      <Table
        columns={columns}
        dataSource={tableData}
        rowKey={(record) => `${record.timestamp}-${record.minerId || "all"}`}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 800 }}
      />
    )
  }

  return (
    <div>
      {/* <Title level={2}>Historical Data Analysis</Title> */}

      <Card style={{ marginBottom: 16 }}>
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Space wrap>
            <div>
              <div style={{ marginBottom: 8 }}>Date Range:</div>
              <RangePicker onChange={handleDateChange} style={{ width: 300 }} />
            </div>

            <div>
              <div style={{ marginBottom: 8 }}>Miner:</div>
              <Select defaultValue="all" style={{ width: 150 }} onChange={handleMinerChange}>
                <Option value="all">All Miners</Option>
                <Option value="M1001">M1001 - John Doe</Option>
                <Option value="M1002">M1002 - Jane Smith</Option>
                <Option value="M1003">M1003 - Bob Johnson</Option>
                <Option value="M1004">M1004 - Alice Brown</Option>
              </Select>
            </div>

            <div>
              <div style={{ marginBottom: 8 }}>Data Type:</div>
              <Select defaultValue="oxygen" style={{ width: 150 }} onChange={handleDataTypeChange}>
                <Option value="all">All Data</Option>
                <Option value="oxygen">Oxygen Levels</Option>
                <Option value="temperature">Temperature</Option>
                <Option value="alerts">Alerts</Option>
              </Select>
            </div>
          </Space>

          <Space>
            <Button type="primary" icon={<ReloadOutlined />} onClick={handleFetchData}>
              Fetch Data
            </Button>
            <Button icon={<DownloadOutlined />} onClick={handleExport}>
              Export Data
            </Button>
          </Space>
        </Space>
      </Card>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        type="card"
        items={[
          {
            key: "charts",
            label: "Charts",
            children: loading ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <Spin size="large" />
                <div style={{ marginTop: 16 }}>Loading data...</div>
              </div>
            ) : (
              renderCharts()
            ),
          },
          {
            key: "table",
            label: "Table View",
            children: loading ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <Spin size="large" />
                <div style={{ marginTop: 16 }}>Loading data...</div>
              </div>
            ) : (
              renderTable()
            ),
          },
        ]}
      />
    </div>
  )
}