"use client"

import { useState, useEffect } from "react"
import { 
  List, 
  Badge, 
  Typography, 
  Space, 
  Button, 
  Tag, 
  Tabs, 
  Empty, 
  Spin, 
  Alert, 
  Modal 
} from "antd"
import { 
  WarningOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  ExclamationCircleOutlined 
} from "@ant-design/icons"
import { generateMockAlerts } from "../../data/mock-data"

const { Title, Text } = Typography
const { TabPane } = Tabs

export default function Notifications () {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedAlert, setSelectedAlert] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    // Simulate loading alerts
    setLoading(true)
    setTimeout(() => {
      setAlerts(generateMockAlerts(15))
      setLoading(false)
    }, 1000)

    // Simulate new alerts coming in
    const interval = setInterval(() => {
      if (Math.random() < 0.3) {
        // 30% chance of new alert
        const newAlert = generateMockAlerts(1)[0]
        setAlerts((prev) => [newAlert, ...prev])
      }
    }, 15000)

    return () => clearInterval(interval)
  }, [])

  const handleAcknowledge = (id) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === id ? { ...alert, status: "acknowledged" } : alert)))
  }

  const handleResolve = (id) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === id ? { ...alert, status: "resolved" } : alert)))
  }

  const handleViewDetails = (alert) => {
    setSelectedAlert(alert)
    setModalVisible(true)
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "low": return "blue"
      case "medium": return "orange"
      case "high": return "red"
      case "critical": return "purple"
      default: return "default"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "new": return <WarningOutlined style={{ color: "#f5222d" }} />
      case "acknowledged": return <ClockCircleOutlined style={{ color: "#faad14" }} />
      case "resolved": return <CheckCircleOutlined style={{ color: "#52c41a" }} />
      default: return null
    }
  }

  const filterAlerts = (tab) => {
    switch (tab) {
      case "new": 
        return alerts.filter(a => a.status === "new")
      case "acknowledged":
        return alerts.filter(a => a.status === "acknowledged")
      case "resolved":
        return alerts.filter(a => a.status === "resolved")
      case "critical":
        return alerts.filter(a => a.severity === "critical")
      case "high":
        return alerts.filter(a => a.severity === "high")
      default:
        return alerts
    }
  }

  const filteredAlerts = filterAlerts(activeTab)

  const criticalAlerts = alerts.filter((a) => a.severity === "critical" && a.status === "new")

  const renderAlertList = (alertList) => (
    loading ? (
      <div style={{ textAlign: "center", padding: "40px 0" }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>Loading alerts...</div>
      </div>
    ) : alertList.length === 0 ? (
      <Empty description="No alerts found" />
    ) : (
      <List
        itemLayout="horizontal"
        dataSource={alertList}
        renderItem={(item) => (
          <List.Item
            style={{
              background: item.status === "new" ? "#fff7e6" : "transparent",
              padding: "12px",
              borderRadius: "4px",
              marginBottom: "8px",
            }}
            actions={[
              <Button key="view" type="link" onClick={() => handleViewDetails(item)}>
                View
              </Button>,
              item.status === "new" ? (
                <Button key="acknowledge" onClick={() => handleAcknowledge(item.id)}>
                  Acknowledge
                </Button>
              ) : item.status === "acknowledged" ? (
                <Button key="resolve" type="primary" onClick={() => handleResolve(item.id)}>
                  Resolve
                </Button>
              ) : (
                <Button key="resolved" disabled>
                  Resolved
                </Button>
              ),
            ]}
          >
            <List.Item.Meta
              avatar={getStatusIcon(item.status)}
              title={
                <Space>
                  <Text strong>{item.type}</Text>
                  <Tag color={getSeverityColor(item.severity)}>{item.severity.toUpperCase()}</Tag>
                </Space>
              }
              description={
                <>
                  <div>{item.message}</div>
                  <div>
                    <Text type="secondary">
                      Miner: {item.minerName} ({item.minerId})
                    </Text>
                    <Text type="secondary" style={{ marginLeft: 8 }}>
                      {new Date(item.timestamp).toLocaleString()}
                    </Text>
                  </div>
                </>
              }
            />
          </List.Item>
        )}
      />
    )
  )

  return (
    <div>
      {criticalAlerts.length > 0 && (
        <Alert
          message={`${criticalAlerts.length} Critical Alerts Require Immediate Attention`}
          type="error"
          showIcon
          icon={<ExclamationCircleOutlined />}
          style={{ marginBottom: 16 }}
        />
      )}

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <Space>
          <Badge count={alerts.filter((a) => a.status === "new").length} />
          <Text>Alerts Overview</Text>
        </Space>
        <Button type="primary" onClick={() => setAlerts(generateMockAlerts(15))}>
          Refresh
        </Button>
      </div>

      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        // type="card"
      >
        <TabPane 
          tab={
            <span>
              All Alerts 
              <Badge 
                count={alerts.length} 
                style={{ marginLeft: 8 }} 
              />
            </span>
          } 
          key="all"
        >
          {renderAlertList(filteredAlerts)}
        </TabPane>
        <TabPane 
          tab={
            <span>
              New 
              <Badge 
                count={alerts.filter(a => a.status === "new").length} 
                style={{ marginLeft: 8 }} 
              />
            </span>
          } 
          key="new"
        >
          {renderAlertList(filteredAlerts)}
        </TabPane>
        <TabPane 
          tab={
            <span>
              Acknowledged 
              <Badge 
                count={alerts.filter(a => a.status === "acknowledged").length} 
                style={{ marginLeft: 8 }} 
              />
            </span>
          } 
          key="acknowledged"
        >
          {renderAlertList(filteredAlerts)}
        </TabPane>
        <TabPane 
          tab={
            <span>
              Resolved 
              <Badge 
                count={alerts.filter(a => a.status === "resolved").length} 
                style={{ marginLeft: 8 }} 
              />
            </span>
          } 
          key="resolved"
        >
          {renderAlertList(filteredAlerts)}
        </TabPane>
        <TabPane 
          tab={
            <span>
              Critical 
              <Badge 
                count={alerts.filter(a => a.severity === "critical").length} 
                style={{ marginLeft: 8 }} 
              />
            </span>
          } 
          key="critical"
        >
          {renderAlertList(filteredAlerts)}
        </TabPane>
        <TabPane 
          tab={
            <span>
              High Priority 
              <Badge 
                count={alerts.filter(a => a.severity === "high").length} 
                style={{ marginLeft: 8 }} 
              />
            </span>
          } 
          key="high"
        >
          {renderAlertList(filteredAlerts)}
        </TabPane>
      </Tabs>

      {/* Modal for Alert Details (same as previous implementation) */}
      <Modal
        title={selectedAlert?.type}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            Close
          </Button>,
          selectedAlert?.status === "new" ? (
            <Button
              key="acknowledge"
              type="primary"
              onClick={() => {
                if (selectedAlert) handleAcknowledge(selectedAlert.id)
                setModalVisible(false)
              }}
            >
              Acknowledge
            </Button>
          ) : selectedAlert?.status === "acknowledged" ? (
            <Button
              key="resolve"
              type="primary"
              onClick={() => {
                if (selectedAlert) handleResolve(selectedAlert.id)
                setModalVisible(false)
              }}
            >
              Resolve
            </Button>
          ) : null,
        ]}
      >
        {selectedAlert && (
          <div>
            <p>
              <strong>Severity:</strong>{" "}
              <Tag color={getSeverityColor(selectedAlert.severity)}>{selectedAlert.severity.toUpperCase()}</Tag>
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <Tag
                color={
                  selectedAlert.status === "new" ? "red" : selectedAlert.status === "acknowledged" ? "orange" : "green"
                }
              >
                {selectedAlert.status.toUpperCase()}
              </Tag>
            </p>
            <p>
              <strong>Miner:</strong> {selectedAlert.minerName} ({selectedAlert.minerId})
            </p>
            <p>
              <strong>Time:</strong> {new Date(selectedAlert.timestamp).toLocaleString()}
            </p>
            <p>
              <strong>Message:</strong> {selectedAlert.message}
            </p>
            <p>
              <strong>Recommended Action:</strong>{" "}
              {selectedAlert.severity === "critical"
                ? "Immediate evacuation and emergency response team deployment."
                : selectedAlert.severity === "high"
                  ? "Check on miner immediately and prepare emergency response."
                  : selectedAlert.severity === "medium"
                    ? "Monitor situation closely and prepare for possible intervention."
                    : "Routine check when convenient."}
            </p>
          </div>
        )}
      </Modal>
    </div>
  )
}