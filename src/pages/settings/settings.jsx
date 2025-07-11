import React, { useState } from 'react';
import { Save, Bell, Shield, Database, Wifi, AlertTriangle } from 'lucide-react';

const Settings = () => {
  const [settings, setSettings] = useState({
    // Alert Thresholds
    temperatureWarning: 30,
    temperatureCritical: 35,
    oxygenWarning: 19,
    oxygenCritical: 18,
    heartRateWarning: 100,
    heartRateCritical: 120,
    gasLevelWarning: 0.05,
    gasLevelCritical: 0.1,
    
    // Notification Settings
    emailAlerts: true,
    smsAlerts: true,
    soundAlerts: true,
    pushNotifications: true,
    
    // System Settings
    dataRetention: 365,
    updateInterval: 2,
    autoBackup: true,
    maintenanceMode: false,
    
    // Network Settings
    wifiSSID: 'MineNetwork',
    loraFrequency: 915,
    transmissionPower: 20
  });

  const handleInputChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    // In production, this would save to your backend/Firebase
    console.log('Saving settings:', settings);
    alert('Settings saved successfully!');
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600">Configure safety thresholds and system parameters</p>
        </div>
        <button
          onClick={handleSave}
          className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
        >
          <Save className="h-5 w-5" />
          <span>Save Changes</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alert Thresholds */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <AlertTriangle className="h-6 w-6 text-warning-500" />
            <h2 className="text-xl font-semibold text-gray-900">Alert Thresholds</h2>
          </div>

          <div className="space-y-6">
            {/* Temperature */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Temperature (°C)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Warning Level</label>
                  <input
                    type="number"
                    value={settings.temperatureWarning}
                    onChange={(e) => handleInputChange('temperatureWarning', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Critical Level</label>
                  <input
                    type="number"
                    value={settings.temperatureCritical}
                    onChange={(e) => handleInputChange('temperatureCritical', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Oxygen */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Oxygen Level (%)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Warning Level</label>
                  <input
                    type="number"
                    step="0.1"
                    value={settings.oxygenWarning}
                    onChange={(e) => handleInputChange('oxygenWarning', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Critical Level</label>
                  <input
                    type="number"
                    step="0.1"
                    value={settings.oxygenCritical}
                    onChange={(e) => handleInputChange('oxygenCritical', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Heart Rate */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Heart Rate (BPM)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Warning Level</label>
                  <input
                    type="number"
                    value={settings.heartRateWarning}
                    onChange={(e) => handleInputChange('heartRateWarning', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Critical Level</label>
                  <input
                    type="number"
                    value={settings.heartRateCritical}
                    onChange={(e) => handleInputChange('heartRateCritical', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Gas Level */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Gas Level (ppm)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Warning Level</label>
                  <input
                    type="number"
                    step="0.01"
                    value={settings.gasLevelWarning}
                    onChange={(e) => handleInputChange('gasLevelWarning', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Critical Level</label>
                  <input
                    type="number"
                    step="0.01"
                    value={settings.gasLevelCritical}
                    onChange={(e) => handleInputChange('gasLevelCritical', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Bell className="h-6 w-6 text-primary-500" />
            <h2 className="text-xl font-semibold text-gray-900">Notification Settings</h2>
          </div>

          <div className="space-y-4">
            {[
              { key: 'emailAlerts', label: 'Email Alerts', description: 'Send alerts via email' },
              { key: 'smsAlerts', label: 'SMS Alerts', description: 'Send critical alerts via SMS' },
              { key: 'soundAlerts', label: 'Sound Alerts', description: 'Play audio alerts in control room' },
              { key: 'pushNotifications', label: 'Push Notifications', description: 'Browser push notifications' }
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">{item.label}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
                <button
                  onClick={() => handleInputChange(item.key, !settings[item.key])}
                  className={`w-12 h-6 rounded-full relative transition-colors ${
                    settings[item.key] ? 'bg-primary-500' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                      settings[item] ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* System Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Database className="h-6 w-6 text-success-500" />
            <h2 className="text-xl font-semibold text-gray-900">System Settings</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Data Retention (days)</label>
              <input
                type="number"
                value={settings.dataRetention}
                onChange={(e) => handleInputChange('dataRetention', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Update Interval (seconds)</label>
              <input
                type="number"
                value={settings.updateInterval}
                onChange={(e) => handleInputChange('updateInterval', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Auto Backup</h3>
                <p className="text-sm text-gray-600">Automatically backup data daily</p>
              </div>
              <button
                onClick={() => handleInputChange('autoBackup', !settings.autoBackup)}
                className={`w-12 h-6 rounded-full relative transition-colors ${
                  settings.autoBackup ? 'bg-primary-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                    settings.autoBackup ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Maintenance Mode</h3>
                <p className="text-sm text-gray-600">Enable for system maintenance</p>
              </div>
              <button
                onClick={() => handleInputChange('maintenanceMode', !settings.maintenanceMode)}
                className={`w-12 h-6 rounded-full relative transition-colors ${
                  settings.maintenanceMode ? 'bg-warning-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                    settings.maintenanceMode ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Network Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Wifi className="h-6 w-6 text-primary-500" />
            <h2 className="text-xl font-semibold text-gray-900">Network Settings</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">WiFi SSID</label>
              <input
                type="text"
                value={settings.wifiSSID}
                onChange={(e) => handleInputChange('wifiSSID', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">LoRa Frequency (MHz)</label>
              <input
                type="number"
                value={settings.loraFrequency}
                onChange={(e) => handleInputChange('loraFrequency', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Transmission Power (dBm)</label>
              <input
                type="number"
                value={settings.transmissionPower}
                onChange={(e) => handleInputChange('transmissionPower', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Shield className="h-6 w-6 text-danger-500" />
          <h2 className="text-xl font-semibold text-gray-900">Security Settings</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Access Control</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                Manage User Accounts
              </button>
              <button className="w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                Reset Admin Password
              </button>
              <button className="w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                View Access Logs
              </button>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-3">Data Security</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                Export Data
              </button>
              <button className="w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                Clear Historical Data
              </button>
              <button className="w-full text-left px-4 py-2 bg-danger-50 hover:bg-danger-100 text-danger-700 rounded-lg transition-colors">
                Factory Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;