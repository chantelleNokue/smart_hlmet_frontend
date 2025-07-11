"use client"

import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  Area,
  AreaChart
} from 'recharts';
import {
  Shield,
  AlertTriangle,
  Clock,
  Thermometer,
  Wind,
  Users,
  Activity,
  Database,
  Wifi,
  WifiOff
} from 'lucide-react';

// Import the already initialized Firebase database instance
import { database } from '../auth/firebase'; // Adjust this path if your firebase.js is elsewhere
import { ref, onValue } from 'firebase/database'; // Import specific Realtime Database functions

export default function MiningDashboard() {
  const [sensorData, setSensorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [connectionStatus, setConnectionStatus] = useState('disconnected'); // Initial state

  // Function to subscribe to ALL latest helmet data
  const subscribeToAllLatestHelmets = () => {
    // Reference to the 'helmets' path in your Realtime Database
    const helmetsRef = ref(database, 'helmets'); // Use the imported 'database' instance

    // Set up the real-time listener
    const unsubscribe = onValue(helmetsRef, (snapshot) => {
      const allHelmetsData = snapshot.val();
      if (allHelmetsData) {
        const latestDataMap = {};
        Object.keys(allHelmetsData).forEach(helmetId => {
          if (allHelmetsData[helmetId].latest) {
            latestDataMap[helmetId] = allHelmetsData[helmetId].latest;
          }
        });
        setSensorData(latestDataMap);
        setLastUpdate(new Date());
        setConnectionStatus('connected');
        setError(null);
        console.log("Real-time update received:", latestDataMap);
      } else {
        setSensorData({});
        setLastUpdate(new Date());
        setConnectionStatus('connected');
        setError(null);
        console.log("No helmet data found.");
      }
      setLoading(false);
    }, (dbError) => {
      console.error("Firebase Realtime DB Error:", dbError);
      setError(`Firebase connection error: ${dbError.message}`);
      setConnectionStatus('disconnected');
      setLoading(false);
    });

    return unsubscribe;
  };

  useEffect(() => {
    const unsubscribe = subscribeToAllLatestHelmets();

    return () => {
      console.log("Detaching Firebase listener...");
      unsubscribe();
    };
  }, []);

  const processChartData = () => {
    if (!sensorData) return { envData: [], riskData: [], tempTrend: [], alerts: [] };

    const envData = Object.entries(sensorData).map(([helmetId, data]) => ({
      helmet: helmetId.replace('helmet_', 'Helmet '),
      temperature: data.temperature || 0,
      humidity: data.humidity || 0,
      gasLevel: data.gasLevel || 0,
      risk: data.temperature > 35 ? 'High' :
            data.temperature > 30 ? 'Medium' : 'Low'
    }));

    const riskDistribution = envData.reduce((acc, item) => {
      acc[item.risk] = (acc[item.risk] || 0) + 1;
      return acc;
    }, {});

    const riskData = Object.entries(riskDistribution).map(([risk, count]) => ({
      name: `${risk} Risk`,
      value: count,
      percentage: ((count / envData.length) * 100).toFixed(1)
    }));

    const tempTrend = envData.map((item, index) => ({
      time: `${8 + index}:00`,
      ...item,
      avgTemp: envData.reduce((sum, d) => sum + d.temperature, 0) / envData.length
    }));

    const alerts = Object.entries(sensorData)
      .filter(([_, data]) => data.gasAlert || data.tempAlert || data.panicAlert)
      .map(([helmetId, data]) => ({
        helmet: helmetId.replace('helmet_', 'Helmet '),
        alerts: [
          data.gasAlert && 'Gas Level Alert',
          data.tempAlert && 'Temperature Alert',
          data.panicAlert && 'Panic Button Pressed'
        ].filter(Boolean)
      }));

    return { envData, riskData, tempTrend, alerts };
  };

  const { envData, riskData, tempTrend, alerts } = processChartData();

  const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading mining safety data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
        <div className="px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8" />
            <h1 className="text-2xl font-bold">Mining Safety Monitor</h1>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              {connectionStatus === 'connected' ? (
                <Wifi className="w-5 h-5 text-green-300" />
              ) : (
                <WifiOff className="w-5 h-5 text-red-300" />
              )}
              <span className="text-sm capitalize">
                {connectionStatus}
              </span>
            </div>
            {alerts.length > 0 && (
              <div className="flex items-center space-x-2 bg-red-500 bg-opacity-20 px-3 py-1 rounded-full">
                <AlertTriangle className="w-5 h-5 text-yellow-300" />
                <span className="font-medium">{alerts.length} Active Alerts</span>
              </div>
            )}
            <div className="text-sm">
              Last Update: {lastUpdate.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="text-red-800 font-medium">Connection Error</span>
            </div>
            <p className="text-red-700 mt-1">{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Active Helmets</p>
                <p className="text-2xl font-bold text-gray-900">
                  {sensorData ? Object.keys(sensorData).length : 0}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Avg Temperature</p>
                <p className="text-2xl font-bold text-gray-900">
                  {envData.length > 0
                    ? `${(envData.reduce((sum, d) => sum + d.temperature, 0) / envData.length).toFixed(1)}°C`
                    : 'N/A'
                  }
                </p>
              </div>
              <Thermometer className="w-8 h-8 text-orange-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">High Risk Areas</p>
                <p className="text-2xl font-bold text-red-600">
                  {envData.filter(d => d.risk === 'High').length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Active Alerts</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {alerts.reduce((sum, alert) => sum + alert.alerts.length, 0)}
                </p>
              </div>
              <Database className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Environmental Conditions */}
          <div className="xl:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Environmental Conditions</h3>
              <Clock className="w-5 h-5 text-gray-400" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={envData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="helmet" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
                <Bar dataKey="temperature" fill="#f59e0b" name="Temperature (°C)" radius={[2, 2, 0, 0]} />
                <Bar dataKey="humidity" fill="#3b82f6" name="Humidity (%)" radius={[2, 2, 0, 0]} />
                <Bar dataKey="gasLevel" fill="#ef4444" name="Gas Level" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Risk Distribution */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Risk Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Temperature Trend */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Temperature Trend Analysis</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={tempTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="helmet" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="temperature"
                  stroke="#f59e0b"
                  fillOpacity={1}
                  fill="url(#colorTemp)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Real-time Alerts */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Active Alerts</h3>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {alerts.length > 0 ? (
                alerts.map((alert, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg border border-red-200">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-red-900">{alert.helmet}</p>
                      <div className="text-sm text-red-700 space-y-1">
                        {alert.alerts.map((alertType, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                            <span>{alertType}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Shield className="w-12 h-12 mx-auto mb-3 text-green-500" />
                  <p>All systems operating normally</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Gas Level Monitoring */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Gas Level Monitoring</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={envData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="helmet" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="gasLevel"
                stroke="#ef4444"
                strokeWidth={3}
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: '#ef4444', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Detailed Data Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Helmet Status Details</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Helmet ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Temperature
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Humidity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gas Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Risk Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Alerts
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {envData.map((item, index) => {
                  const helmetAlerts = alerts.find(alert => alert.helmet === item.helmet);
                  return (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.helmet}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center space-x-2">
                          <Thermometer className="w-4 h-4 text-orange-500" />
                          <span>{item.temperature}°C</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center space-x-2">
                          <Wind className="w-4 h-4 text-blue-500" />
                          <span>{item.humidity}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.gasLevel}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            item.risk === 'High' ? 'bg-red-100 text-red-800' :
                            item.risk === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}
                        >
                          {item.risk}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {helmetAlerts ? (
                          <div className="space-y-1">
                            {helmetAlerts.alerts.map((alert, idx) => (
                              <div key={idx} className="flex items-center space-x-1">
                                <AlertTriangle className="w-3 h-3 text-red-500" />
                                <span className="text-red-700 text-xs">{alert}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-green-600 text-xs">No alerts</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-2 ${
                            item.risk === 'High' ? 'bg-red-500' :
                            item.risk === 'Medium' ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}></div>
                          <span className="text-sm text-gray-900">
                            {helmetAlerts ? 'Alert' : 'Normal'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}