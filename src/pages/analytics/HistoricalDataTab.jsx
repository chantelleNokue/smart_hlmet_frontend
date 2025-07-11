import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { HardHat, User, Download } from 'lucide-react';
import moment from 'moment';

const API_BASE_URL = 'http://localhost:3061/api/sensors';

const HistoricalTab = ({ activeTab }) => {
    const [selectedHelmet, setSelectedHelmet] = useState('all');
    const [assignmentHistoryData, setAssignmentHistoryData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [helmets, setHelmets] = useState([]);

    // Effect to fetch available helmets (IDs) for the dropdown
    useEffect(() => {
        const fetchAvailableHelmets = async () => {
            console.log("Fetching available helmets...");
            try {
                const assignmentsResponse = await axios.get(`${API_BASE_URL}/assignments`);
                let uniqueHelmetIds = [];

                if (assignmentsResponse.data.success && Array.isArray(assignmentsResponse.data.data)) {
                    uniqueHelmetIds.push(...new Set(assignmentsResponse.data.data.map(assign => assign.helmetId)));
                    console.log("Helmets from /assignments:", uniqueHelmetIds);
                } else {
                    console.warn('API returned unexpected data for /assignments when fetching helmets for dropdown:', assignmentsResponse.data);
                }

                if (uniqueHelmetIds.length === 0) {
                     const sensorDataResponse = await axios.get(`${API_BASE_URL}/sensor-data`);
                    if (sensorDataResponse.data.success && typeof sensorDataResponse.data.data === 'object' && sensorDataResponse.data.data !== null) {
                        uniqueHelmetIds.push(...Object.keys(sensorDataResponse.data.data));
                        console.log("Helmets from /sensor-data (fallback):", uniqueHelmetIds);
                    } else {
                        console.warn('API returned unexpected data for /sensor-data (fallback):', sensorDataResponse.data);
                    }
                }

                setHelmets([...new Set(uniqueHelmetIds)].sort()); // Ensure unique and sorted
                console.log("Final helmets set in state:", [...new Set(uniqueHelmetIds)].sort());

            } catch (err) {
                console.error('Error fetching available helmets for dropdown:', err);
                setHelmets([]);
            }
        };
        fetchAvailableHelmets();
    }, []);

    const fetchAssignmentHistory = useCallback(async () => {
        setLoading(true);
        setError(null);
        let combinedHistory = [];

        console.log("Fetching assignment history for helmet:", selectedHelmet);
        console.log("Current helmets in state for 'all' check:", helmets);

        try {
            const employeesResponse = await axios.get(`${API_BASE_URL}/employees`);
            const employeesMap = new Map();
            if (employeesResponse.data.success && Array.isArray(employeesResponse.data.data)) {
                employeesResponse.data.data.forEach(emp => {
                    employeesMap.set(emp.employeeId || emp.id, `${emp.first_name || ''} ${emp.last_name || emp.name || ''}`.trim());
                });
                console.log("Employees Map:", employeesMap);
            } else {
                console.warn('API returned unexpected data for /employees:', employeesResponse.data);
            }

            if (selectedHelmet === 'all') {
                if (helmets.length === 0) {
                    console.warn("No helmets available to fetch history for 'all' option. Please ensure helmets state is populated.");
                    setAssignmentHistoryData([]);
                    setLoading(false);
                    return;
                }

                const allHistoryPromises = helmets.map(helmetId =>
                    axios.get(`${API_BASE_URL}/assignments/history/${helmetId}`)
                );
                const allHistoryResponses = await Promise.allSettled(allHistoryPromises);

                allHistoryResponses.forEach((result, index) => {
                    const helmetIdFromRequest = helmets[index];
                    if (result.status === 'fulfilled') {
                        const response = result.value;
                        if (response.data.success && response.data.data) {
                            const historyForHelmet = Object.values(response.data.data).map(item => ({
                                ...item,
                                helmetId: item.helmetId || helmetIdFromRequest,
                                employeeName: employeesMap.get(item.employeeId) || 'Unknown Employee'
                            }));
                            combinedHistory.push(...historyForHelmet);
                            console.log(`Fetched history for ${helmetIdFromRequest}:`, historyForHelmet);
                        } else {
                            console.warn(`API returned unexpected or empty data for history of helmet ${helmetIdFromRequest}:`, response.data);
                        }
                    } else {
                        console.error(`Failed to fetch history for helmet ${helmetIdFromRequest}:`, result.reason);
                    }
                });

            } else {
                const response = await axios.get(`${API_BASE_URL}/assignments/history/${selectedHelmet}`);
                if (response.data.success && response.data.data) {
                    combinedHistory = Object.values(response.data.data).map(item => ({
                        ...item,
                        helmetId: item.helmetId || selectedHelmet,
                        employeeName: employeesMap.get(item.employeeId) || 'Unknown Employee'
                    }));
                    console.log(`Fetched history for specific helmet ${selectedHelmet}:`, combinedHistory);
                } else {
                    console.warn(`API returned unexpected or empty data for helmet ${selectedHelmet} assignment history:`, response.data);
                }
            }

            console.log("Combined History before sorting and setting state:", combinedHistory);

            combinedHistory.sort((a, b) => (b.assignedAt || 0) - (a.assignedAt || 0));

            setAssignmentHistoryData(combinedHistory);
            console.log("Assignment History Data set to state:", combinedHistory);

        } catch (err) {
            console.error('Error fetching assignment history (overall catch block):', err);
            setError(err.message || 'Failed to fetch assignment history.');
            setAssignmentHistoryData([]);
        } finally {
            setLoading(false);
        }
    }, [selectedHelmet, helmets]);

    // Trigger fetch when activeTab changes to 'historical' or filters change
    useEffect(() => {
        console.log("HistoricalTab useEffect triggered. activeTab:", activeTab); // ADDED
        if (activeTab === 'historical') {
            console.log("activeTab is 'historical', calling fetchAssignmentHistory."); // ADDED
            fetchAssignmentHistory();
        }
    }, [activeTab, selectedHelmet, fetchAssignmentHistory]);

    // --- NEW EXPORT LOGIC ---
    const handleExportData = () => {
        if (assignmentHistoryData.length === 0) {
            alert('No data to export!');
            return;
        }

        // Define CSV headers (must match the keys in your data objects or be explicitly mapped)
        const headers = [
            "Helmet ID",
            "Assigned Miner",
            "Assigned At",
            "Assigned By",
            "Unassigned At",
            "Unassigned By",
            "Reason",
            "Shift Start",
            "Shift End",
            "Status"
        ];

        // Map your data to the CSV format
        const csvRows = assignmentHistoryData.map(record => {
            return [
                record.helmetId || '',
                record.employeeName || '',
                record.assignedAt ? moment(record.assignedAt).format('YYYY-MM-DD HH:mm:ss') : '',
                record.assignedBy || '',
                record.unassignedAt ? moment(record.unassignedAt).format('YYYY-MM-DD HH:mm:ss') : '',
                record.unassignedBy || '',
                (record.reason || '').replace(/"/g, '""'), // Escape double quotes for CSV
                record.shiftStart ? moment(record.shiftStart).format('YYYY-MM-DD HH:mm:ss') : '',
                record.shiftEnd ? moment(record.shiftEnd).format('YYYY-MM-DD HH:mm:ss') : '',
                record.status || ''
            ].map(field => `"${field}"`).join(','); // Wrap each field in quotes and join by comma
        });

        // Combine headers and rows
        const csvContent = [
            headers.map(header => `"${header}"`).join(','), // Wrap headers in quotes too
            ...csvRows
        ].join('\n'); // Join rows with newline

        // Create a Blob and download it
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) { // Feature detection for download attribute
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            // Dynamic filename based on selection
            const filename = selectedHelmet === 'all'
                ? `assignment_history_all_helmets_${moment().format('YYYYMMDD_HHmmss')}.csv`
                : `assignment_history_${selectedHelmet}_${moment().format('YYYYMMDD_HHmmss')}.csv`;
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden'; // Hide the link
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link); // Clean up
            URL.revokeObjectURL(url); // Release the object URL
        } else {
            // Fallback for browsers that don't support the download attribute
            window.open('data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent));
            alert("Your browser does not fully support automatic downloads. Data will be opened in a new tab. Please save it manually.");
        }
    };
    // --- END NEW EXPORT LOGIC ---


    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center space-x-2">
                        <HardHat className="w-5 h-5 text-gray-500" />
                        <select
                            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={selectedHelmet}
                            onChange={(e) => setSelectedHelmet(e.target.value)}
                        >
                            <option value="all">All Helmets</option>
                            {helmets.map(helmetId => (
                                <option key={helmetId} value={helmetId}>
                                    {helmetId}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                        onClick={handleExportData} // ADDED onClick HANDLER
                    >
                        <Download className="w-4 h-4" />
                        <span>Export Data</span>
                    </button>
                </div>
            </div>

            {loading && <p className="text-center text-gray-600">Loading Assignment History...</p>}
            {error && <p className="text-center text-red-500">Error: {error}</p>}
            {!loading && !error && (
                <>
                    {/* Data Table for Assignment History */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Assignment History</h3>
                        <div className="overflow-x-auto">
                            {assignmentHistoryData.length > 0 ? (
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Helmet ID</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Miner</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned At</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned By</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unassigned At</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unassigned By</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shift Start</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shift End</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {assignmentHistoryData.map((record, index) => (
                                            <tr key={index}>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{record.helmetId}</td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{record.employeeName}</td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {record.assignedAt ? moment(record.assignedAt).format('YYYY-MM-DD HH:mm:ss') : 'N/A'}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{record.assignedBy || 'N/A'}</td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {record.unassignedAt ? moment(record.unassignedAt).format('YYYY-MM-DD HH:mm:ss') : 'N/A'}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{record.unassignedBy || 'N/A'}</td>
                                                <td className="px-4 py-4 text-sm text-gray-900">{record.reason || 'N/A'}</td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {record.shiftStart ? moment(record.shiftStart).format('YYYY-MM-DD HH:mm:ss') : 'N/A'}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {record.shiftEnd ? moment(record.shiftEnd).format('YYYY-MM-DD HH:mm:ss') : 'N/A'}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{record.status || 'N/A'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-center text-gray-500 py-8">No assignment history data available for the selected filters.</p>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default HistoricalTab;