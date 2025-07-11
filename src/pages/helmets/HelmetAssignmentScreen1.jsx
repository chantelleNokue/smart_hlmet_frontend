import React, { useState, useEffect } from 'react';
import { Search, UserPlus, UserMinus, RefreshCw, AlertCircle, CheckCircle, HardHat, Users, MapPin, Database } from 'lucide-react';

const HelmetAssignmentScreen = () => {
  const [helmets, setHelmets] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedHelmet, setSelectedHelmet] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [newLocation, setNewLocation] = useState('');
  const [assignLoading, setAssignLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // State for new assignment details
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [assignedBy, setAssignedBy] = useState('Admin');
  const [shiftStart, setShiftStart] = useState('');
  const [shiftEnd, setShiftEnd] = useState('');
  const [unassignedReason, setUnassignedReason] = useState('');

  // Base API URL - adjust this to match your backend
  const API_BASE = 'http://localhost:3061/api/sensors'; // Update this to your actual API base URL

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      // --- Fetch sensor data (helmets) ---
      const sensorDataRes = await fetch(`${API_BASE}/sensor-data`);
      const sensorResponse = await sensorDataRes.json();

      const uniqueHelmets = [];
      const helmetMap = new Map();

      const helmetRawData = sensorResponse.data || sensorResponse;

      if (helmetRawData && typeof helmetRawData === 'object' && !Array.isArray(helmetRawData)) {
        Object.keys(helmetRawData).forEach(helmetKey => {
          const helmetData = helmetRawData[helmetKey];
          if (helmetKey.startsWith('helmet_')) {
            const assignedTo = helmetData.assignment?.employeeId || null;
            const assignedEmployeeName = helmetData.assignment?.employeeName || null;
            const status = assignedTo ? 'assigned' : 'unassigned';
            const location = helmetData.latest?.location || helmetData.location || null;
            const totalRecords = helmetData.system?.totalRecords || 'N/A';

            const helmet = {
              id: helmetKey,
              serialNumber: helmetKey,
              assignedTo: assignedTo,
              assignedEmployeeName: assignedEmployeeName,
              status: status,
              location: location,
              totalRecords: totalRecords
            };
            uniqueHelmets.push(helmet);
          }
        });
      } else if (Array.isArray(helmetRawData)) {
        helmetRawData.forEach(data => {
          if (data.helmetId && !helmetMap.has(data.helmetId)) {
            const assignedTo = data.assignedTo || null;
            const assignedEmployeeName = data.assignedEmployeeName || null;
            const status = assignedTo ? 'assigned' : 'unassigned';
            const location = data.location || null;
            const totalRecords = data.totalRecords || 'N/A';

            const helmet = {
              id: data.helmetId,
              serialNumber: data.helmetId,
              assignedTo: assignedTo,
              assignedEmployeeName: assignedEmployeeName,
              status: status,
              location: location,
              totalRecords: totalRecords
            };
            helmetMap.set(data.helmetId, helmet);
            uniqueHelmets.push(helmet);
          }
        });
      }

      setHelmets(uniqueHelmets);

      // --- Fetch employees ---
      try {
        const employeesRes = await fetch(`${API_BASE}/employees`);
        if (employeesRes.ok) {
          const employeesResponseJson = await employeesRes.json();
          let employeesArray = Array.isArray(employeesResponseJson.data)
            ? employeesResponseJson.data
            : [];

          const formattedEmployees = employeesArray.map(emp => {
            const id = emp.employeeId;
            return {
              ...emp,
              id: id,
              firstName: emp.first_name || 'Unknown',
              lastName: emp.last_name || 'Employee'
            };
          });

          const validEmployees = formattedEmployees.filter(emp => emp.id && emp.firstName !== 'Unknown' && emp.lastName !== 'Employee');
          setEmployees(validEmployees);
        } else {
          setEmployees([]);
          console.error('Failed to fetch employees, status:', employeesRes.status);
        }
      } catch (err) {
        console.error('Error fetching employees:', err);
        setEmployees([]);
      }

    } catch (err) {
      setError('Failed to fetch helmet data. Please check your API connection.');
      console.error('Error fetching overall data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignHelmet = async () => {
    setAssignLoading(true);
    setError('');
    setSuccess('');

    if (!selectedHelmet || !selectedEmployeeId || !assignedBy || !shiftStart || !shiftEnd) {
      setError('Please fill all assignment details: Employee, Assigned By, Shift Start, and Shift End.');
      setAssignLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/assignments/helmet/${selectedHelmet.id}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          employeeId: selectedEmployeeId,
          assignedBy: assignedBy,
          shiftStart: new Date(shiftStart).getTime(),
          shiftEnd: new Date(shiftEnd).getTime()
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Assignment failed');
      }

      setSuccess('Helmet assigned successfully!');
      setShowAssignModal(false);
      setSelectedHelmet(null);
      setSelectedEmployeeId('');
      setShiftStart('');
      setShiftEnd('');
      fetchData();

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(`Failed to assign helmet: ${err.message}. Please try again.`);
      console.error('Error assigning helmet:', err);
    } finally {
      setAssignLoading(false);
    }
  };

  const handleUnassignHelmet = async (helmetId) => {
    setAssignLoading(true);
    setError('');
    setSuccess('');

    const unassignedByAgent = 'System';

    try {
      const response = await fetch(`${API_BASE}/assignments/helmet/${helmetId}/unassign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          unassignedBy: unassignedByAgent,
          reason: unassignedReason || 'Manually unassigned from dashboard'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Unassignment failed');
      }

      setSuccess('Helmet unassigned successfully!');
      setUnassignedReason('');
      fetchData();

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(`Failed to unassign helmet: ${err.message}. Please try again.`);
      console.error('Error unassigning helmet:', err);
    } finally {
      setAssignLoading(false);
    }
  };

  const handleUpdateLocation = async () => {
    setAssignLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_BASE}/helmets/${selectedHelmet.id}/location`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ location: newLocation })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update location');
      }

      setSuccess('Helmet location updated successfully!');
      setShowLocationModal(false);
      setSelectedHelmet(null);
      setNewLocation('');
      fetchData();

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(`Failed to update helmet location: ${err.message}. Please try again.`);
      console.error('Error updating location:', err);
    } finally {
      setAssignLoading(false);
    }
  };

  const filteredHelmets = helmets.filter((helmet) => {
    const matchesSearch =
      helmet.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      helmet.assignedEmployeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      helmet.location?.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterStatus === 'assigned') return helmet.status === 'assigned' && matchesSearch;
    if (filterStatus === 'unassigned') return helmet.status === 'unassigned' && matchesSearch;
    return matchesSearch;
  });

  const assignedCount = helmets.filter((helmet) => helmet.status === 'assigned').length;
  const unassignedCount = helmets.length - assignedCount;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2 text-lg">Loading helmet data...</span>
      </div>
    );
  }

  const formatDateTimeLocal = (date) => {
    if (!date) return '';
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar (Enhanced) */}
      <header className="bg-white shadow-sm border-b border-gray-200 py-4 px-6 flex justify-between items-center w-full">
        <div className="flex items-center">
          <HardHat className="w-6 h-6 text-blue-600 mr-2" />
          <h1 className="text-xl font-semibold text-gray-800">Helmet Management</h1>
        </div>
        <div className="flex items-center space-x-4">
          <a href="#" className="text-gray-600 hover:text-gray-900">
            <RefreshCw className="w-5 h-5" />
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900">
            <Users className="w-5 h-5" />
          </a>
          <div className="relative">
            <button className="flex items-center text-gray-700 hover:text-gray-900 focus:outline-none">
              <img
                className="w-8 h-8 rounded-full mr-2"
                src="https://api.dicebear.com/7.x/initials/svg?seed=CM" // Placeholder for user avatar
                alt="User Avatar"
              />
              <span className="font-medium">Chantelle Malbura</span>
            </button>
            {/* Dropdown would go here */}
          </div>
        </div>
      </header>

      <div className="p-8 w-full"> {/* Removed max-w-7xl, added w-full and increased padding */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Helmet Assignment and Tracking</h1> {/* Increased font size */}
          <p className="text-lg text-gray-600">Manage helmet assignments and track their locations for employees and miners</p>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            {success}
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8"> {/* Adjusted for better responsiveness */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <HardHat className="w-8 h-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Helmets</p>
                <p className="text-2xl font-bold text-gray-900">{helmets.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Assigned</p>
                <p className="text-2xl font-bold text-gray-900">{assignedCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <AlertCircle className="w-8 h-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Unassigned</p>
                <p className="text-2xl font-bold text-gray-900">{unassignedCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Employees</p>
                <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 relative w-full md:w-auto"> {/* Ensured search takes full width on small screens */}
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by helmet ID, employee, or location..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-4 w-full md:w-auto justify-end"> {/* Aligned to right on larger screens */}
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-auto"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Helmets</option>
                <option value="assigned">Assigned Only</option>
                <option value="unassigned">Unassigned Only</option>
              </select>

              <button
                onClick={fetchData}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center w-full md:w-auto justify-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Helmets List */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Helmets ({filteredHelmets.length})</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Helmet ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Records</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredHelmets.map((helmet) => {
                  return (
                    <tr key={helmet.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <HardHat className="w-8 h-8 text-gray-400 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{helmet.serialNumber}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            helmet.status === 'assigned' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                          }`}
                        >
                          {helmet.status === 'assigned' ? 'Assigned' : 'Unassigned'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {helmet.assignedEmployeeName || helmet.assignedTo || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                          {helmet.location || 'N/A'}
                          <button
                            onClick={() => {
                              setSelectedHelmet(helmet);
                              setNewLocation(helmet.location || '');
                              setShowLocationModal(true);
                            }}
                            className="ml-2 p-1 rounded-full text-blue-500 hover:bg-blue-100"
                            title="Update Location"
                          >
                            <RefreshCw className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <Database className="w-4 h-4 mr-1 text-gray-400" />
                          {helmet.totalRecords}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {helmet.status === 'assigned' ? (
                          <button
                            onClick={() => handleUnassignHelmet(helmet.id)}
                            disabled={assignLoading}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                          >
                            <UserMinus className="w-4 h-4 mr-1" />
                            Unassign
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedHelmet(helmet);
                              setSelectedEmployeeId('');
                              setAssignedBy('Admin');
                              const now = new Date();
                              setShiftStart(formatDateTimeLocal(now));
                              const eightHoursLater = new Date(now.getTime() + 8 * 60 * 60 * 1000);
                              setShiftEnd(formatDateTimeLocal(eightHoursLater));
                              setShowAssignModal(true);
                            }}
                            disabled={assignLoading || employees.length === 0}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                          >
                            <UserPlus className="w-4 h-4 mr-1" />
                            Assign
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredHelmets.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <HardHat className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No helmets found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>

        {/* Assignment Modal */}
        {showAssignModal && selectedHelmet && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
            <div className="relative p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Assign Helmet: {selectedHelmet.serialNumber}</h3>

                {employees.length === 0 ? (
                  <div className="text-center py-4 text-gray-600">
                    <p>No employees found in the system. Please add employees first.</p>
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      <label htmlFor="employee-select" className="block text-sm font-medium text-gray-700 mb-1">Select Employee</label>
                      <select
                        id="employee-select"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={selectedEmployeeId}
                        onChange={(e) => {
                          setSelectedEmployeeId(e.target.value);
                        }}
                      >
                        <option value="">-- Select Employee --</option>
                        {employees.map((employee) => (
                          <option key={employee.id} value={employee.id}>
                            {employee.firstName} {employee.lastName}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-4">
                      <label htmlFor="assigned-by" className="block text-sm font-medium text-gray-700 mb-1">
                        Assigned By
                      </label>
                      <input
                        type="text"
                        id="assigned-by"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                        value={assignedBy}
                        onChange={(e) => setAssignedBy(e.target.value)}
                        readOnly
                      />
                    </div>

                    <div className="mb-4">
                      <label htmlFor="shift-start" className="block text-sm font-medium text-gray-700 mb-1">
                        Shift Start
                      </label>
                      <input
                        type="datetime-local"
                        id="shift-start"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={shiftStart}
                        onChange={(e) => setShiftStart(e.target.value)}
                      />
                    </div>

                    <div className="mb-4">
                      <label htmlFor="shift-end" className="block text-sm font-medium text-gray-700 mb-1">
                        Shift End
                      </label>
                      <input
                        type="datetime-local"
                        id="shift-end"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={shiftEnd}
                        onChange={(e) => setShiftEnd(e.target.value)}
                      />
                    </div>
                  </>
                )}

                <div className="flex justify-end mt-4 space-x-3">
                  <button
                    onClick={() => {
                      setShowAssignModal(false);
                      setSelectedHelmet(null);
                      setSelectedEmployeeId('');
                      setShiftStart('');
                      setShiftEnd('');
                      setError('');
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAssignHelmet}
                    disabled={assignLoading || !selectedEmployeeId || !assignedBy || !shiftStart || !shiftEnd}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                  >
                    {assignLoading ? 'Assigning...' : 'Assign Helmet'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Location Update Modal */}
        {showLocationModal && selectedHelmet && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
            <div className="relative p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Update Location for: {selectedHelmet.serialNumber}</h3>
                <input
                  type="text"
                  placeholder="Enter new location"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                />
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowLocationModal(false);
                      setSelectedHelmet(null);
                      setNewLocation('');
                      setError('');
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateLocation}
                    disabled={assignLoading || !newLocation.trim()}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                  >
                    {assignLoading ? 'Updating...' : 'Update Location'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HelmetAssignmentScreen;