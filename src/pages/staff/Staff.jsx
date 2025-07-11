import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  DatePicker,
  Spin
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
import dayjs from 'dayjs';

const { Option } = Select;

// API Configuration
const API_BASE_URL = 'http://localhost:3061/api/sensors';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API Service Functions
const employeeAPI = {
  getAll: () => api.get('/employees'),
  create: (data) => api.post('/employees', data),
  update: (id, data) => api.put(`/employees/${id}`, data),
  delete: (id) => api.delete(`/employees/${id}`),
};

export default function StaffManagement() {
  const { user } = useUser();

  // State management
  const [loading, setLoading] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [searchId, setSearchId] = useState('');
  const [searchDepartment, setSearchDepartment] = useState('');
  const [isAddEmployeeModalVisible, setIsAddEmployeeModalVisible] = useState(false);
  const [isDetailsDrawerVisible, setIsDetailsDrawerVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isEditEmployeeModalVisible, setIsEditEmployeeModalVisible] = useState(false);
  const [editEmployeeForm] = Form.useForm();
  const [addEmployeeForm] = Form.useForm();
  // Removed testData, as staffData will now directly hold API data
  const [staffData, setStaffData] = useState([]);


  // Departments for dropdown
  const departments = [
    'Mining Operations',
    'Safety & Compliance',
    'Equipment Maintenance',
    'Geological Research',
    'Administration'
  ];

  // Fetch employees on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  // API Functions
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await employeeAPI.getAll();
      // Directly set the data from the API response
      // We will adjust the table columns and other uses to match this structure
      setStaffData(response.data.data);
      
      // Log for debugging - this should show your raw backend data
      console.log("Response data from API (raw):", response.data.data);
      console.log("Current staffData state:", staffData); // Will likely be old data due to async update

      message.success('Employees loaded successfully');
    } catch (error) {
      console.error('Error fetching employees:', error);
      message.error('Failed to load employees. Displaying sample data.');
      // Fallback to sample data. IMPORTANT: Ensure this sample data
      // matches the *expected backend structure* if you want it to display
      // correctly with the adjusted columns.
      setStaffData([
        {
          _id: 'sample1', // Use _id or whatever unique identifier your backend provides
          employeeId: 'EMP001', // Example of a specific employee ID field
          first_name: 'John',
          last_name: 'Doe',
          department: 'Mining Operations',
          position: 'Senior Geologist',
          email: 'john.doe@miningco.com',
          phone_number: '+1 (555) 123-4567', // Backend field name
          address: '123 Mining Street, Denver, CO 80202',
          date_of_birth: '1985-06-15', // Backend field name (string format)
          is_active: true // Backend field name
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Add Employee (already correctly uses backend field names)
  const handleAddEmployee = async (values) => {
    setLoading(true);
    try {
      const employeeData = {
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        phone_number: values.phone_number,
        department: values.department,
        address: values.address,
        date_of_birth: values.date_of_birth ? dayjs(values.date_of_birth).format('YYYY-MM-DD') : null,
        position: values.position,
        is_active: true
      };

      await employeeAPI.create(employeeData);
      message.success('Employee added successfully');
      setIsAddEmployeeModalVisible(false);
      addEmployeeForm.resetFields();
      fetchEmployees(); // Refresh the list
    } catch (error) {
      console.error('Error adding employee:', error);
      message.error('Failed to add employee');
    } finally {
      setLoading(false);
    }
  };

  // Edit Employee (already correctly uses backend field names)
  const handleEditEmployee = async (values) => {
    setLoading(true);
    try {
      const employeeData = {
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        phone_number: values.phone_number,
        department: values.department,
        address: values.address,
        date_of_birth: values.date_of_birth ? dayjs(values.date_of_birth).format('YYYY-MM-DD') : null,
        position: values.position,
        is_active: values.is_active
      };

      // Assuming selectedEmployee.id holds the backend's unique ID (_id or employeeId)
      await employeeAPI.update(selectedEmployee._id || selectedEmployee.employeeId, employeeData); 
      message.success('Employee updated successfully');
      setIsEditEmployeeModalVisible(false);
      fetchEmployees(); // Refresh the list
    } catch (error) {
      console.error('Error updating employee:', error);
      message.error('Failed to update employee');
    } finally {
      setLoading(false);
    }
  };

  // Delete Employee (already correctly uses backend field name)
  const handleDeleteEmployee = async (employeeId) => {
    setLoading(true);
    try {
      await employeeAPI.delete(employeeId);
      message.success('Employee deleted successfully');
      fetchEmployees(); // Refresh the list
    } catch (error) {
      console.error('Error deleting employee:', error);
      message.error('Failed to delete employee');
    } finally {
      setLoading(false);
    }
  };

  const prepareEditModal = (record) => {
    // When preparing for edit, ensure the selectedEmployee has the original backend keys
    // and map them to the form field names
    setSelectedEmployee(record);
    editEmployeeForm.setFieldsValue({
      first_name: record.first_name,
      last_name: record.last_name,
      email: record.email,
      phone_number: record.phone_number, // Use backend's key
      department: record.department,
      address: record.address,
      date_of_birth: record.date_of_birth ? dayjs(record.date_of_birth) : null, // Use backend's key
      position: record.position,
      is_active: record.is_active // Use backend's key
    });
    setIsEditEmployeeModalVisible(true);
  };

  // --- START OF CRITICAL CHANGES FOR TABLE COLUMNS ---
  const columns = [
    {
      title: 'Employee ID',
      // Assuming your backend sends 'employeeId' or 'id' as the unique identifier
      dataIndex: 'employeeId', 
      key: 'employeeId',
      sorter: (a, b) => a.employeeId?.toString().localeCompare(b.employeeId?.toString() || '')
    },
    {
      title: 'Name',
      // Render combines first_name and last_name from backend data
      key: 'name',
      render: (text, record) => `${record.first_name} ${record.last_name}`,
      sorter: (a, b) => `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`)
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
      dataIndex: 'is_active', // Match the backend key directly
      key: 'is_active',
      render: (is_active) => ( // Use the backend key here too
        <Tag color={is_active ? 'green' : 'red'}>
          {is_active ? 'Active' : 'Inactive'}
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
              setSelectedEmployee(record); // The raw backend record is fine for details
              setIsDetailsDrawerVisible(true);
            }} 
          />
          <EditOutlined onClick={() => prepareEditModal(record)}/>
          <Popconfirm
            title="Delete Staff Member"
            description="Are you sure to delete this staff member?"
            onConfirm={() => handleDeleteEmployee(record._id || record.employeeId)} // Use backend's unique ID for deletion
            okText="Yes"
            cancelText="No"
          >
            <DeleteOutlined />
          </Popconfirm>
        </Space>
      )
    }
  ];
  // --- END OF CRITICAL CHANGES FOR TABLE COLUMNS ---

  // Reset Filters Function
  const resetFilters = () => {
    setSearchName('');
    setSearchId('');
    setSearchDepartment('');
    message.info('Filters have been reset');
  };

  // Filter function (updated to use backend keys for filtering)
  const filteredData = staffData.filter(item => 
    item.first_name?.toLowerCase().includes(searchName?.toLowerCase() || '') && // Use first_name for search
    (item.employeeId?.toString() || item._id?.toString())?.toLowerCase().includes(searchId?.toLowerCase() || '') && // Use employeeId or _id for search
    (searchDepartment === '' || item.department === searchDepartment)
  );

  return (
    <div className="p-4">
      <Spin spinning={loading}>
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

            <Button 
              icon={<ReloadOutlined />}
              onClick={fetchEmployees}
            >
              Refresh Data
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
            dataSource={filteredData} // Use staffData directly
            rowKey={record => record._id || record.employeeId} // Crucial: tell Table which field is the unique key
            size="small"
            style={{ padding: "20px" }}
            pagination={{ 
              pageSize: 10, 
              showSizeChanger: true 
            }}
          />
        </Card>
      </Spin>

      {/* Add Employee Modal (no changes needed, it uses backend field names) */}
      <Modal
        title="Add New Employee"
        open={isAddEmployeeModalVisible}
        onCancel={() => setIsAddEmployeeModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={addEmployeeForm}
          layout="vertical"
          onFinish={handleAddEmployee}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="first_name"
                label="First Name"
                rules={[{ required: true, message: 'Please enter first name' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="last_name"
                label="Last Name"
                rules={[{ required: true, message: 'Please enter last name' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Please enter email' },
                  { type: 'email', message: 'Please enter valid email' }
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone_number"
                label="Phone Number"
                rules={[{ required: true, message: 'Please enter phone number' }]}
              >
                <Input />
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

          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: 'Please enter address' }]}
          >
            <Input.TextArea rows={2} />
          </Form.Item>

          <Form.Item
            name="date_of_birth"
            label="Date of Birth"
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Add Employee
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Employee Details Drawer (updated to use backend field names) */}
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
                {/* Use the actual ID field from your backend */}
                <strong>Employee ID:</strong> {selectedEmployee.employeeId || selectedEmployee._id}
              </Col>
              <Col span={12}>
                {/* Use the actual backend key 'is_active' */}
                <strong>Status:</strong> 
                <Tag color={selectedEmployee.is_active ? 'green' : 'red'}>
                  {selectedEmployee.is_active ? 'Active' : 'Inactive'}
                </Tag>
              </Col>
            </Row>

            <Divider orientation="left">Personal Information</Divider>
            {/* Combine first_name and last_name for display */}
            <p><UserOutlined /> <strong>Name:</strong> {selectedEmployee.first_name} {selectedEmployee.last_name}</p>
            <p><MailOutlined /> <strong>Email:</strong> {selectedEmployee.email}</p>
            {/* Use the actual backend key 'phone_number' */}
            <p><PhoneOutlined /> <strong>Phone:</strong> {selectedEmployee.phone_number}</p>
            <p><HomeOutlined /> <strong>Address:</strong> {selectedEmployee.address}</p>
            {/* Use the actual backend key 'date_of_birth' and format with dayjs */}
            {selectedEmployee.date_of_birth && (
              <p><strong>Date of Birth:</strong> {dayjs(selectedEmployee.date_of_birth).format('MMMM D, YYYY')}</p>
            )}

            <Divider orientation="left">Professional Details</Divider>
            <p><strong>Department:</strong> {selectedEmployee.department}</p>
            <p><strong>Position:</strong> {selectedEmployee.position}</p>
          </Card>
        )}
      </Drawer>

      {/* Edit Employee Modal (no changes needed as it already uses backend field names) */}
      <Modal
        title="Edit Employee"
        open={isEditEmployeeModalVisible}
        onCancel={() => setIsEditEmployeeModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={editEmployeeForm}
          layout="vertical"
          onFinish={handleEditEmployee}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="first_name"
                label="First Name"
                rules={[{ required: true, message: 'Please enter first name' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="last_name"
                label="Last Name"
                rules={[{ required: true, message: 'Please enter last name' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Please enter email' },
                  { type: 'email', message: 'Please enter valid email' }
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone_number"
                label="Phone Number"
                rules={[{ required: true, message: 'Please enter phone number' }]}
              >
                <Input />
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

          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: 'Please enter address' }]}
          >
            <Input.TextArea rows={2} />
          </Form.Item>

          <Form.Item
            name="date_of_birth"
            label="Date of Birth"
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="is_active"
            label="Status"
            valuePropName="checked"
          >
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Update Employee
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}