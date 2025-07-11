import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Thermometer, 
  Wind, 
  Flame,
  Heart,
  MapPin,
  Bell,
  Shield,
  User,
  Settings,
  LogOut,
  RefreshCw,
  Battery,
  Wifi,
  Clock
} from 'lucide-react';

const Notifications = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [miners] = useState([
    {
      id: 1,
      name: "John Mukamuri",
      helmet: "H001",
      location: "Tunnel A - Level 2",
      temperature: 28.5,
      oxygen: 19.2,
      co: 12,
      heartRate: 78,
      battery: 85,
      signal: 4,
      status: "safe",
      lastUpdate: "2 sec ago"
    },
    {
      id: 2,
      name: "Grace Chivanga",
      helmet: "H002", 
      location: "Tunnel B - Level 1",
      temperature: 32.1,
      oxygen: 18.1,
      co: 25,
      heartRate: 92,
      battery: 67,
      signal: 3,
      status: "warning",
      lastUpdate: "5 sec ago"
    },
    {
      id: 3,
      name: "Peter Ndoro",
      helmet: "H003",
      location: "Tunnel C - Level 3", 
      temperature: 35.2,
      oxygen: 17.8,
      co: 45,
      heartRate: 105,
      battery: 23,
      signal: 2,
      status: "critical",
      lastUpdate: "1 sec ago"
    }
  ]);

  const [alerts] = useState([
    { id: 1, type: "critical", message: "H003: High CO levels detected - 45 ppm", time: "10:34 AM", miner: "Peter Ndoro" },
    { id: 2, type: "warning", message: "H002: Temperature above normal - 32.1°C", time: "10:32 AM", miner: "Grace Chivanga" },
    { id: 3, type: "emergency", message: "H003: Emergency button pressed", time: "10:30 AM", miner: "Peter Ndoro" },
    { id: 4, type: "info", message: "H001: Battery below 30%", time: "10:28 AM", miner: "John Mukamuri" }
  ]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'safe': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getAlertColor = (type) => {
    switch(type) {
      case 'critical': return 'border-l-red-500 bg-red-50';
      case 'warning': return 'border-l-yellow-500 bg-yellow-50';
      case 'emergency': return 'border-l-purple-500 bg-purple-50';
      case 'info': return 'border-l-blue-500 bg-blue-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const StatCard = ({ title, value, unit, icon: Icon, status, threshold }) => (
    <div className={`p-4 rounded-lg border-2 ${
      status === 'critical' ? 'border-red-200 bg-red-50' :
      status === 'warning' ? 'border-yellow-200 bg-yellow-50' :
      'border-green-200 bg-green-50'
    }`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold ${
            status === 'critical' ? 'text-red-700' :
            status === 'warning' ? 'text-yellow-700' :
            'text-green-700'
          }`}>
            {value} {unit}
          </p>
          {threshold && (
            <p className="text-xs text-gray-500">Threshold: {threshold}</p>
          )}
        </div>
        <Icon className={`w-8 h-8 ${
          status === 'critical' ? 'text-red-500' :
          status === 'warning' ? 'text-yellow-500' :
          'text-green-500'
        }`} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-slate-70 border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
           
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <p className="text-gray-800 font-medium">{currentTime.toLocaleTimeString()}</p>
              <p className="text-slate-500 text-sm">{currentTime.toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-80 bg-slate-70 border-r border-slate-200 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <Bell className="w-6 h-6 mr-2 text-yellow-600" />
            Live Alerts
          </h2>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {alerts.map(alert => (
              <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${getAlertColor(alert.type)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 text-sm">{alert.message}</p>
                    <p className="text-xs text-gray-600 mt-1">{alert.miner}</p>
                  </div>
                  <span className="text-xs text-gray-500">{alert.time}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">System Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Active Helmets</span>
                <span className="text-green-600 font-medium">3/5</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Network Status</span>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                  <span className="text-green-600">Online</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Last Sync</span>
                <span className="text-slate-600">2 sec ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Active Miners</h2>
            <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>

          {/* Miners Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {miners.map(miner => (
              <div key={miner.id} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                {/* Miner Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${getStatusColor(miner.status)}`}></div>
                    <div>
                      <h3 className="font-bold text-gray-800">{miner.name}</h3>
                      <p className="text-sm text-slate-500">{miner.helmet}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Battery className={`w-4 h-4 ${miner.battery > 30 ? 'text-green-600' : 'text-red-600'}`} />
                    <span className={`text-sm ${miner.battery > 30 ? 'text-green-600' : 'text-red-600'}`}>
                      {miner.battery}%
                    </span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className={`w-1 h-3 mx-px ${i < miner.signal ? 'bg-green-600' : 'bg-slate-300'}`}></div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center space-x-2 mb-4">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-500 text-sm">{miner.location}</span>
                </div>

                {/* Sensor Data Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <StatCard
                    title="Temperature"
                    value={miner.temperature}
                    unit="°C"
                    icon={Thermometer}
                    status={miner.temperature > 30 ? (miner.temperature > 35 ? 'critical' : 'warning') : 'safe'}
                    threshold="< 30°C"
                  />
                  <StatCard
                    title="Oxygen"
                    value={miner.oxygen}
                    unit="%"
                    icon={Wind}
                    status={miner.oxygen < 19 ? (miner.oxygen < 18 ? 'critical' : 'warning') : 'safe'}
                    threshold="> 19%"
                  />
                  <StatCard
                    title="CO Level"
                    value={miner.co}
                    unit="ppm"
                    icon={Flame}
                    status={miner.co > 25 ? (miner.co > 40 ? 'critical' : 'warning') : 'safe'}
                    threshold="< 25 ppm"
                  />
                  <StatCard
                    title="Heart Rate"
                    value={miner.heartRate}
                    unit="bpm"
                    icon={Heart}
                    status={miner.heartRate > 90 ? (miner.heartRate > 100 ? 'critical' : 'warning') : 'safe'}
                    threshold="60-90 bpm"
                  />
                </div>

                {/* Emergency Button */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span className="text-xs text-slate-500">{miner.lastUpdate}</span>
                  </div>
                  {miner.status === 'critical' && (
                    <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm font-medium animate-pulse">
                      EMERGENCY
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Summary Stats */}
          <div className="mt-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Safety Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-700 text-sm">Safe</p>
                    <p className="text-2xl font-bold text-green-700">1</p>
                  </div>
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-700 text-sm">Warning</p>
                    <p className="text-2xl font-bold text-yellow-700">1</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-yellow-600" />
                </div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-700 text-sm">Critical</p>
                    <p className="text-2xl font-bold text-red-700">1</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-700 text-sm">Total Active</p>
                    <p className="text-2xl font-bold text-gray-800">3</p>
                  </div>
                  <User className="w-8 h-8 text-slate-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;