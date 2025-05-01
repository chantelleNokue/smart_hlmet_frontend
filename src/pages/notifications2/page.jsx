"use client"

import { useState, useEffect } from "react"
import { 
  Card, 
  Typography, 
  Badge as AntBadge, 
  Button, 
  Input, 
  Select, 
  Tabs, 
  Space, 
  Empty, 
  Divider,
  message,
  Row,
  Col
} from 'antd'
import { 
  AlertOutlined, 
  CheckOutlined, 
  InfoCircleOutlined, 
  SearchOutlined, 
  SoundOutlined, 
  DeleteOutlined 
} from '@ant-design/icons'
import { HiOutlineBellSlash } from "react-icons/hi2"
import { CiVolumeMute } from "react-icons/ci"

const { Title, Text, Paragraph } = Typography
const { TabPane } = Tabs

// Mock notification data
const initialNotifications = [
  {
    id: 1,
    title: "High methane levels detected",
    message: "Methane levels in Section B have exceeded safe thresholds. Ventilation systems activated.",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    type: "alert",
    read: false,
  },
  {
    id: 2,
    title: "Maintenance completed",
    message: "Scheduled maintenance on Drill #3 has been completed. Equipment is now operational.",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    type: "info",
    read: true,
  },
  {
    id: 3,
    title: "Staff shift change",
    message: "Reminder: Shift change at 3:00 PM. Please ensure all handover procedures are followed.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    type: "info",
    read: false,
  },
  {
    id: 4,
    title: "System update scheduled",
    message: "A system update is scheduled for tonight at 2:00 AM. Brief downtime expected.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    type: "info",
    read: true,
  },
  {
    id: 5,
    title: "Critical equipment failure",
    message: "Conveyor belt in Section C has stopped. Maintenance team dispatched.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
    type: "alert",
    read: true,
  },
  {
    id: 6,
    title: "Safety inspection passed",
    message: "Monthly safety inspection completed with no critical issues found.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    type: "success",
    read: true,
  },
  {
    id: 7,
    title: "New safety protocol",
    message: "New safety protocol for handling explosives has been published. All staff must review.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    type: "info",
    read: true,
  },
  {
    id: 8,
    title: "Environmental compliance check",
    message: "Quarterly environmental compliance check scheduled for next week.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    type: "info",
    read: true,
  },
]

export default function Notifications() {
  const [notifications, setNotifications] = useState(initialNotifications)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [timeFilter, setTimeFilter] = useState("all")
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [messageApi, contextHolder] = message.useMessage()

  // Filter notifications based on search, type, and time
  const filteredNotifications = notifications.filter((notification) => {
    // Search filter
    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase())

    // Type filter
    const matchesType = typeFilter === "all" || notification.type === typeFilter

    // Time filter
    let matchesTime = true
    const notificationDate = new Date(notification.timestamp)
    const now = new Date()

    if (timeFilter === "today") {
      matchesTime = notificationDate.toDateString() === now.toDateString()
    } else if (timeFilter === "yesterday") {
      const yesterday = new Date(now)
      yesterday.setDate(now.getDate() - 1)
      matchesTime = notificationDate.toDateString() === yesterday.toDateString()
    } else if (timeFilter === "thisWeek") {
      const weekAgo = new Date(now)
      weekAgo.setDate(now.getDate() - 7)
      matchesTime = notificationDate >= weekAgo
    }

    return matchesSearch && matchesType && matchesTime
  })

  // Group notifications by read status
  const unreadNotifications = filteredNotifications.filter((n) => !n.read)
  const readNotifications = filteredNotifications.filter((n) => n.read)

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
    messageApi.success({
      content: `${unreadNotifications.length} notifications have been marked as read.`,
      duration: 3,
    })
  }

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([])
    messageApi.success({
      content: "Your notification list has been cleared.",
      duration: 3,
    })
  }

  // Mark a single notification as read
  const markAsRead = (id) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  // Delete a single notification
  const deleteNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  // Toggle sound
  const toggleSound = () => {
    setSoundEnabled(!soundEnabled)
    messageApi.info({
      content: soundEnabled 
        ? "You will no longer hear sounds for new notifications." 
        : "You will now hear sounds for new notifications.",
      duration: 3,
    })
  }

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now - date
    const diffSec = Math.floor(diffMs / 1000)
    const diffMin = Math.floor(diffSec / 60)
    const diffHour = Math.floor(diffMin / 60)
    const diffDay = Math.floor(diffHour / 24)

    if (diffSec < 60) return "Just now"
    if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? "s" : ""} ago`
    if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? "s" : ""} ago`
    if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`

    return date.toLocaleDateString()
  }

  // Get icon for notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "alert":
        return <AlertOutlined style={{ fontSize: '20px', color: '#ff4d4f' }} />
      case "success":
        return <CheckOutlined style={{ fontSize: '20px', color: '#52c41a' }} />
      case "info":
      default:
        return <InfoCircleOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
    }
  }

  // Get badge for notification type
  const getNotificationBadge = (type) => {
    switch (type) {
      case "alert":
        return <AntBadge color="red" text="Alert" />
      case "success":
        return <AntBadge color="green" text="Success" />
      case "info":
      default:
        return <AntBadge color="blue" text="Info" />
    }
  }

  // Simulate receiving a new notification
  useEffect(() => {
    const interval = setInterval(() => {
      // 10% chance of new notification every 30 seconds
      if (Math.random() < 0.1) {
        const newNotification = {
          id: Date.now(),
          title: "Environmental reading update",
          message: "New environmental readings have been recorded and are available for review.",
          timestamp: new Date().toISOString(),
          type: "info",
          read: false,
        }

        setNotifications((prev) => [newNotification, ...prev])

        // Play sound if enabled
        if (soundEnabled) {
          const audio = new Audio("/notification.mp3")
          audio.play().catch((e) => console.log("Audio play failed:", e))
        }

        messageApi.info({
          content: newNotification.title + ": " + newNotification.message,
          duration: 4,
        })
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [soundEnabled, messageApi])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {contextHolder}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '16px',
        '@media (min-width: 640px)': {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between'
        }
      }}>
       <Row justify="space-between" align="middle">
  <Col>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Title level={3} style={{ margin: 0 }}>Notifications</Title>
      {unreadNotifications.length > 0 && (
        <AntBadge 
          count={unreadNotifications.length} 
          style={{ backgroundColor: '#ff4d4f', marginLeft: '8px' }} 
        />
      )}
    </div>
  </Col>
  <Col>
    <Space style={{ justifyContent: 'flex-end', width: '100%' }}>
      <Button 
        icon={soundEnabled ? <SoundOutlined /> : <CiVolumeMute style={{ fontSize: '16px' }} />} 
        onClick={toggleSound} 
      />
      <Button 
        icon={<CheckOutlined />} 
        onClick={markAllAsRead} 
        disabled={unreadNotifications.length === 0}
      >
        Mark All Read
      </Button>
      <Button 
        icon={<DeleteOutlined />} 
        danger 
        onClick={clearAllNotifications} 
        disabled={notifications.length === 0}
      >
        Clear All
      </Button>
    </Space>
  </Col>
</Row>
<Row gutter={16}>
  <Col span={18}>
    <Input
      prefix={<SearchOutlined />}
      placeholder="Search notifications..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      style={{ width: '100%' }}
    />
  </Col>
  <Col span={3} >
      <Select
        style={{ width: '100%' }}
        placeholder="Filter by type"
        value={typeFilter}
        onChange={setTypeFilter}
        options={[
          { value: 'all', label: 'All Types' },
          { value: 'alert', label: 'Alerts' },
          { value: 'info', label: 'Information' },
          { value: 'success', label: 'Success' }
        ]}
      />
      
  </Col>
 <Col span={3} >
    
     
      <Select
        style={{ width: '100%' }}
        placeholder="Filter by time"
        value={timeFilter}
        onChange={setTimeFilter}
        options={[
          { value: 'all', label: 'All Time' },
          { value: 'today', label: 'Today' },
          { value: 'yesterday', label: 'Yesterday' },
          { value: 'thisWeek', label: 'This Week' }
        ]}
      />
    
  </Col>

</Row>
        
      </div>

      
      <Tabs defaultActiveKey="all">
        <TabPane tab="All" key="all">
          <Card title="All Notifications" extra={<Text type="secondary">View all your notifications in one place</Text>}>
            {filteredNotifications.length === 0 ? (
              <Empty
                image={<InfoCircleOutlined style={{ fontSize: '64px', color: '#bfbfbf' }} />}
                description={
                  <Space direction="vertical" align="center">
                    <Text type="secondary">No notifications found</Text>
                    {(searchTerm || typeFilter !== "all" || timeFilter !== "all") && (
                      <Text type="secondary" style={{ fontSize: '14px' }}>Try adjusting your filters</Text>
                    )}
                  </Space>
                }
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      gap: '16px', 
                      padding: '16px', 
                      border: '1px solid #d9d9d9', 
                      borderRadius: '8px',
                      backgroundColor: notification.read ? '#fff' : '#f5f5f5',
                      transition: 'background-color 0.3s'
                    }}
                  >
                    <div style={{ marginTop: '4px' }}>{getNotificationIcon(notification.type)}</div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text strong>{notification.title}</Text>
                        {getNotificationBadge(notification.type)}
                      </div>
                      <Text type="secondary" style={{ fontSize: '14px' }}>{notification.message}</Text>
                      <Text type="secondary" style={{ fontSize: '12px' }}>{formatTimestamp(notification.timestamp)}</Text>
                    </div>
                    <Space>
                      {!notification.read && (
                        <Button 
                          type="text" 
                          icon={<CheckOutlined />} 
                          onClick={() => markAsRead(notification.id)} 
                        />
                      )}
                      <Button 
                        type="text" 
                        icon={<DeleteOutlined />} 
                        onClick={() => deleteNotification(notification.id)} 
                      />
                    </Space>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabPane>

        <TabPane tab="Unread" key="unread">
          <Card title="Unread Notifications" extra={<Text type="secondary">Notifications that require your attention</Text>}>
            {unreadNotifications.length === 0 ? (
              <Empty
                image={<HiOutlineBellSlash style={{ fontSize: '64px', color: '#bfbfbf' }} />}
                description={
                  <Space direction="vertical" align="center">
                    <Text type="secondary">No unread notifications</Text>
                    {(searchTerm || typeFilter !== "all" || timeFilter !== "all") && (
                      <Text type="secondary" style={{ fontSize: '14px' }}>Try adjusting your filters</Text>
                    )}
                  </Space>
                }
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {unreadNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      gap: '16px', 
                      padding: '16px', 
                      border: '1px solid #d9d9d9', 
                      borderRadius: '8px',
                      backgroundColor: '#f5f5f5'
                    }}
                  >
                    <div style={{ marginTop: '4px' }}>{getNotificationIcon(notification.type)}</div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text strong>{notification.title}</Text>
                        {getNotificationBadge(notification.type)}
                      </div>
                      <Text type="secondary" style={{ fontSize: '14px' }}>{notification.message}</Text>
                      <Text type="secondary" style={{ fontSize: '12px' }}>{formatTimestamp(notification.timestamp)}</Text>
                    </div>
                    <Space>
                      <Button 
                        type="text" 
                        icon={<CheckOutlined />} 
                        onClick={() => markAsRead(notification.id)} 
                      />
                      <Button 
                        type="text" 
                        icon={<DeleteOutlined />} 
                        onClick={() => deleteNotification(notification.id)} 
                      />
                    </Space>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabPane>

        <TabPane tab="Read" key="read">
          <Card title="Read Notifications" extra={<Text type="secondary">Notifications you have already seen</Text>}>
            {readNotifications.length === 0 ? (
              <Empty
                image={<InfoCircleOutlined style={{ fontSize: '64px', color: '#bfbfbf' }} />}
                description={
                  <Space direction="vertical" align="center">
                    <Text type="secondary">No read notifications</Text>
                    {(searchTerm || typeFilter !== "all" || timeFilter !== "all") && (
                      <Text type="secondary" style={{ fontSize: '14px' }}>Try adjusting your filters</Text>
                    )}
                  </Space>
                }
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {readNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      gap: '16px', 
                      padding: '16px', 
                      border: '1px solid #d9d9d9', 
                      borderRadius: '8px',
                      backgroundColor: '#fff'
                    }}
                  >
                    <div style={{ marginTop: '4px' }}>{getNotificationIcon(notification.type)}</div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text strong>{notification.title}</Text>
                        {getNotificationBadge(notification.type)}
                      </div>
                      <Text type="secondary" style={{ fontSize: '14px' }}>{notification.message}</Text>
                      <Text type="secondary" style={{ fontSize: '12px' }}>{formatTimestamp(notification.timestamp)}</Text>
                    </div>
                    <Button 
                      type="text" 
                      icon={<DeleteOutlined />} 
                      onClick={() => deleteNotification(notification.id)} 
                    />
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabPane>
      </Tabs>
    </div>
  )
}