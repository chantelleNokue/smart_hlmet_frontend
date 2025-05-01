"use client"

import { useState, useEffect } from "react"
import {
  Table,
  Input,
  Button,
  Card,
  Badge,
  Tabs,
  Progress,
  Modal,
  Form,
  Select,
  Checkbox,
  Space,
  Dropdown,
  Menu,
  Typography,
  Row,
  Col,
  Statistic,
  Alert,
} from "antd"
import {
  SearchOutlined,
  PlusOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  SafetyCertificateOutlined,
  // BatteryOutlined,
  SignalFilled,
  WarningOutlined,
  CloseOutlined,
  BellOutlined,
  UserOutlined,
} from "@ant-design/icons"
import { IoIosBatteryDead } from "react-icons/io";
import { useEmergencyContext } from "../component-overview/emergency-provider"
import { height } from "@mui/system";

const { Title, Text, Paragraph } = Typography
const { TabPane } = Tabs
const { Option } = Select

// Mock helmet data
const initialHelmetsData = [
  {
    id: "H-1001",
    status: "active",
    batteryLevel: 85,
    lastMaintenance: "2023-12-10",
    nextMaintenance: "2024-03-10",
    assignedTo: "John Smith",
    minerId: 1,
    location: "Section A",
    signalStrength: 92,
    sensors: ["Temperature", "Gas", "Impact", "Emergency Button"],
    model: "SmartHelmet Pro",
    purchaseDate: "2023-01-15",
  },
  {
    id: "H-1002",
    status: "active",
    batteryLevel: 72,
    lastMaintenance: "2023-11-05",
    nextMaintenance: "2024-02-05",
    assignedTo: "Sarah Johnson",
    minerId: 2,
    location: "Safety",
    signalStrength: 88,
    sensors: ["Temperature", "Gas", "Impact", "Motion", "Emergency Button"],
    model: "SmartHelmet Pro",
    purchaseDate: "2023-01-20",
  },
  {
    id: "H-1003",
    status: "maintenance",
    batteryLevel: 45,
    lastMaintenance: "2024-01-15",
    nextMaintenance: "2024-04-15",
    assignedTo: "Michael Brown",
    minerId: 3,
    location: "Maintenance Bay",
    signalStrength: 0,
    sensors: ["Temperature", "Gas", "Impact", "Emergency Button"],
    model: "SmartHelmet Standard",
    purchaseDate: "2022-11-10",
  },
  {
    id: "H-1004",
    status: "active",
    batteryLevel: 91,
    lastMaintenance: "2023-12-20",
    nextMaintenance: "2024-03-20",
    assignedTo: "Emily Davis",
    minerId: 4,
    location: "Environmental",
    signalStrength: 95,
    sensors: ["Temperature", "Gas", "Impact", "Air Quality", "Emergency Button"],
    model: "SmartHelmet Pro+",
    purchaseDate: "2023-02-05",
  },
  {
    id: "H-1005",
    status: "inactive",
    batteryLevel: 0,
    lastMaintenance: "2023-10-10",
    nextMaintenance: "2024-01-10",
    assignedTo: "",
    minerId: null,
    location: "Storage",
    signalStrength: 0,
    sensors: ["Temperature", "Gas", "Emergency Button"],
    model: "SmartHelmet Standard",
    purchaseDate: "2022-08-15",
  },
  {
    id: "H-1006",
    status: "active",
    batteryLevel: 68,
    lastMaintenance: "2023-11-25",
    nextMaintenance: "2024-02-25",
    assignedTo: "",
    minerId: null,
    location: "Section B",
    signalStrength: 78,
    sensors: ["Temperature", "Gas", "Impact", "Emergency Button"],
    model: "SmartHelmet Pro",
    purchaseDate: "2023-03-10",
  },
]

// Mock miners data for assignment
const minersData = [
  { id: 1, name: "John Smith", section: "Section A", helmetId: "H-1001", shiftId: 1 },
  { id: 2, name: "Sarah Johnson", section: "Safety", helmetId: "H-1002", shiftId: 2 },
  { id: 3, name: "Michael Brown", section: "Section B", helmetId: "H-1003", shiftId: 3 },
  { id: 4, name: "Emily Davis", section: "Environmental", helmetId: "H-1004", shiftId: 4 },
  { id: 5, name: "Robert Wilson", section: "Maintenance", helmetId: "", shiftId: 5 },
  { id: 6, name: "Lisa Thompson", section: "Section C", helmetId: "", shiftId: null },
  { id: 7, name: "David Garcia", section: "Section A", helmetId: "", shiftId: 1 },
  { id: 8, name: "Thomas Wright", section: "Section A", helmetId: "", shiftId: 1 },
  { id: 9, name: "James Lee", section: "Section A", helmetId: "", shiftId: 1 },
  { id: 10, name: "Maria Rodriguez", section: "Section B", helmetId: "", shiftId: 2 },
  { id: 11, name: "Robert Chen", section: "Section B", helmetId: "", shiftId: 2 },
  { id: 12, name: "Lisa Thompson", section: "Section C", helmetId: "", shiftId: 3 },
  { id: 13, name: "Kevin Wilson", section: "Section A", helmetId: "", shiftId: 4 },
  { id: 14, name: "Anna Kim", section: "Section D", helmetId: "", shiftId: null },
  { id: 15, name: "Carlos Mendez", section: "Section D", helmetId: "", shiftId: null },
]

export default function HelmetAssignments() {
  const [helmetsData, setHelmetsData] = useState(initialHelmetsData)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  const [isTestEmergencyModalOpen, setIsTestEmergencyModalOpen] = useState(false)
  const [currentHelmet, setCurrentHelmet] = useState(null)
  const [newHelmet, setNewHelmet] = useState({
    id: "",
    status: "active",
    batteryLevel: 100,
    lastMaintenance: new Date().toISOString().split("T")[0],
    nextMaintenance: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split("T")[0],
    assignedTo: "",
    minerId: null,
    location: "",
    signalStrength: 100,
    sensors: ["Temperature", "Gas", "Emergency Button"],
    model: "SmartHelmet Standard",
    purchaseDate: new Date().toISOString().split("T")[0],
  })
  const [selectedMinerId, setSelectedMinerId] = useState(null)
  const [activeTab, setActiveTab] = useState("all")
  const [miners, setMiners] = useState(minersData)
  const [form] = Form.useForm()
  const [editForm] = Form.useForm()

  const { triggerEmergency } = useEmergencyContext()

  // Filter helmets based on search term and active tab
  const filteredHelmets = helmetsData.filter((helmet) => {
    const matchesSearch =
      helmet.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      helmet.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (helmet.assignedTo && helmet.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()))

    if (activeTab === "all") return matchesSearch
    if (activeTab === "assigned") return matchesSearch && helmet.assignedTo
    if (activeTab === "unassigned") return matchesSearch && !helmet.assignedTo
    if (activeTab === "maintenance") return matchesSearch && helmet.status === "maintenance"

    return matchesSearch
  })

  // Get available miners (not assigned a helmet)
  const availableMiners = miners.filter((miner) => !miner.helmetId || miner.helmetId === currentHelmet?.id)

  const handleAddHelmet = (values) => {
    if (!values.id) {
      Modal.error({
        title: "Error",
        content: "Helmet ID is required",
      })
      return
    }

    if (helmetsData.some((helmet) => helmet.id === values.id)) {
      Modal.error({
        title: "Error",
        content: "Helmet ID already exists",
      })
      return
    }

    // Ensure Emergency Button is included in sensors
    if (!values.sensors.includes("Emergency Button")) {
      values.sensors.push("Emergency Button")
    }

    setHelmetsData([...helmetsData, values])
    setIsAddModalOpen(false)
    form.resetFields()

    Modal.success({
      title: "Helmet Added",
      content: `Helmet ${values.id} has been added to the inventory.`,
    })
  }

  const handleEditHelmet = (values) => {
    // Ensure Emergency Button is included in sensors
    if (!values.sensors.includes("Emergency Button")) {
      values.sensors.push("Emergency Button")
    }

    const updatedHelmet = { ...currentHelmet, ...values }
    setHelmetsData(helmetsData.map((helmet) => (helmet.id === currentHelmet.id ? updatedHelmet : helmet)))
    setIsEditModalOpen(false)

    Modal.success({
      title: "Helmet Updated",
      content: `Helmet ${currentHelmet.id}'s information has been updated.`,
    })
  }

  const handleDeleteHelmet = () => {
    // If helmet is assigned to a miner, update the miner's helmetId
    if (currentHelmet.minerId) {
      setMiners(miners.map((miner) => (miner.id === currentHelmet.minerId ? { ...miner, helmetId: "" } : miner)))
    }

    setHelmetsData(helmetsData.filter((helmet) => helmet.id !== currentHelmet.id))
    setIsDeleteModalOpen(false)

    Modal.success({
      title: "Helmet Removed",
      content: `Helmet ${currentHelmet.id} has been removed from the inventory.`,
    })
  }

  const handleAssignHelmet = () => {
    if (!selectedMinerId) {
      Modal.error({
        title: "Error",
        content: "Please select a miner",
      })
      return
    }

    const selectedMiner = miners.find((miner) => miner.id === selectedMinerId)

    // Check if miner already has a helmet assigned
    if (selectedMiner.helmetId && selectedMiner.helmetId !== currentHelmet.id) {
      Modal.error({
        title: "Error",
        content: `${selectedMiner.name} already has helmet ${selectedMiner.helmetId} assigned.`,
      })
      return
    }

    // Update helmet data
    const updatedHelmets = helmetsData.map((helmet) => {
      if (helmet.id === currentHelmet.id) {
        return {
          ...helmet,
          assignedTo: selectedMiner.name,
          minerId: selectedMiner.id,
          location: selectedMiner.section,
        }
      }
      return helmet
    })

    // Update miner data
    const updatedMiners = miners.map((miner) =>
      miner.id === selectedMinerId ? { ...miner, helmetId: currentHelmet.id } : miner,
    )

    setHelmetsData(updatedHelmets)
    setMiners(updatedMiners)
    setIsAssignModalOpen(false)
    setSelectedMinerId(null)

    Modal.success({
      title: "Helmet Assigned",
      content: `Helmet ${currentHelmet.id} has been assigned to ${selectedMiner.name}.`,
    })
  }

  const handleUnassignHelmet = (helmet) => {
    // Update miner data
    if (helmet.minerId) {
      setMiners(miners.map((miner) => (miner.id === helmet.minerId ? { ...miner, helmetId: "" } : miner)))
    }

    // Update helmet data
    const updatedHelmets = helmetsData.map((h) => {
      if (h.id === helmet.id) {
        return {
          ...h,
          assignedTo: "",
          minerId: null,
        }
      }
      return h
    })

    setHelmetsData(updatedHelmets)

    Modal.success({
      title: "Helmet Unassigned",
      content: `Helmet ${helmet.id} has been unassigned.`,
    })
  }

  const handleTestEmergencyButton = () => {
    if (!currentHelmet) return

    // Find miner details if assigned
    const minerName = currentHelmet.assignedTo
    const minerSection = currentHelmet.location

    // Trigger the emergency
    triggerEmergency({
      location: minerSection || "Unknown location",
      timestamp: new Date().toISOString(),
      type: "Helmet Emergency Button",
      message: `Emergency button pressed on helmet ${currentHelmet.id}${minerName ? ` by ${minerName}` : ""}. Immediate assistance required.`,
      minerId: currentHelmet.minerId,
      helmetId: currentHelmet.id,
    })

    setIsTestEmergencyModalOpen(false)

    Modal.error({
      title: "Emergency Alert Triggered",
      content: `Test emergency alert sent from helmet ${currentHelmet.id}.`,
    })
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <Badge status="success" text="Active" />
      case "inactive":
        return <Badge status="default" text="Inactive" />
      case "maintenance":
        return <Badge status="warning" text="Maintenance" />
      default:
        return <Badge status="default" text={status} />
    }
  }

  const getBatteryIndicator = (level) => {
    let color = "green"
    if (level < 30) color = "red"
    else if (level < 70) color = "orange"

    return (
      <Space>
        <IoIosBatteryDead style={{ color }} />
        <Progress percent={level} size="small" status={level < 30 ? "exception" : "normal"} style={{ width: 80 }} />
        <span>{level}%</span>
      </Space>
    )
  }

  const getSignalIndicator = (strength) => {
    let color = "green"
    if (strength === 0) color = "gray"
    else if (strength < 30) color = "red"
    else if (strength < 70) color = "orange"

    return (
      <Space>
        <SignalFilled style={{ color }} />
        <span>{strength}%</span>
      </Space>
    )
  }

  // Simulate real-time updates for battery levels
  useEffect(() => {
    const interval = setInterval(() => {
      setHelmetsData((prevHelmets) =>
        prevHelmets.map((helmet) => {
          if (helmet.status !== "active" || !helmet.assignedTo) return helmet

          // Randomly decrease battery level for active, assigned helmets
          const newBatteryLevel = Math.max(0, helmet.batteryLevel - Math.floor(Math.random() * 2))

          // Alert if battery is low
          if (newBatteryLevel < 20 && helmet.batteryLevel >= 20) {
            Modal.warning({
              title: "Low Battery Alert",
              content: `Helmet ${helmet.id} assigned to ${helmet.assignedTo} has low battery (${newBatteryLevel}%)`,
            })
          }

          return {
            ...helmet,
            batteryLevel: newBatteryLevel,
          }
        }),
      )
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const columns = [
    {
      title: "Helmet ID",
      dataIndex: "id",
      key: "id",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Model",
      dataIndex: "model",
      key: "model",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusBadge(status),
    },
  
  
    {
      title: "Assigned To",
      dataIndex: "assignedTo",
      key: "assignedTo",
      render: (text, record) =>
        text ? (
          <Space>
            <UserOutlined />
            <span>{text}</span>
            <Button type="text" icon={<CloseOutlined />} size="small" onClick={() => handleUnassignHelmet(record)} />
          </Space>
        ) : (
          <Badge status="default" text="Unassigned" />
        ),
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      responsive: ["md"],
      render: (text) => text || "—",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          {!record.assignedTo && record.status === "active" && (
            <Button
              type="primary"
              size="small"
              onClick={() => {
                setCurrentHelmet(record)
                setIsAssignModalOpen(true)
              }}
            >
              Assign
            </Button>
          )}
          {record.status === "active" && (
            <Button
              danger
              size="small"
              icon={<BellOutlined />}
              onClick={() => {
                setCurrentHelmet(record)
                setIsTestEmergencyModalOpen(true)
              }}
              title="Test Emergency Button"
            />
          )}
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item
                  key="edit"
                  icon={<EditOutlined />}
                  onClick={() => {
                    setCurrentHelmet(record)
                    editForm.setFieldsValue({
                      ...record,
                      sensors: record.sensors.filter((s) => s !== "Emergency Button"),
                    })
                    setIsEditModalOpen(true)
                  }}
                >
                  Edit
                </Menu.Item>
                <Menu.Item
                  key="delete"
                  icon={<DeleteOutlined />}
                  danger
                  onClick={() => {
                    setCurrentHelmet(record)
                    setIsDeleteModalOpen(true)
                  }}
                >
                  Delete
                </Menu.Item>
              </Menu>
            }
          >
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      ),
    },
  ]

  const emptyContent = (
    <div style={{ textAlign: "center", padding: "40px 0" }}>
      <SafetyCertificateOutlined style={{ fontSize: 48, color: "#ccc", marginBottom: 16 }} />
      <p>No helmets found</p>
      {searchTerm && <p style={{ fontSize: 12 }}>Try adjusting your search criteria</p>}
      <Button type="primary" onClick={() => setIsAddModalOpen(true)} style={{ marginTop: 16 }}>
        Add Helmet
      </Button>
    </div>
  )

  return (
    <Card hoverable  style={{height: "10%"}}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <Title level={2}>Helmet Assignments</Title>
          <Space>
            <Input
              placeholder="Search helmets..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: 250 }}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                form.resetFields()
                setIsAddModalOpen(true)
              }}
            >
              Add Helmet
            </Button>
          </Space>
        </div>

        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="All Helmets" key="all" />
          <TabPane tab="Assigned" key="assigned" />
          <TabPane tab="Unassigned" key="unassigned" />
          <TabPane tab="Maintenance" key="maintenance" />
        </Tabs>

        <Card title="Helmet Inventory" style={{ marginBottom: 24 }}>
          <Table
            columns={columns}
            dataSource={filteredHelmets}
            rowKey="id"
            locale={{ emptyText: emptyContent }}
            pagination={{ pageSize: 10 }}
          />
        </Card>

      </div>

      {/* Add Helmet Modal */}
      <Modal
        title="Add New Helmet"
        open={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        footer={null}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddHelmet}
          initialValues={{
            id: "",
            status: "active",
            batteryLevel: 100,
            lastMaintenance: new Date().toISOString().split("T")[0],
            nextMaintenance: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split("T")[0],
            location: "",
            signalStrength: 100,
            sensors: ["Temperature", "Gas"],
            model: "SmartHelmet Standard",
            purchaseDate: new Date().toISOString().split("T")[0],
            assignedTo: "",
            minerId: null,
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="id" label="Helmet ID" rules={[{ required: true, message: "Please enter helmet ID" }]}>
                <Input placeholder="e.g., H-1007" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="model" label="Model" rules={[{ required: true, message: "Please select model" }]}>
                <Select placeholder="Select model">
                  <Option value="SmartHelmet Standard">SmartHelmet Standard</Option>
                  <Option value="SmartHelmet Pro">SmartHelmet Pro</Option>
                  <Option value="SmartHelmet Pro+">SmartHelmet Pro+</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="Status" rules={[{ required: true, message: "Please select status" }]}>
                <Select placeholder="Select status">
                  <Option value="active">Active</Option>
                  <Option value="inactive">Inactive</Option>
                  <Option value="maintenance">Maintenance</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="location" label="Location">
                <Input placeholder="e.g., Storage" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="lastMaintenance"
                label="Last Maintenance"
                rules={[{ required: true, message: "Please select date" }]}
              >
                <Input type="date" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="nextMaintenance"
                label="Next Maintenance"
                rules={[{ required: true, message: "Please select date" }]}
              >
                <Input type="date" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="purchaseDate"
                label="Purchase Date"
                rules={[{ required: true, message: "Please select date" }]}
              >
                <Input type="date" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="sensors" label="Sensors">
                <Checkbox.Group>
                  <Space wrap>
                    <Checkbox value="Temperature">Temperature</Checkbox>
                    <Checkbox value="Gas">Gas</Checkbox>
                    <Checkbox value="Impact">Impact</Checkbox>
                    <Checkbox value="Motion">Motion</Checkbox>
                    <Checkbox value="Air Quality">Air Quality</Checkbox>
                    <Checkbox value="Emergency Button" disabled checked>
                      Emergency Button
                    </Checkbox>
                  </Space>
                </Checkbox.Group>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Space>
              <Button onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                Add Helmet
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Helmet Modal */}
      <Modal
        title="Edit Helmet"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        footer={null}
        width={700}
      >
        {currentHelmet && (
          <Form form={editForm} layout="vertical" onFinish={handleEditHelmet}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="id" label="Helmet ID">
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="model" label="Model" rules={[{ required: true, message: "Please select model" }]}>
                  <Select placeholder="Select model">
                    <Option value="SmartHelmet Standard">SmartHelmet Standard</Option>
                    <Option value="SmartHelmet Pro">SmartHelmet Pro</Option>
                    <Option value="SmartHelmet Pro+">SmartHelmet Pro+</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="status" label="Status" rules={[{ required: true, message: "Please select status" }]}>
                  <Select placeholder="Select status">
                    <Option value="active">Active</Option>
                    <Option value="inactive">Inactive</Option>
                    <Option value="maintenance">Maintenance</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="location" label="Location">
                  <Input placeholder="e.g., Storage" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="lastMaintenance"
                  label="Last Maintenance"
                  rules={[{ required: true, message: "Please select date" }]}
                >
                  <Input type="date" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="nextMaintenance"
                  label="Next Maintenance"
                  rules={[{ required: true, message: "Please select date" }]}
                >
                  <Input type="date" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="batteryLevel"
                  label="Battery Level (%)"
                  rules={[{ required: true, message: "Please enter battery level" }]}
                >
                  <Input type="number" min={0} max={100} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item name="sensors" label="Sensors">
                  <Checkbox.Group>
                    <Space wrap>
                      <Checkbox value="Temperature">Temperature</Checkbox>
                      <Checkbox value="Gas">Gas</Checkbox>
                      <Checkbox value="Impact">Impact</Checkbox>
                      <Checkbox value="Motion">Motion</Checkbox>
                      <Checkbox value="Air Quality">Air Quality</Checkbox>
                      <Checkbox value="Emergency Button" disabled checked>
                        Emergency Button
                      </Checkbox>
                    </Space>
                  </Checkbox.Group>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item>
              <Space>
                <Button onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                <Button type="primary" htmlType="submit">
                  Save Changes
                </Button>
              </Space>
            </Form.Item>
          </Form>
        )}
      </Modal>

      {/* Delete Helmet Modal */}
      <Modal
        title="Confirm Deletion"
        open={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        onOk={handleDeleteHelmet}
        okText="Delete"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to delete this helmet? This action cannot be undone.</p>
        {currentHelmet && (
          <div style={{ marginTop: 16 }}>
            <p>You are about to delete:</p>
            <div style={{ background: "#f5f5f5", padding: 16, borderRadius: 4 }}>
              <p style={{ fontWeight: "bold" }}>{currentHelmet.id}</p>
              <p>
                {currentHelmet.model} - {currentHelmet.status}
              </p>
              {currentHelmet.assignedTo && (
                <Alert
                  message={`Warning: This helmet is currently assigned to ${currentHelmet.assignedTo}`}
                  type="warning"
                  style={{ marginTop: 8 }}
                />
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Assign Helmet Modal */}
      <Modal
        title="Assign Helmet"
        open={isAssignModalOpen}
        onCancel={() => {
          setIsAssignModalOpen(false)
          setSelectedMinerId(null)
        }}
        onOk={handleAssignHelmet}
        okButtonProps={{ disabled: !selectedMinerId }}
      >
        {currentHelmet && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontWeight: "bold" }}>Helmet: {currentHelmet.id}</p>
              <p>
                {currentHelmet.model} - {getStatusBadge(currentHelmet.status)}
              </p>
            </div>

            <Form layout="vertical">
              <Form.Item label="Select Miner" required>
                <Select
                  placeholder="Select a miner"
                  onChange={(value) => setSelectedMinerId(Number(value))}
                  style={{ width: "100%" }}
                >
                  {availableMiners.length === 0 ? (
                    <Option value="none" disabled>
                      No available miners
                    </Option>
                  ) : (
                    availableMiners.map((miner) => (
                      <Option key={miner.id} value={miner.id}>
                        {miner.name} - {miner.section}
                      </Option>
                    ))
                  )}
                </Select>
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>

      {/* Test Emergency Button Modal */}
      <Modal
        title={
          <Space>
            <WarningOutlined style={{ color: "red" }} />
            Test Emergency Button
          </Space>
        }
        open={isTestEmergencyModalOpen}
        onCancel={() => setIsTestEmergencyModalOpen(false)}
        onOk={handleTestEmergencyButton}
        okText="Test Emergency Button"
        okButtonProps={{ danger: true }}
      >
        <p>This will simulate the emergency button being pressed on this helmet.</p>
        {currentHelmet && (
          <div style={{ marginTop: 16 }}>
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontWeight: "bold" }}>Helmet: {currentHelmet.id}</p>
              <p>
                {currentHelmet.model} - {currentHelmet.status}
              </p>
              {currentHelmet.assignedTo && (
                <p>
                  Assigned to: <span style={{ fontWeight: "bold" }}>{currentHelmet.assignedTo}</span>
                </p>
              )}
            </div>
            <Alert
              message="This will trigger an emergency alert that will be visible to all users of the system. The alert will include the helmet ID, location, and assigned miner (if any)."
              type="warning"
              showIcon
            />
          </div>
        )}
      </Modal>
    </Card>
  )
}

