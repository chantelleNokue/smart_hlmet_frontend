import React, { useState } from 'react';
import { 
  Table, 
  Input, 
  Button, 
  Select, 
  Space, 
  Modal, 
  Form, 
  message, 
  Popconfirm,
  Card,
  Divider,
  Row,
  Col,
  Tag,
  Drawer,
  Switch,
  DatePicker
} from 'antd';
import { minersData , initialHelmetsData } from "../mockData/mockData";
import { PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';

export default function HelmetAssgnmentScreen() {

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
    const departments = [
        'Mining Operations',
        'Safety & Compliance',
        'Equipment Maintenance',
        'Geological Research',
        'Administration'
      ];



    
  return (
    <div className="p-4">
      <Card hoverable>
        <Space className="mb-4" wrap style={{ padding: "20px" }}>
          <Input 
            placeholder="Search by Name" 
            prefix={<SearchOutlined />}
            // value={searchName}
            // onChange={(e) => setSearchName(e.target.value)}
            style={{ width: 300 }} 
          />
          <Input 
            placeholder="Search by ID" 
            prefix={<SearchOutlined />}
            // value={searchId}
            // onChange={(e) => setSearchId(e.target.value)}
            style={{ width: 300 }}
          />
          <Select
            placeholder="Filter by Department"
            style={{ width: 300 }}
            // value={searchDepartment || undefined}
            allowClear
            // onChange={(value) => setSearchDepartment(value || '')}
          >
            {departments.map(dept => (
              <Option key={dept} value={dept}>{dept}</Option>
            ))}
          </Select>
          
          <Button 
            icon={<ReloadOutlined />}
            // onClick={resetFilters}
          >
            Reset Filters
          </Button>
          {/* <SignedOut>
  <SignInButton /> */}
{/* </SignedOut> */}

          <Button 
            type="primary" 
            icon={<PlusOutlined/>}
            // onClick={() => setIsAddEmployeeModalVisible(true)}
          >
            Add Employee
          </Button>
        </Space>

        <Divider/>

        <Table 
          columns={columns} 
          dataSource={filteredData}
          size="small"
          style={{ padding: "20px" }}
          pagination={{ 
            pageSize: 10, 
            showSizeChanger: true 
          }}
        />
      </Card>
      
      {/* Add Employee Modal */}
      <Modal
        title="Add New Employee"
        visible={isAddEmployeeModalVisible}
        onCancel={() => setIsAddEmployeeModalVisible(false)}
        footer={null}
      >
        <Form
          form={addEmployeeForm}
          layout="vertical"
          onFinish={handleAddEmployee}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Full Name"
                rules={[{ required: true, message: 'Please enter employee name' }]}
              >
                <Input prefix={<UserOutlined />} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Please enter email' },
                  { type: 'email', message: 'Please enter a valid email' }
                ]}
              >
                <Input prefix={<MailOutlined />} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="department"
                label="Department"
                rules={[{ required: true, message: 'Please select department' }]}
              >
                <Select placeholder="Select Department">
                  {departments.map(dept => (
                    <Option key={dept} value={dept}>{dept}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="position"
                label="Position"
                rules={[{ required: true, message: 'Please enter position' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="Phone Number"
                rules={[{ required: true, message: 'Please enter phone number' }]}
              >
                <Input prefix={<PhoneOutlined />} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="dateOfBirth"
                label="Date of Birth"
                rules={[{ required: true, message: 'Please select date of birth' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: 'Please enter address' }]}
          >
            <Input prefix={<HomeOutlined />} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Add Employee
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Employee Details Drawer */}
      <Drawer
        title="Employee Details"
        placement="right"
        width={400}
        onClose={() => setIsDetailsDrawerVisible(false)}
        open={isDetailsDrawerVisible}
      >
        {selectedEmployee && (
          <Card>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={12}>
                <strong>Employee ID:</strong> {selectedEmployee.id}
              </Col>
              <Col span={12}>
                <strong>Status:</strong> 
                <Tag color={selectedEmployee.isActive ? 'green' : 'red'}>
                  {selectedEmployee.isActive ? 'Active' : 'Inactive'}
                </Tag>
              </Col>
            </Row>

            <Divider orientation="left">Personal Information</Divider>
            <p><UserOutlined /> <strong>Name:</strong> {selectedEmployee.name}</p>
            <p><MailOutlined /> <strong>Email:</strong> {selectedEmployee.email}</p>
            <p><PhoneOutlined /> <strong>Phone:</strong> {selectedEmployee.phone}</p>
            <p><HomeOutlined /> <strong>Address:</strong> {selectedEmployee.address}</p>

            <Divider orientation="left">Professional Details</Divider>
            <p><strong>Department:</strong> {selectedEmployee.department}</p>
            <p><strong>Position:</strong> {selectedEmployee.position}</p>
          </Card>
        )}
      </Drawer>

      <Modal
  title="Edit Employee"
  open={isEditEmployeeModalVisible}
  onCancel={() => setIsEditEmployeeModalVisible(false)}
  footer={null}
>
  <Form
    form={editEmployeeForm}
    layout="vertical"
    onFinish={handleEditEmployee}
  >
    <Form.Item
      name="department"
      label="Department"
      rules={[{ required: true, message: 'Please select department' }]}
    >
      <Select placeholder="Select Department">
        {departments.map(dept => (
          <Option key={dept} value={dept}>{dept}</Option>
        ))}
      </Select>
    </Form.Item>
    
    <Form.Item
      name="position"
      label="Position"
      rules={[{ required: true, message: 'Please enter position' }]}
    >
      <Input />
    </Form.Item>
    
    <Form.Item>
      <Button type="primary" htmlType="submit" block>
        Update Employee
      </Button>
    </Form.Item>
  </Form>
</Modal>  
    </div>
  )
}
