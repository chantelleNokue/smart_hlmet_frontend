import React from 'react';
import { TrendingUp, TrendingDown, Clock, AlertCircle, XCircle, Shield } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';

export default function OverviewTab({ analyticsData, loading, error, safetyTrends, minerPerformance, analyticsData }) {
  const StatCard = ({ title, value, change, icon: Icon, color = 'blue' }) => (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <p className={`text-sm mt-2 flex items-center ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change > 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
              {Math.abs(change)}% from last week
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-${color}-50`}>
          <Icon className={`w-8 h-8 text-${color}-600`} />
        </div>
      </div>
    </div>
  );
  const alertTypeData = [
    { name: 'Critical', value: analyticsData.criticalAlerts, color: '#ef4444' },
    { name: 'Warning', value: analyticsData.warningAlerts, color: '#f59e0b' },
    { name: 'Info', value: analyticsData.infoAlerts, color: '#3b82f6' }
  ];
  return (
    <div className="space-y-6">
      {loading && <p>Loading Overview Data...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && !error && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Total Alerts" value={analyticsData.totalAlerts} change={-15} icon={AlertCircle} color="blue" />
            <StatCard title="Critical Incidents" value={analyticsData.criticalAlerts} change={-25} icon={XCircle} color="red" />
            <StatCard title="Safety Score" value={`${analyticsData.safetyScore}%`} change={5} icon={Shield} color="green" />
            <StatCard title="Avg Response Time" value={analyticsData.avgResponseTime} change={-12} icon={Clock} color="purple" />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Safety Trends */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Safety Trends (6 Months)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={safetyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="incidents" fill="#ef4444" name="Incidents" />
                  <Line yAxisId="right" type="monotone" dataKey="safetyScore" stroke="#10b981" strokeWidth={2} name="Safety Score %" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Alert Distribution */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Alert Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={alertTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {alertTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Miner Performance */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Miner Safety Performance</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Miner</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Safety Score</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Incidents</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Hours Worked</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {minerPerformance.map((miner, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-3 px-4 font-medium text-gray-900">{miner.name}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className={`h-2 rounded-full ${
                                miner.safetyScore >= 90 ? 'bg-green-500' : miner.safetyScore >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${miner.safetyScore}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{miner.safetyScore}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-700">{miner.incidents}</td>
                      <td className="py-3 px-4 text-gray-700">{miner.hoursWorked}h</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            miner.safetyScore >= 90
                              ? 'bg-green-100 text-green-800'
                              : miner.safetyScore >= 80
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {miner.safetyScore >= 90 ? 'Excellent' : miner.safetyScore >= 80 ? 'Good' : 'Needs Attention'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}


