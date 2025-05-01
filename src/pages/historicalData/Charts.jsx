"use client"

import React from 'react'
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
import { Card, Typography } from 'antd'

const { Text } = Typography

// Oxygen Level Chart
export const OxygenLevelChart = ({ data }) => {
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
export const TemperatureChart = ({ data }) => {
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

// Alerts Trend Chart
export default function renderCharts ({ data })  {
  if (!data || data.length === 0) {
    return <div>No alerts data available</div>
  }

  // Group alerts by severity
  const severityCount = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0
  }

  data.forEach(alert => {
    severityCount[alert.severity]++
  })

  // Prepare data for chart
  const chartData = Object.entries(severityCount).map(([severity, count]) => ({
    severity: severity.charAt(0).toUpperCase() + severity.slice(1),
    count
  }))

  // Color mapping for severity
  const severityColors = {
    Critical: '#ff4d4f',
    High: '#orange',
    Medium: '#faad14',
    Low: '#52c41a'
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="severity" />
        <YAxis 
          label={{ value: 'Number of Alerts', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip />
        <Legend />
        {chartData.map((entry, index) => (
          <Line 
            key={entry.severity}
            type="monotone" 
            dataKey="count" 
            name={entry.severity}
            stroke={severityColors[entry.severity]}
            activeDot={{ r: 8 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

// Main Render Function (optional, but helpful)
export const renderCharts = (data, dataType) => {
  if (!data) return <div>No data available</div>

  return (
    <div>
      {(dataType === "oxygen" || dataType === "all") && (
        <Card 
          title="Oxygen Levels" 
          style={{ marginBottom: 16 }}
        >
          <OxygenLevelChart data={data.oxygenData} />
        </Card>
      )}

      {(dataType === "temperature" || dataType === "all") && (
        <Card 
          title="Temperature Readings" 
          style={{ marginBottom: 16 }}
        >
          <TemperatureChart data={data.temperatureData} />
        </Card>
      )}

      {(dataType === "alerts" || dataType === "all") && (
        <Card title="Alerts History">
          <AlertsChart data={data.alertsData} />
        </Card>
      )}
    </div>
  )
}

