"use client"

import { createContext, useContext, useState, useEffect, useRef } from "react"
import { Modal, Typography, Space, Button, Badge, notification } from "antd"
import { WarningOutlined, ClockCircleOutlined, EnvironmentOutlined, IdcardOutlined } from "@ant-design/icons"

// Import Firebase database instance
import { database } from '../auth/firebase'; // Adjust path as per your firebase.js location
import { ref, query, orderByChild, equalTo, limitToLast, onValue, off } from 'firebase/database';
import alertSound  from '../../assets/alert.mp3'


const { Text, Title } = Typography;

const EmergencyContext = createContext(undefined)

export function EmergencyProvider({ children }) {
  const [currentAlert, setCurrentAlert] = useState(null)
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false)
  const notificationKeyRef = useRef(null); // To store the key for the current Ant Design notification

  // Function to acknowledge an emergency alert via your API
  const acknowledgeAlert = async (alertId) => {
    if (!alertId) return;

    try {
      // Optimistically update UI first for a snappier feel
      if (notificationKeyRef.current) {
        notification.destroy(notificationKeyRef.current);
        notificationKeyRef.current = null;
      }
      setIsAlertModalOpen(false); // Close the modal immediately
      setCurrentAlert(null); // Clear the current alert
// /alerts/:alertId/acknowledge
      const response = await fetch(`http://localhost:3061/api/sensors/alerts/${alertId}/acknowledge`, { // Your backend API route
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resolvedBy: 'Dashboard User' }), // You can pass the actual user here
      });
      const data = await response.json();
      if (data.success) {
        console.log(`Alert ${alertId} acknowledged successfully on Firebase.`);
        // The Firebase listener will re-evaluate and confirm no unacknowledged alerts
      } else {
        console.error('Failed to acknowledge alert via API:', data.message);
        // Revert UI if API call fails, or show an error
        notification.error({
            message: 'Acknowledgment Failed',
            description: 'Could not acknowledge alert. Please try again.',
            duration: 5,
        });
      }
    } catch (error) {
      console.error('Error calling acknowledge API:', error);
      notification.error({
        message: 'Network Error',
        description: 'Failed to connect to acknowledgment service.',
        duration: 5,
      });
    }
  }

  useEffect(() => {
    const alertsRef = ref(database, 'alerts');
    // Fetch all unacknowledged alerts to ensure we always show the *latest*
    const unacknowledgedAlertsQuery = query(alertsRef, orderByChild('acknowledged'), equalTo(false));

    const unsubscribe = onValue(unacknowledgedAlertsQuery, (snapshot) => {
      let latestUnacknowledgedAlert = null;
      let mostRecentTimestamp = 0;

      // Find the single latest unacknowledged alert
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const alert = {
            id: childSnapshot.key,
            ...childSnapshot.val(),
          };
          if (alert.timestamp > mostRecentTimestamp) {
            mostRecentTimestamp = alert.timestamp;
            latestUnacknowledgedAlert = alert;
          }
        });
      }

      if (latestUnacknowledgedAlert) {
        // Only trigger if it's a truly new alert or we had no alert previously
        if (!currentAlert || latestUnacknowledgedAlert.id !== currentAlert.id) {
          setCurrentAlert(latestUnacknowledgedAlert);
          setIsAlertModalOpen(false); // DO NOT automatically open modal here by default

          // Play alert sound
          const audio = new Audio(alertSound);
          audio.play().catch((e) => console.log("Audio play failed:", e));

          // Dismiss any existing notification before showing a new one
          if (notificationKeyRef.current) {
            notification.destroy(notificationKeyRef.current);
          }

          // Show a new Ant Design notification
          const notifKey = `alert-${latestUnacknowledgedAlert.id}`;
          notificationKeyRef.current = notifKey;

          notification.error({
            message: 'Emergency Alert',
            description: (
              <div>
                <p>{latestUnacknowledgedAlert.message}</p>
                <p><strong>Helmet ID:</strong> {latestUnacknowledgedAlert.helmetId}</p>
                <p><strong>Location:</strong> {latestUnacknowledgedAlert.location}</p>
              </div>
            ),
            placement: 'topRight',
            duration: 10, // Notification disappears after 10 seconds unless acknowledged
            icon: <WarningOutlined style={{ color: '#ff4d4f' }} />,
            key: notifKey,
            onClick: () => {
              // Clicking the notification opens the full modal
              setIsAlertModalOpen(true);
            },
            btn: (
                <Button
                    type="primary"
                    danger
                    size="small"
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent onClick of the notification itself
                        acknowledgeAlert(latestUnacknowledgedAlert.id);
                    }}
                >
                    Acknowledge
                </Button>
            ),
            onClose: () => {
                // If notification auto-closes and modal isn't open, clear alert
                // This prevents the modal from popping up later if user didn't interact
                if (!isAlertModalOpen) {
                    setCurrentAlert(null);
                }
            }
          });
        }
      } else {
        // No unacknowledged alerts found, so clear everything and dismiss notification/modal
        setCurrentAlert(null);
        setIsAlertModalOpen(false);
        if (notificationKeyRef.current) {
          notification.destroy(notificationKeyRef.current);
          notificationKeyRef.current = null;
        }
      }
    }, (error) => {
      console.error("Firebase listener error:", error);
      // Handle error, e.g., show an error message
    });

    // Cleanup listener and notification on component unmount
    return () => {
      off(unacknowledgedAlertsQuery, 'value', unsubscribe);
      if (notificationKeyRef.current) {
        notification.destroy(notificationKeyRef.current);
      }
    };
  }, [currentAlert, isAlertModalOpen]); // Added isAlertModalOpen to dependencies for onClose check

  return (
    <EmergencyContext.Provider value={{ currentAlert, acknowledgeAlert }}>
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
        open={isAlertModalOpen && currentAlert !== null} // Only open if explicitly told to AND alert exists
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
        // Do not use onCancel to acknowledge unless closable is true.
        // It's better to explicitly acknowledge.
        // onCancel={() => currentAlert && acknowledgeAlert(currentAlert.id)}
        centered // Keep centered for now, but not auto-popping up
        closable={true} // Allow closing, but acknowledgment will also close it
        onOk={() => currentAlert && acknowledgeAlert(currentAlert.id)} // Treat OK as acknowledge
        onCancel={() => setIsAlertModalOpen(false)} // Just close modal on cancel, don't acknowledge unless explicitly done
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