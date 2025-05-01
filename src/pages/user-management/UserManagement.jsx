import React, { useEffect, useState } from 'react';
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
import axios from 'axios';
import CreateNewUserModal from './CreateNewUserModal';


export default function UserManagement() {
//   const {  user } = useUser();
//   console.log(user?.username)
//   console.log(user)


  // Enhanced staff data with more fields
  const [staffData, setStaffData] = useState([]);

  // State for filtering and modals
  const [searchName, setSearchName] = useState('');
  const [searchId, setSearchId] = useState('');
//   const [searchDepartment, setSearchDepartment] = useState('');
  const [isAddEmployeeModalVisible, setIsAddEmployeeModalVisible] = useState(false);
  const [isDetailsDrawerVisible, setIsDetailsDrawerVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isEditEmployeeModalVisible, setIsEditEmployeeModalVisible] = useState(false);
  const [editEmployeeForm] = Form.useForm();
  const [addEmployeeForm] = Form.useForm();
  const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        axios.get('http://localhost:3060/api/users/getUsers').then((response)=> {
            setStaffData(response.data);
            console.log("response from api",response.data);
            setLoading(false);
        }).catch((error) => {
            message.error('Error fetching users');
            console.log(error);
            setLoading(false); 
        });
    }, [])


    const refreshState = () => {
        axios.get('http://localhost:3060/api/users/getUsers')
          .then((response) => {
            setStaffData(response.data);
            console.log("response from api", response.data);
          })
          .catch((error) => {
            message.error('Error fetching users');
            console.log(error);
          });
      };
  // Departments for dropdown
  const departments = [
    'Mining Operations',
    'Safety & Compliance',
    'Equipment Maintenance',
    'Geological Research',
    'Administration'
  ];


  const handleDeleteEmployee = (id) => {
    axios.delete(`http://localhost:3060/api/users/deleteUser/${id}`).then((response) => {
        console.log("response from api", response.data);
        message.success('Employee deleted successfully');
        refreshState()
    }
    ).catch((error) => {
        message.error('Error deleting user');
        console.log(error);
    });
    // setStaffData(staffData.filter(item => item.key !== key));
    
  };
  // Table columns configuration
  const columns = [
    {
      title: 'User ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id.localeCompare(b.id)
    },
    {
      title: 'First Name',
      dataIndex: 'first_name',
      key: 'first_name',
      sorter: (a, b) => a.first_name.localeCompare(b.name)
    },
    {
      title: 'Last name',
      dataIndex: 'last_name',
      key: 'last_name',
      sorter: (a, b) => a.last_name.localeCompare(b.department)
    },
    {
      title: 'Email',
      dataIndex: 'primary_email',
      key: 'primary_email'
    },
    // {
    //   title: 'Status',
    //   dataIndex: 'isActive',
    //   key: 'isActive',
    //   render: (isActive) => (
    //     <Tag color={isActive ? 'green' : 'red'}>
    //       {isActive ? 'Active' : 'Inactive'}
    //     </Tag>
    //   )
    // },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          {/* <EyeOutlined 
            onClick={() => {
              setSelectedEmployee(record);
              setIsDetailsDrawerVisible(true);
            }} 
          />
          <EditOutlined onClick={() => prepareEditModal(record)}/> */}
          <Popconfirm
            title="Delete User"
            description="Are you sure to delete this user?"
            onConfirm={() => handleDeleteEmployee(record?.id)}
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
    // setSearchDepartment('');
    message.info('Filters have been reset');
  };

  // Delete Employee Handler
 
  
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
    item.first_name.toLowerCase()?.includes(searchName?.toLowerCase()) &&
    item.id.toLowerCase()?.includes(searchId?.toLowerCase()) 
    // &&
    // (searchDepartment === '' || item.department === searchDepartment)
  );

  // Add employee handler
 



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
          {/* <Select
            placeholder="Filter by Department"
            style={{ width: 300 }}
            value={searchDepartment || undefined}
            allowClear
            onChange={(value) => setSearchDepartment(value || '')}
          >
            {departments.map(dept => (
              <Option key={dept} value={dept}>{dept}</Option>
            ))}
          </Select> */}
          
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
          loading={loading}
          pagination={{ 
            pageSize: 10, 
            showSizeChanger: true 
          }}
        />
      </Card>
      
      {/* Add Employee Modal */}
      <Modal
        title="Add New Employee"
        open={isAddEmployeeModalVisible}
        onCancel={() => setIsAddEmployeeModalVisible(false)}
        footer={null}
      >
        <CreateNewUserModal />
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