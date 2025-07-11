import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { XCircle, AlertCircle, CheckCircle, Search, Filter, FileText, User, MapPin, Activity, Clock } from 'lucide-react';

const API_BASE_URL = 'http://localhost:3061/api/sensors';

// Hardcoded Thresholds (Client-side, for display/comparison if needed)
const TEMP_THRESHOLD = 35.0;
const HUMIDITY_THRESHOLD = 80.0;
const GAS_THRESHOLD = 900;

const AlertTab = ({ activeTab }) => {
  const [alertHistory, setAlertHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Placeholder functions, as they are not directly used in the AlertTab component's core logic
  const fetchOverviewAnalytics = useCallback(() => console.log('Fetching overview analytics...'), []);
  const fetchSafetyTrends = useCallback(() => console.log('Fetching safety trends...'), []);
  const fetchMinerPerformance = useCallback(() => console.log('Fetching miner performance...'), []);

  const fetchAlertHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const alertHistoryResponse = await axios.get(`${API_BASE_URL}/alerts/history`);

      if (alertHistoryResponse.data.success) {
        const alerts = alertHistoryResponse.data.data;

        const helmetIds = [...new Set(alerts.map((alert) => alert.helmetId).filter((id) => id))];

        const helmetAssignmentPromises = helmetIds.map((id) => axios.get(`${API_BASE_URL}/assignments/helmet/${id}`));
        const helmetAssignmentResponses = await Promise.allSettled(helmetAssignmentPromises);

        const helmetToEmployeeMap = {};
        helmetAssignmentResponses.forEach((result, index) => {
          if (result.status === 'fulfilled' && result.value.data.success) {
            const helmetId = helmetIds[index];
            helmetToEmployeeMap[helmetId] = result.value.data.data.employeeName;
          } else {
            console.warn(`Failed to fetch assignment for helmet ${helmetIds[index]}:`, result.reason);
          }
        });

        const sensorDataResponse = await axios.get(`${API_BASE_URL}/sensor-data`);
        const helmetToLocationMap = {};

        if (sensorDataResponse.data.success && sensorDataResponse.data.data) {
          const sensorData = sensorDataResponse.data.data;
          for (const helmetId in sensorData) {
            if (Object.prototype.hasOwnProperty.call(sensorData, helmetId)) {
              const helmetData = sensorData[helmetId];
              if (helmetData && helmetData.latest && helmetData.location) {
                helmetToLocationMap[helmetId] = helmetData.location;
              }
            }
          }
        } else {
          console.warn('Failed to fetch all sensor data for locations or data is empty.');
        }

        const enrichedAlerts = alerts.map((alert) => {
          const enriched = {
            ...alert,
            miner: helmetToEmployeeMap[alert.helmetId] || 'Unknown Miner',
            location: helmetToLocationMap[alert.helmetId] || 'Unknown Location',
            timestamp: alert.timestampFormatted || new Date(parseInt(alert.timestamp) * 1000).toLocaleString(),
            duration: "5 seconds" || 'N/A'
            // alert.duration
          };
          return enriched;
        });

        console.log('Final alert history for state (in fetchAlertHistory):', enrichedAlerts);
        setAlertHistory(enrichedAlerts);
      } else {
        console.warn('API returned success: false for alert history. No data loaded.');
        setAlertHistory([]);
      }
    } catch (err) {
      console.error('Error fetching alert history or related data:', err);
      setError(err.message || 'Failed to fetch alert history and related data.');
      setAlertHistory([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'alerts') {
      fetchAlertHistory();
    }
  }, [activeTab, fetchAlertHistory]);

  const getAlertIcon = (alertType) => {
    const normalizedType = (alertType || '').toUpperCase();
    switch (normalizedType) {
      case 'CRITICAL':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'WARNING':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'EMERGENCY':
        return <AlertCircle className="w-5 h-5 text-purple-500" />;
      case 'INFO':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'PANIC':
        return <AlertCircle className="w-5 h-5 text-red-700" />;
      case 'TEMPERATURE':
        return <Activity className="w-5 h-5 text-red-500" />;
      case 'HUMIDITY':
        return <Activity className="w-5 h-5 text-blue-500" />;
      case 'GASALERT':
        return <Activity className="w-5 h-5 text-orange-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getAlertBadgeColor = (alertType) => {
    const normalizedType = (alertType || '').toUpperCase();
    switch (normalizedType) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'WARNING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'EMERGENCY':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'INFO':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PANIC':
        return 'bg-red-200 text-red-900 border-red-300';
      case 'TEMPERATURE':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'HUMIDITY':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'GASALERT':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSensorValueDisplay = (alert) => {
    const normalizedAlertType = (alert.alertType || '').toUpperCase();

    switch (normalizedAlertType) {
      case 'TEMPERATURE':
        if (alert.temperature !== undefined && alert.temperature !== null) {
          const tempValue = parseFloat(alert.temperature);
          if (!isNaN(tempValue)) {
            return `Temperature: ${tempValue}°C | Threshold: ${alert.threshold || TEMP_THRESHOLD}°C`;
          }
        }
        break;
      case 'HUMIDITY':
        if (alert.humidity !== undefined && alert.humidity !== null) {
          const humidityValue = parseFloat(alert.humidity);
          if (!isNaN(humidityValue)) {
            return `Humidity: ${humidityValue}% | Threshold: ${alert.threshold || HUMIDITY_THRESHOLD}%`;
          }
        }
        break;
      case 'GASALERT':
        if (alert.gasLevel !== undefined && alert.gasLevel !== null) {
          const gasValue = parseFloat(alert.gasLevel);
          if (!isNaN(gasValue)) {
            return `Gas Level: ${gasValue} PPM | Threshold: ${alert.threshold || GAS_THRESHOLD} PPM`;
          }
        }
        break;
      case 'PANIC':
        return null;
      default:
        return null;
    }
    return null;
  };

  // --- NEW FUNCTIONALITY FOR REPORT GENERATION ---
  const handleGenerateReport = () => {
    if (alertHistory.length === 0) {
      alert('No alerts to generate a report for.');
      return;
    }

    // Define CSV headers - ensure these match the properties you want in your report
    const headers = [
      'Alert ID',
      'Alert Type',
      'Message',
      'Miner',
      'Helmet ID',
      'Location',
      'Timestamp',
      'Duration',
      'Resolved',
      'Resolved By',
      'Humidity',
      'Temperature',
      'Gas Level',
      'Severity',
      'Acknowledged',
      'Threshold'
    ];

    // Map alert objects to CSV rows
    const csvRows = alertHistory.map((alert) => {
      // Helper to safely get a property and handle commas within values
      const getValue = (key, defaultValue = '') => {
        let value = alert[key] !== undefined && alert[key] !== null ? alert[key] : defaultValue;
        // For string values, ensure they are quoted if they contain commas
        if (typeof value === 'string' && value.includes(',')) {
          value = `"${value.replace(/"/g, '""')}"`; // Handle double quotes inside string
        }
        return value;
      };

      return [
        getValue('id'),
        getValue('alertType'),
        getValue('message'),
        getValue('miner'),
        getValue('helmetId'),
        getValue('location'),
        getValue('timestampFormatted'), // Use the formatted timestamp
        getValue('duration'),
        getValue('resolved') ? 'Yes' : 'No', // Convert boolean to Yes/No
        getValue('resolvedBy', 'N/A'),
        getValue('humidity', 'N/A'),
        getValue('temperature', 'N/A'),
        getValue('gasLevel', 'N/A'),
        getValue('severity', 'N/A'), // Assuming 'severity' exists from Firebase
        getValue('acknowledged') ? 'Yes' : 'No', // Assuming 'acknowledged' exists from Firebase
        // Use alert.threshold if available, otherwise default hardcoded one, otherwise 'N/A'
        getValue(
          'threshold',
          alert.alertType?.toUpperCase() === 'HUMIDITY'
            ? HUMIDITY_THRESHOLD
            : alert.alertType?.toUpperCase() === 'TEMPERATURE'
              ? TEMP_THRESHOLD
              : alert.alertType?.toUpperCase() === 'GASALERT'
                ? GAS_THRESHOLD
                : 'N/A'
        )
      ].join(','); // Join values with commas for CSV row
    });

    // Combine headers and rows
    const csvContent = [
      headers.join(','), // CSV header row
      ...csvRows // All data rows
    ].join('\n'); // Join all rows with newlines

    // Create a Blob from the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    // Create a temporary URL for the Blob and trigger download
    const link = document.createElement('a');
    if (link.download !== undefined) {
      // Feature detection for download attribute
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `alert_report_${new Date().toISOString().slice(0, 10)}.csv`);
      link.style.visibility = 'hidden'; // Hide the link
      document.body.appendChild(link); // Append to body to make it clickable
      link.click(); // Programmatically click the link
      document.body.removeChild(link); // Clean up
      URL.revokeObjectURL(url); // Release the URL object
    } else {
      // Fallback for older browsers or specific conditions
      alert('Your browser does not support downloading files directly. Please copy the content below:\n\n' + csvContent);
    }
  };
  // --- END NEW FUNCTIONALITY ---

  const AlertsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search alerts..."
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="all">All Types</option>
              <option value="CRITICAL">Critical</option>
              <option value="WARNING">Warning</option>
              <option value="EMERGENCY">Emergency</option>
              <option value="INFO">Info</option>
              <option value="PANIC">Panic Alert</option>
              <option value="TEMPERATURE">Temperature Alert</option>
              <option value="HUMIDITY">Humidity Alert</option>
              <option value="GASALERT">Gas Alert</option>
              <option value="UNKNOWN">Unknown</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="all">All Status</option>
              <option value="resolved">Resolved</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {/* Button for report generation */}
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            onClick={handleGenerateReport} // Attach the handler here
          >
            <FileText className="w-4 h-4" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {loading && <p>Loading Alerts...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && !error && alertHistory.length === 0 && (
        <div className="p-6 text-gray-500 text-center bg-white rounded-xl border border-gray-200 shadow-sm">No alerts to display.</div>
      )}
      {!loading && !error && alertHistory.length > 0 && (
        <>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Alert History</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {alertHistory.map((alert) => {
                const sensorDisplay = getSensorValueDisplay(alert);
                return (
                  <div key={alert.timestamp + '-' + alert.helmetId + '-' + alert.alertType} className="p-6 hover:bg-gray-50">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">{getAlertIcon(alert.alertType)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <h4 className="text-sm font-medium text-gray-900">{alert.message}</h4>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getAlertBadgeColor(alert.alertType)}`}>
                              {(alert.alertType || 'UNKNOWN').toUpperCase()}
                            </span>
                            {alert.resolved && (
                              <span className="px-2 py-1 text-xs font-medium rounded-full border bg-green-100 text-green-800 border-green-200">
                                RESOLVED
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">{alert.timestampFormatted}</div>
                        </div>

                        <div className="mt-2 text-sm text-gray-600">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center">
                              <User className="w-4 h-4 mr-2" />
                              <span>
                                {alert.miner} ({alert.helmetId})
                              </span>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-2" />
                              <span>{alert.location}</span>
                            </div>
                            {/* Ensure duration is pulled from `alert.duration` or defaults as per backend */}
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-2" />
                              <span>Duration: {alert.duration}</span>
                            </div>
                          </div>

                          {sensorDisplay && (
                            <div className="mt-2 flex items-center">
                              <Activity className="w-4 h-4 mr-2" />
                              <span>{sensorDisplay}</span>
                            </div>
                          )}
                        </div>

                        {alert.resolved && alert.resolvedBy && (
                          <div className="mt-2 text-sm text-green-600">
                            <strong>Resolved by:</strong> {alert.resolvedBy}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div>
      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded-lg ${activeTab === 'alerts' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          onClick={() => {
            /* In a real app, you might change activeTab state here */
          }}
        >
          Alerts
        </button>
      </div>
      {activeTab === 'alerts' && <AlertsTab />}
    </div>
  );
};

export default AlertTab;
