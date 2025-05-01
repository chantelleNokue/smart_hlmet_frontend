"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { Modal, Typography, Space, Button, Badge, notification } from "antd"
import { WarningOutlined, ClockCircleOutlined, EnvironmentOutlined, IdcardOutlined } from "@ant-design/icons"

const { Text, Title } = Typography;

const EmergencyContext = createContext(undefined)

export function EmergencyProvider({ children }) {
  const [emergencyAlerts, setEmergencyAlerts] = useState([])
  const [currentAlert, setCurrentAlert] = useState(null)
  const [isAlertOpen, setIsAlertOpen] = useState(false)

  // Function to trigger a new emergency
  const triggerEmergency = (emergencyData) => {
    const newAlert = {
      id: Date.now(),
      ...emergencyData,
      acknowledged: false,
    }

    setEmergencyAlerts((prev) => [...prev, newAlert])
    setCurrentAlert(newAlert)
    setIsAlertOpen(true)

    // Play alert sound
    const audio = new Audio("/alert.mp3")
    audio.play().catch((e) => console.log("Audio play failed:", e))
    
    // Also show a notification
    notification.error({
      message: 'Emergency Alert',
      description: emergencyData.message,
      placement: 'topRight',
      duration: 0, // Does not auto-dismiss
      icon: <WarningOutlined style={{ color: '#ff4d4f' }} />,
    });
  }

  // Function to acknowledge an emergency alert
  const acknowledgeAlert = (alertId) => {
    setEmergencyAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, acknowledged: true } : alert)))
    setIsAlertOpen(false)
    
    // Close the matching notification
    notification.destroy(alertId.toString());
  }

  // Simulate helmet emergency button presses
  useEffect(() => {
    // This would be replaced by real-time data from helmet sensors in a production environment
    const simulateHelmetEmergency = () => {
      // Check for simulated helmet emergency button presses
      const checkForEmergencies = () => {
        // For demo purposes: 0.5% chance of a helmet emergency every 60 seconds
        if (Math.random() < 0.005) {
          const miners = [
            { id: 1, name: "John Smith", helmetId: "H-1001", section: "Section A" },
            { id: 2, name: "Sarah Johnson", helmetId: "H-1002", section: "Safety" },
            { id: 3, name: "Michael Brown", helmetId: "H-1003", section: "Section B" },
            { id: 4, name: "Emily Davis", helmetId: "H-1004", section: "Environmental" },
          ]

          const randomMiner = miners[Math.floor(Math.random() * miners.length)]

          triggerEmergency({
            location: randomMiner.section,
            timestamp: new Date().toISOString(),
            type: "Helmet Emergency Button",
            message: `Emergency button pressed on helmet ${randomMiner.helmetId} by ${randomMiner.name}. Immediate assistance required.`,
            minerId: randomMiner.id,
            helmetId: randomMiner.helmetId,
          })
        }
      }

      const interval = setInterval(checkForEmergencies, 60000) // Check every minute
      return () => clearInterval(interval)
    }

    const cleanup = simulateHelmetEmergency()
    return cleanup
  }, [])

  // Listen for environmental emergencies
  useEffect(() => {
    // Simulate receiving an environmental emergency alert
    const simulateEnvironmentalEmergency = () => {
      // 0.3% chance of environmental emergency every 2 minutes
      if (Math.random() < 0.003) {
        const locations = ["Section A", "Section B", "Section C", "Main Shaft", "Ventilation Area"]
        const randomLocation = locations[Math.floor(Math.random() * locations.length)]

        triggerEmergency({
          location: randomLocation,
          timestamp: new Date().toISOString(),
          type: "Environmental Alert",
          message: `High gas levels detected in ${randomLocation}. Evacuation may be required.`,
        })
      }
    }

    const interval = setInterval(simulateEnvironmentalEmergency, 120000) // Check every 2 minutes
    return () => clearInterval(interval)
  }, [])

  return (
    <EmergencyContext.Provider value={{ emergencyAlerts, triggerEmergency, acknowledgeAlert }}>
      {children}

      <Modal
        title={
          <Space>
            <Badge status="error" />
            <WarningOutlined style={{ color: '#ff4d4f' }} />
            <Title level={4} style={{ margin: 0, color: '#ff4d4f' }}>
              Emergency Alert
            </Title>
          </Space>
        }
        open={isAlertOpen}
        footer={[
          <Button 
            key="acknowledge" 
            type="primary" 
            danger 
            onClick={() => currentAlert && acknowledgeAlert(currentAlert.id)}
          >
            Acknowledge
          </Button>
        ]}
        onCancel={() => currentAlert && acknowledgeAlert(currentAlert.id)}
        centered
        closable={false}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Text strong>{currentAlert?.message}</Text>
          
          <Space align="center">
            <EnvironmentOutlined />
            <Text type="secondary"><strong>Location:</strong> {currentAlert?.location}</Text>
          </Space>
          
          <Space align="center">
            <ClockCircleOutlined />
            <Text type="secondary">
              <strong>Time:</strong> {currentAlert && new Date(currentAlert.timestamp).toLocaleTimeString()}
            </Text>
          </Space>
          
          {currentAlert?.helmetId && (
            <Space align="center">
              <IdcardOutlined />
              <Text type="secondary"><strong>Helmet ID:</strong> {currentAlert.helmetId}</Text>
            </Space>
          )}
        </Space>
      </Modal>
    </EmergencyContext.Provider>
  )
}

export const useEmergencyContext = () => {
  const context = useContext(EmergencyContext)
  if (context === undefined) {
    throw new Error("useEmergencyContext must be used within an EmergencyProvider")
  }
  return context
}