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
import { 
  PlusOutlined, 
  SearchOutlined,
  ReloadOutlined, 
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined
} from '@ant-design/icons';
import { SignedOut, SignInButton, useUser } from '@clerk/clerk-react';

const { Option } = Select;

export default function StaffManagement() {
  const {  user } = useUser();
  console.log(user?.username)
  console.log(user)


  


  // Enhanced staff data with more fields
  const [staffData, setStaffData] = useState([
    {
      key: '1',
      id: 'EMP001',
      name: 'John Doe',
      department: 'Mining Operations',
      position: 'Senior Geologist',
      email: 'john.doe@miningco.com',
      phone: '+1 (555) 123-4567',
      address: '123 Mining Street, Denver, CO 80202',
      dateOfBirth: '1985-06-15',
      isActive: true
    },
    {
      key: '2',
      id: 'EMP002',
      name: 'Jane Smith',
      department: 'Safety & Compliance',
      position: 'Safety Manager',
      email: 'jane.smith@miningco.com',
      phone: '+1 (555) 987-6543',
      address: '456 Safety Avenue, Boulder, CO 80301',
      dateOfBirth: '1990-03-22',
      isActive: true
    },
    {
      key: '3',
      id: 'EMP003',
      name: 'Mike Johnson',
      department: 'Equipment Maintenance',
      position: 'Maintenance Supervisor',
      email: 'mike.johnson@miningco.com',
      phone: '+1 (555) 246-8135',
      address: '789 Repair Road, Colorado Springs, CO 80903',
      dateOfBirth: '1978-11-10',
      isActive: false
    }
  ]);

  // State for filtering and modals
  const [searchName, setSearchName] = useState('');
  const [searchId, setSearchId] = useState('');
  const [searchDepartment, setSearchDepartment] = useState('');
  const [isAddEmployeeModalVisible, setIsAddEmployeeModalVisible] = useState(false);
  const [isDetailsDrawerVisible, setIsDetailsDrawerVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isEditEmployeeModalVisible, setIsEditEmployeeModalVisible] = useState(false);
  const [editEmployeeForm] = Form.useForm();
  const [addEmployeeForm] = Form.useForm();


  // Departments for dropdown
  const departments = [
    'Mining Operations',
    'Safety & Compliance',
    'Equipment Maintenance',
    'Geological Research',
    'Administration'
  ];

  // Table columns configuration
  const columns = [
    {
      title: 'Employee ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id.localeCompare(b.id)
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name)
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      sorter: (a, b) => a.department.localeCompare(b.department)
    },
    {
      title: 'Position',
      dataIndex: 'position',
      key: 'position'
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      )
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <EyeOutlined 
            onClick={() => {
              setSelectedEmployee(record);
              setIsDetailsDrawerVisible(true);
            }} 
          />
          <EditOutlined onClick={() => prepareEditModal(record)}/>
          <Popconfirm
            title="Delete Staff Member"
            description="Are you sure to delete this staff member?"
            onConfirm={() => handleDeleteEmployee(record.key)}
            okText="Yes"
            cancelText="No"
          >
            <DeleteOutlined />
          </Popconfirm>
        </Space>
      )
    }
  ];

  // Reset Filters Function
  const resetFilters = () => {
    setSearchName('');
    setSearchId('');
    setSearchDepartment('');
    message.info('Filters have been reset');
  };

  // Delete Employee Handler
  const handleDeleteEmployee = (key) => {
    setStaffData(staffData.filter(item => item.key !== key));
    message.success('Employee deleted successfully');
  };
  
const prepareEditModal = (record) => {
setSelectedEmployee(record);
editEmployeeForm.setFieldsValue({
department: record.department,
position: record.position
});
setIsEditEmployeeModalVisible(true);
};    

  const handleEditEmployee = (values) => {
    const updatedStaffData = staffData.map(employee => 
      employee.key === selectedEmployee.key 
        ? { ...employee, ...values } 
        : employee
    );

    setStaffData(updatedStaffData);
    setIsEditEmployeeModalVisible(false);
    message.success('Employee updated successfully');
  };

  // Filter function
  const filteredData = staffData.filter(item => 
    item.name.toLowerCase().includes(searchName.toLowerCase()) &&
    item.id.toLowerCase().includes(searchId.toLowerCase()) &&
    (searchDepartment === '' || item.department === searchDepartment)
  );

  // Add employee handler
  const handleAddEmployee = (values) => {
    const newEmployee = {
      key: (staffData.length + 1).toString(),
      id: `EMP${(staffData.length + 1).toString().padStart(3, '0')}`,
      isActive: true,
      ...values
    };

    setStaffData([...staffData, newEmployee]);
    setIsAddEmployeeModalVisible(false);
    addEmployeeForm.resetFields();
    message.success('Employee added successfully');
  };



  return (
    <div className="p-4">
      <Card hoverable>
        <Space className="mb-4" wrap style={{ padding: "20px" }}>
          <Input 
            placeholder="Search by Name" 
            prefix={<SearchOutlined />}
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            style={{ width: 300 }} 
          />
          <Input 
            placeholder="Search by ID" 
            prefix={<SearchOutlined />}
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            style={{ width: 300 }}
          />
          <Select
            placeholder="Filter by Department"
            style={{ width: 300 }}
            value={searchDepartment || undefined}
            allowClear
            onChange={(value) => setSearchDepartment(value || '')}
          >
            {departments.map(dept => (
              <Option key={dept} value={dept}>{dept}</Option>
            ))}
          </Select>
          
          <Button 
            icon={<ReloadOutlined />}
            onClick={resetFilters}
          >
            Reset Filters
          </Button>
          <SignedOut>
  <SignInButton />
</SignedOut>

          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => setIsAddEmployeeModalVisible(true)}
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
  );
}