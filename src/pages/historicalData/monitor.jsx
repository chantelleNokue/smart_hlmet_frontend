import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Thermometer, Wind, Heart, AlertTriangle, Droplets, Clock, User, Shield } from 'lucide-react';

const AlertsCharts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [helmetsData, setHelmetsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API base URL - adjust this to match your backend
  const API_BASE_URL = 'http://localhost:3061/api/sensors'; // Updated to match your server configuration

  // Fetch all latest sensor data with assignments
  const fetchHelmetsData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch latest sensor data for all helmets
      const sensorResponse = await fetch(`${API_BASE_URL}/sensor-data/latest`);
      if (!sensorResponse.ok) {
        throw new Error('Failed to fetch sensor data');
      }
      const sensorResult = await sensorResponse.json();

      // Extract data from response - handle both array and single object responses
      let sensorData = [];
      if (sensorResult.success && sensorResult.data) {
        // If data is an array, use it directly; if it's a single object, wrap it in an array
        sensorData = Array.isArray(sensorResult.data) ? sensorResult.data : [sensorResult.data];
      }

      console.log('sensorResult', sensorResult);

      // Fetch all assignments to get employee info
      const assignmentsResponse = await fetch(`${API_BASE_URL}/assignments`);
      if (!assignmentsResponse.ok) {
        throw new Error('Failed to fetch assignments');
      }
      const assignmentsResult = await assignmentsResponse.json();

      console.log('assignmentsResult', assignmentsResult);

      // Extract assignments data
      let assignmentsData = [];
      if (assignmentsResult.success && assignmentsResult.data) {
        assignmentsData = Array.isArray(assignmentsResult.data) ? assignmentsResult.data : [assignmentsResult.data];
      }

      // Combine sensor data with assignment information
      // Combine sensor data with assignment information
      const combinedData = sensorData.map((sensor) => {
        // MODIFIED: Access helmetId within the nested 'helmet' object
        const assignment = assignmentsData.find((assign) => assign.helmet && assign.helmet.helmetId === sensor.helmetId); // Determine status based on sensor readings
        const status = determineStatus(sensor);
        return {
          helmetId: sensor.helmetId, // MODIFIED: Access employeeName, department, location from nested structures
          employeeName: assignment?.employee?.employeeName || 'Unassigned',
          employeeId: assignment?.employee?.employeeId || 'N/A', // Assuming employeeId is also nested
          department: assignment?.employee?.department || 'Unknown', // Assuming department is also nested
          location: assignment?.employee?.location || 'Unknown Location', // Assuming location is also nested
          status: status,
          temperature: parseFloat(sensor.temperature || 0),
          humidity: parseFloat(sensor.humidity || 0),
          gasLevel: parseInt(sensor.gasLevel || 0),
          gasAlert: sensor.gasAlert || false,
          tempAlert: sensor.tempAlert || false,
          humidityAlert: sensor.humidityAlert || false,
          panicAlert: sensor.panicAlert || false,
          panicButton: sensor.panicButton || 0,
          lastUpdate: new Date(sensor.timestamp || sensor.createdAt).toLocaleString(),
          recordId: sensor.recordId
        };
      });

      setHelmetsData(combinedData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Determine helmet status based on sensor readings and alerts
  const determineStatus = (sensor) => {
    // Critical conditions
    if (sensor.panicAlert || sensor.panicButton > 0) {
      return 'critical';
    }

    // Warning conditions
    if (sensor.gasAlert || sensor.tempAlert || sensor.humidityAlert) {
      return 'warning';
    }

    // Check sensor values against thresholds
    const temp = parseFloat(sensor.temperature || 0);
    const humidity = parseFloat(sensor.humidity || 0);
    const gasLevel = parseInt(sensor.gasLevel || 0);

    if (temp > 35 || humidity > 80 || gasLevel > 500) {
      return 'critical';
    }

    if (temp > 30 || humidity > 70 || gasLevel > 300) {
      return 'warning';
    }

    return 'safe';
  };

  // Filter helmets based on search term and status
  const filteredHelmets = helmetsData.filter((helmet) => {
    const matchesSearch =
      helmet.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      helmet.helmetId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      helmet.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      helmet.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || helmet.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Status color classes
  const getStatusColor = (status) => {
    switch (status) {
      case 'safe':
        return 'text-green-700 bg-green-100';
      case 'warning':
        return 'text-yellow-700 bg-yellow-100';
      case 'critical':
        return 'text-red-700 bg-red-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  const getStatusDot = (status) => {
    switch (status) {
      case 'safe':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'critical':
        return 'bg-red-500 animate-pulse';
      default:
        return 'bg-gray-500';
    }
  };

  // Get gas level color based on value
  const getGasLevelColor = (gasLevel) => {
    if (gasLevel > 500) return 'text-red-600';
    if (gasLevel > 300) return 'text-yellow-600';
    return 'text-green-600';
  };

  // Get temperature color based on value
  const getTempColor = (temp) => {
    if (temp > 35) return 'text-red-600';
    if (temp > 30) return 'text-yellow-600';
    return 'text-blue-600';
  };

  // Get humidity color based on value
  const getHumidityColor = (humidity) => {
    if (humidity > 80) return 'text-red-600';
    if (humidity > 70) return 'text-yellow-600';
    return 'text-blue-600';
  };

  console.log("helmetsData:", helmetsData);
  console.log("filteredHelmets:", filteredHelmets);

  // Fetch data on component mount and set up polling
  useEffect(() => {
    fetchHelmetsData();

    // Set up polling every 5 seconds for real-time updates
    const interval = setInterval(fetchHelmetsData, 5000);

    return () => clearInterval(interval);
  }, []);

  // Get status counts for summary
  const statusCounts = helmetsData.reduce((acc, helmet) => {
    acc[helmet.status] = (acc[helmet.status] || 0) + 1;
    return acc;
  }, {});

  if (loading && helmetsData.length === 0) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading helmet data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Data</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={fetchHelmetsData} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Smart Helmet Monitoring</h1>
          <p className="text-gray-600">Real-time monitoring of all active safety helmets</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Live Updates</span>
          </div>
          <button
            onClick={fetchHelmetsData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Helmets</p>
              <p className="text-2xl font-bold text-gray-900">{helmetsData.length}</p>
            </div>
            <Shield className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Safe</p>
              <p className="text-2xl font-bold text-green-600">{statusCounts.safe || 0}</p>
            </div>
            <div className="h-3 w-3 bg-green-500 rounded-full"></div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Warning</p>
              <p className="text-2xl font-bold text-yellow-600">{statusCounts.warning || 0}</p>
            </div>
            <div className="h-3 w-3 bg-yellow-500 rounded-full"></div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Critical</p>
              <p className="text-2xl font-bold text-red-600">{statusCounts.critical || 0}</p>
            </div>
            <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, helmet ID, location, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="safe">Safe</option>
                <option value="warning">Warning</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Helmets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHelmets.map((helmet) => (
          <div key={helmet.helmetId} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`h-3 w-3 rounded-full ${getStatusDot(helmet.status)}`}></div>
                <div>
                  <h3 className="font-semibold text-gray-900">{helmet.employeeName}</h3>
                  <p className="text-sm text-gray-600">{helmet.helmetId}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(helmet.status)}`}>
                {helmet.status.toUpperCase()}
              </span>
            </div>

            {/* Employee Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{helmet.department}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{helmet.location}</span>
              </div>
            </div>

            {/* Sensor Readings */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Thermometer className={`h-5 w-5 mx-auto mb-1 ${getTempColor(helmet.temperature)}`} />
                <div className={`text-sm font-semibold ${getTempColor(helmet.temperature)}`}>{helmet.temperature.toFixed(1)}°C</div>
                <div className="text-xs text-gray-600">Temperature</div>
                {helmet.tempAlert && <div className="text-xs text-red-600 font-medium">ALERT</div>}
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Droplets className={`h-5 w-5 mx-auto mb-1 ${getHumidityColor(helmet.humidity)}`} />
                <div className={`text-sm font-semibold ${getHumidityColor(helmet.humidity)}`}>{helmet.humidity.toFixed(1)}%</div>
                <div className="text-xs text-gray-600">Humidity</div>
                {helmet.humidityAlert && <div className="text-xs text-red-600 font-medium">ALERT</div>}
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg col-span-2">
                <AlertTriangle className={`h-5 w-5 mx-auto mb-1 ${getGasLevelColor(helmet.gasLevel)}`} />
                <div className={`text-sm font-semibold ${getGasLevelColor(helmet.gasLevel)}`}>{helmet.gasLevel} ppm</div>
                <div className="text-xs text-gray-600">Gas Level</div>
                {helmet.gasAlert && <div className="text-xs text-red-600 font-medium">GAS ALERT</div>}
              </div>
            </div>

            {/* Alerts */}
            {helmet.panicAlert && (
              <div className="mb-4 p-2 bg-red-100 border border-red-300 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium text-red-800">PANIC ALERT ACTIVATED</span>
                </div>
              </div>
            )}

            {/* Last Update */}
            <div className="flex items-center justify-between text-xs text-gray-600 mb-4">
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>Last Update:</span>
              </div>
              <span className="font-medium">{helmet.lastUpdate}</span>
            </div>

            {/* Action Button */}
            <div className="pt-4 border-t border-gray-200">
              <button className="w-full bg-blue-50 text-blue-700 py-2 px-4 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredHelmets.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No helmets found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default AlertsCharts;

// export default AlertsCharts;
