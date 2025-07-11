import React, { useState, useEffect, useCallback } from 'react'; // Added useCallback
import axios from 'axios'; // Import axios
import {
    Calendar,
    Download,
    Filter,
    TrendingUp,
    TrendingDown,
    BarChart3,
    Activity,
    Clock,
    User,
    MapPin,
    AlertCircle,
    CheckCircle,
    XCircle,
    Search,
    RefreshCw,
    FileText,
    Thermometer,
    Wind,
    Flame,
    Heart,
    Battery,
    Shield
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import HistoricalTab from './HistoricalDataTab';
import moment from 'moment';
import AlertTab from './AlertTab';

const API_BASE_URL = 'http://localhost:3061/api/sensors'; // Your API base URL

const Analytics = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedMiner, setSelectedMiner] = useState('all'); // This will likely be employeeId or helmetId in real data
    const [dateRange, setDateRange] = useState('7days');
    const [selectedMetric, setSelectedMetric] = useState('temperature');

    // States for fetched data
    const [historicalData, setHistoricalData] = useState([]);
    const [alertHistory, setAlertHistory] = useState([]);
    const [analyticsData, setAnalyticsData] = useState({
        totalAlerts: 0,
        criticalAlerts: 0,
        warningAlerts: 0,
        infoAlerts: 0,
        avgResponseTime: 'N/A',
        minersActive: 0,
        safetyScore: 0,
        incidentRate: 0
    });
    const [safetyTrends, setSafetyTrends] = useState([]);
    const [minerPerformance, setMinerPerformance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    console.log("safetyTrends", safetyTrends);
  


    // --- Data Fetching Functions ---




    const fetchAlertHistory = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // *** YOU NEED TO CREATE THIS ENDPOINT IN YOUR BACKEND: ***
            // router.get('/alerts/history', helmetController.getAllAlertsHistory);
            const response = await axios.get(`${API_BASE_URL}/alerts/history`); 
            if (response.data.success) {
              console.log("response from api history", response.data.data);
                setAlertHistory(response.data.data);
            } else {
                setAlertHistory(mockAlertHistory); // Fallback to mock on API error
            }
        } catch (err) {
            console.error('Error fetching alert history:', err);
            setError(err.message || 'Failed to fetch alert history.');
            // setAlertHistory(mockAlertHistory); // Fallback to mock data on error
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchOverviewAnalytics = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // *** YOU NEED TO CREATE THIS ENDPOINT IN YOUR BACKEND: ***
            // router.get('/analytics/overview', helmetController.getOverviewAnalytics);
            const response = await axios.get(`${API_BASE_URL}/analytics/overview`);
            if (response.data.success) {
              console.log("response from api analytics", response.data.data);
                setAnalyticsData(response.data.data);
            } else {
                // setAnalyticsData(mockAnalyticsData); // Fallback to mock on API error
            }
        } catch (err) {
            console.error('Error fetching overview analytics:', err);
            setError(err.message || 'Failed to fetch overview analytics.');
            // setAnalyticsData(mockAnalyticsData); // Fallback to mock data on error
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchSafetyTrends = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // *** YOU NEED TO CREATE THIS ENDPOINT IN YOUR BACKEND: ***
            // router.get('/analytics/safety-trends', helmetController.getSafetyTrends);
            const response = await axios.get(`${API_BASE_URL}/analytics/safety-trends`);
            if (response.data.success) {
              console.log("response from api trends", response.data.data);
                setSafetyTrends(response.data.data);
            } else {
                // setSafetyTrends(mockSafetyTrends); // Fallback to mock on API error
            }
        } catch (err) {
            console.error('Error fetching safety trends:', err);
            setError(err.message || 'Failed to fetch safety trends.');
            // setSafetyTrends(mockSafetyTrends); // Fallback to mock data on error
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchMinerPerformance = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // *** YOU NEED TO CREATE THIS ENDPOINT IN YOUR BACKEND: ***
            // router.get('/analytics/miner-performance', helmetController.getMinerPerformance);
            const response = await axios.get(`${API_BASE_URL}/analytics/miner-performance`);
            if (response.data.success) {
              console.log("response from api", response.data.data);
                setMinerPerformance(response.data.data);
            } else {
                // setMinerPerformance(mockMinerPerformance); // Fallback to mock on API error
            }
        } catch (err) {
            console.error('Error fetching miner performance:', err);
            setError(err.message || 'Failed to fetch miner performance.');
            // setMinerPerformance(mockMinerPerformance); // Fallback to mock data on error
        } finally {
            setLoading(false);
        }
    }, []);


    useEffect(() => {
        // Fetch data based on the active tab
        if (activeTab === 'overview') {
            fetchOverviewAnalytics();
            fetchSafetyTrends();
            fetchMinerPerformance();
        } 
        // else if (activeTab === 'alerts') {
        //     fetchAlertHistory();
        // }
        // else if (activeTab === 'historical') {
        //     fetchHistoricalData();
        // }
    }, [activeTab, fetchOverviewAnalytics, fetchSafetyTrends, fetchMinerPerformance, fetchAlertHistory]); // Include fetch functions in dependencies

    // Re-fetch historical data when filters change
   


    const alertTypeData = [
        { name: 'Critical', value: analyticsData.criticalAlerts, color: '#ef4444' },
        { name: 'Warning', value: analyticsData.warningAlerts, color: '#f59e0b' },
        { name: 'Info', value: analyticsData.infoAlerts, color: '#3b82f6' }
    ];

    const getAlertIcon = (type) => {
        switch (type) {
            case 'critical': return <XCircle className="w-5 h-5 text-red-500" />;
            case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
            case 'emergency': return <AlertCircle className="w-5 h-5 text-purple-500" />;
            case 'info': return <CheckCircle className="w-5 h-5 text-blue-500" />;
            default: return <AlertCircle className="w-5 h-5 text-gray-500" />;
        }
    };

    const getAlertBadgeColor = (type) => {
        switch (type) {
            case 'critical': return 'bg-red-100 text-red-800 border-red-200';
            case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'emergency': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'info': return 'bg-blue-100 text-blue-800 border-blue-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const StatCard = ({ title, value, change, icon: Icon, color = 'blue' }) => (
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
                    {change && (
                        <p className={`text-sm mt-2 flex items-center ${
                            change > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
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

    const OverviewTab = () => (
        <div className="space-y-6">
            {loading && <p>Loading Overview Data...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}
            {!loading && !error && (
                <>
                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            title="Total Alerts"
                            value={analyticsData.totalAlerts}
                            change={-15}
                            icon={AlertCircle}
                            color="blue"
                        />
                        <StatCard
                            title="Critical Incidents"
                            value={analyticsData.criticalAlerts}
                            change={-25}
                            icon={XCircle}
                            color="red"
                        />
                        <StatCard
                            title="Safety Score"
                            value={`${analyticsData.safetyScore}%`}
                            change={5}
                            icon={Shield}
                            color="green"
                        />
                        <StatCard
                            title="Avg Response Time"
                            value={analyticsData.avgResponseTime}
                            change={-12}
                            icon={Clock}
                            color="purple"
                        />
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Safety Trends */}
                        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Safety Trends (6 Months)</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={safetyTrends}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month"   tickFormatter={(unixTimestamp) => {
                                            if (typeof unixTimestamp === 'number') { // Ensure it's a number (timestamp)
                                                return moment(unixTimestamp).format('MMM YY'); // e.g., "Jan 25"
                                            }
                                            return unixTimestamp; // Return as is if already a string
                                        }}/>
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
                                                                miner.safetyScore >= 90 ? 'bg-green-500' :
                                                                miner.safetyScore >= 80 ? 'bg-yellow-500' : 'bg-red-500'
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
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    miner.safetyScore >= 90 ? 'bg-green-100 text-green-800' :
                                                    miner.safetyScore >= 80 ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                    {miner.safetyScore >= 90 ? 'Excellent' :
                                                        miner.safetyScore >= 80 ? 'Good' : 'Needs Attention'}
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

    // const HistoricalTab = () => (
    //   <div className="space-y-6">
    //         {/* Filters */}
    //         <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
    //             <div className="flex flex-wrap items-center gap-4">
    //                 {/* Date Range Filter (Commented out as requested) */}
    //                 {/* This div block is commented out to hide the date range selector */}
    //                 <div className="flex items-center space-x-2">
    //                     <Calendar className="w-5 h-5 text-gray-500" />
    //                     <select
    //                         className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    //                         value={dateRange}
    //                         onChange={(e) => setDateRange(e.target.value)}
    //                     >
    //                         <option value="1day">Last 24 Hours</option>
    //                         <option value="7days">Last 7 Days</option>
    //                         <option value="30days">Last 30 Days</option>
    //                         <option value="90days">Last 90 Days</option>
    //                     </select>
    //                 </div>

    //                 <div className="flex items-center space-x-2">
    //                     <User className="w-5 h-5 text-gray-500" />
    //                     <select
    //                         className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    //                         value={selectedMiner}
    //                         onChange={(e) => setSelectedMiner(e.target.value)}
    //                     >
    //                         <option value="all">All Miners</option>
    //                         {employees.map(employee => (
    //                             <option key={employee.id} value={employee.id}> 
    //                                 {employee.name}
    //                             </option>
    //                         ))}
    //                     </select>
    //                 </div>

    //                 <div className="flex items-center space-x-2">
    //                     <BarChart3 className="w-5 h-5 text-gray-500" />
    //                     <select
    //                         className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    //                         value={selectedMetric}
    //                         onChange={(e) => setSelectedMetric(e.target.value)}
    //                     >
    //                         <option value="temperature">Temperature</option>
    //                         <option value="oxygen">Oxygen</option>
    //                         <option value="co">CO Levels</option>
    //                         <option value="heartRate">Heart Rate</option>
    //                     </select>
    //                 </div>

    //                 <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
    //                     <Download className="w-4 h-4" />
    //                     <span>Export Data</span>
    //                 </button>
    //             </div>
    //         </div>

    //         {loading && <p>Loading Historical Data...</p>}
    //         {error && <p className="text-red-500">Error: {error}</p>}
    //         {!loading && !error && (
    //             <>
    //                 {/* Historical Chart */}
    //                 <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
    //                     <h3 className="text-lg font-semibold text-gray-900 mb-4">
    //                         Historical {selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)} Data
    //                     </h3>
    //                     {historicalData.length > 0 ? (
    //                         <ResponsiveContainer width="100%" height={400}>
    //                             <AreaChart data={historicalData}>
    //                                 <CartesianGrid strokeDasharray="3 3" />
    //                                 <XAxis dataKey="time" />
    //                                 <YAxis />
    //                                 <Tooltip />
    //                                 <Legend />
    //                                 <Area
    //                                     type="monotone"
    //                                     dataKey={selectedMetric}
    //                                     stroke="#3b82f6"
    //                                     fill="#3b82f6"
    //                                     fillOpacity={0.1}
    //                                     strokeWidth={2}
    //                                 />
    //                             </AreaChart>
    //                         </ResponsiveContainer>
    //                     ) : (
    //                         <p className="text-center text-gray-500">No data available for the selected filters.</p>
    //                     )}
    //                 </div>

    //                 {/* Data Table */}
    //                 <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
    //                     <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Historical Data</h3>
    //                     <div className="overflow-x-auto">
    //                         {historicalData.length > 0 ? (
    //                             <table className="min-w-full">
    //                                 <thead>
    //                                     <tr className="border-b border-gray-200">
    //                                         <th className="text-left py-3 px-4 font-medium text-gray-700">Time</th>
    //                                         <th className="text-left py-3 px-4 font-medium text-gray-700">Miner</th>
    //                                         <th className="text-left py-3 px-4 font-medium text-gray-700">Temperature (°C)</th>
    //                                         <th className="text-left py-3 px-4 font-medium text-gray-700">Oxygen (%)</th>
    //                                         <th className="text-left py-3 px-4 font-medium text-gray-700">CO (ppm)</th>
    //                                         <th className="text-left py-3 px-4 font-medium text-gray-700">Heart Rate (bpm)</th>
    //                                     </tr>
    //                                 </thead>
    //                                 <tbody>
    //                                     {historicalData.map((row, index) => (
    //                                         <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
    //                                             <td className="py-3 px-4 text-gray-700">{row.time}</td>
    //                                             <td className="py-3 px-4 font-medium text-gray-900">{row.miner}</td>
    //                                             <td className="py-3 px-4 text-gray-700">{row.temperature}</td>
    //                                             <td className="py-3 px-4 text-gray-700">{row.oxygen}</td>
    //                                             <td className="py-3 px-4 text-gray-700">{row.co}</td>
    //                                             <td className="py-3 px-4 text-gray-700">{row.heartRate}</td>
    //                                         </tr>
    //                                     ))}
    //                                 </tbody>
    //                             </table>
    //                         ) : (
    //                             <p className="text-center text-gray-500">No data available for the selected filters.</p>
    //                         )}
    //                     </div>
    //                 </div>
    //             </>
    //         )}
    //     </div>
    // );

    // const AlertsTab = () => (
    //     <div className="space-y-6">
    //         {/* Alert Filters */}
    //         <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
    //             <div className="flex flex-wrap items-center gap-4">
    //                 <div className="flex items-center space-x-2">
    //                     <Search className="w-5 h-5 text-gray-500" />
    //                     <input
    //                         type="text"
    //                         placeholder="Search alerts..."
    //                         className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    //                     />
    //                 </div>

    //                 <div className="flex items-center space-x-2">
    //                     <Filter className="w-5 h-5 text-gray-500" />
    //                     <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
    //                         <option value="all">All Types</option>
    //                         <option value="critical">Critical</option>
    //                         <option value="warning">Warning</option>
    //                         <option value="emergency">Emergency</option>
    //                         <option value="info">Info</option>
    //                     </select>
    //                 </div>

    //                 <div className="flex items-center space-x-2">
    //                     <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
    //                         <option value="all">All Status</option>
    //                         <option value="resolved">Resolved</option>
    //                         <option value="pending">Pending</option>
    //                     </select>
    //                 </div>

    //                 <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
    //                     <FileText className="w-4 h-4" />
    //                     <span>Generate Report</span>
    //                 </button>
    //             </div>
    //         </div>

    //         {loading && <p>Loading Alerts...</p>}
    //         {error && <p className="text-red-500">Error: {error}</p>}
    //         {!loading && !error && (
    //             <>
    //                 {/* Alert List */}
    //                 <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
    //                     <div className="p-6 border-b border-gray-200">
    //                         <h3 className="text-lg font-semibold text-gray-900">Alert History</h3>
    //                     </div>
    //                     <div className="divide-y divide-gray-200">
    //                         {alertHistory.map((alert) => (
    //                             <div key={alert.id} className="p-6 hover:bg-gray-50">
    //                                 <div className="flex items-start space-x-4">
    //                                     <div className="flex-shrink-0">
    //                                         {getAlertIcon(alert.type)}
    //                                     </div>
    //                                     <div className="flex-1 min-w-0">
    //                                         <div className="flex items-center justify-between">
    //                                             <div className="flex items-center space-x-3">
    //                                                 <h4 className="text-sm font-medium text-gray-900">{alert.message}</h4>
    //                                                 <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getAlertBadgeColor(alert.type)}`}>
    //                                                     {alert.type.toUpperCase()}
    //                                                 </span>
    //                                                 {alert.resolved && (
    //                                                     <span className="px-2 py-1 text-xs font-medium rounded-full border bg-green-100 text-green-800 border-green-200">
    //                                                         RESOLVED
    //                                                     </span>
    //                                                 )}
    //                                             </div>
    //                                             <div className="text-sm text-gray-500">
    //                                                 {alert.timestamp}
    //                                             </div>
    //                                         </div>

    //                                         <div className="mt-2 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
    //                                             <div className="flex items-center">
    //                                                 <User className="w-4 h-4 mr-2" />
    //                                                 <span>{alert.miner} ({alert.helmet})</span>
    //                                             </div>
    //                                             <div className="flex items-center">
    //                                                 <MapPin className="w-4 h-4 mr-2" />
    //                                                 <span>{alert.location}</span>
    //                                             </div>
    //                                             <div className="flex items-center">
    //                                                 <Activity className="w-4 h-4 mr-2" />
    //                                                 <span>Value: {alert.value} | Threshold: {alert.threshold}</span>
    //                                             </div>
    //                                             <div className="flex items-center">
    //                                                 <Clock className="w-4 h-4 mr-2" />
    //                                                 <span>Duration: {alert.duration}</span>
    //                                             </div>
    //                                         </div>

    //                                         {alert.resolved && alert.resolvedBy && (
    //                                             <div className="mt-2 text-sm text-green-600">
    //                                                 <strong>Resolved by:</strong> {alert.resolvedBy}
    //                                             </div>
    //                                         )}
    //                                     </div>
    //                                 </div>
    //                             </div>
    //                         ))}
    //                     </div>
    //                 </div>
    //             </>
    //         )}
    //     </div>
    // );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        {/* Title goes here */}
                    </div>
                    <div className="flex items-center space-x-4">
                        {/* Header actions */}
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="bg-white border-b border-gray-200 px-6">
                <nav className="flex space-x-8">
                    {[
                        { id: 'overview', label: 'Overview', icon: BarChart3 },
                        { id: 'historical', label: 'Historical Data', icon: Activity },
                        { id: 'alerts', label: 'Alert History', icon: AlertCircle }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === tab.id
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            <tab.icon className="w-5 h-5" />
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
                {activeTab === 'overview' && <OverviewTab />}
                {activeTab === 'historical' && <HistoricalTab activeTab={activeTab}/>}
                {activeTab === 'alerts' && <AlertTab activeTab={activeTab} />}
            </div>
        </div>
    );
};

export default Analytics;