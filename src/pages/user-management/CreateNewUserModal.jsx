import { HomeOutlined, MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Row, Select, message } from 'antd';
import axios from 'axios';
import React, { useState, useEffect } from 'react';

export default function CreateNewUserModal() {
  const [addEmployeeForm] = Form.useForm();
  const [formValues, setFormValues] = useState({});

  // Watch first_name and last_name fields to auto-generate username
  useEffect(() => {
    const { first_name, last_name } = formValues;
    
    if (first_name && last_name) {
      // Create username from first letter of first name and full last name
      const generatedUsername = (first_name.charAt(0) + last_name).toLowerCase()
        .replace(/\s+/g, '') // Remove spaces
        .replace(/[^a-z0-9]/g, ''); // Remove special characters
      
      addEmployeeForm.setFieldsValue({ username: generatedUsername });
    }
  }, [formValues.first_name, formValues.last_name]);

  // Handle input changes to update formValues state
  const handleInputChange = (changedValues, allValues) => {
    setFormValues(allValues);
  };

  // Handle form submission
  const handleSubmit = async (values) => {
    const clerkUserData = {
        first_name: values.first_name,
        last_name: values.last_name,
        email_address: values.email_address,  // map email to email_address
        phone_number: values.phone_number,   // map phone to phone_number
        username: values.username,
        password: values.password,
        skip_password_checks: true,
        skip_password_requirement: true
      };

      console.log(clerkUserData)
    axios.post('http://localhost:3060/api/users/createUser', clerkUserData).then((response) => {
        message.success(`Successfully Created User: ${values.first_name} ${values.last_name}`);
        console.log('Form submitted with values:', values);
      }).catch((error) => {
        console.log('Error submitting form:', error);
        message.error('Failed to submit form');
      }
      );
  };

  return (
    <div>
      <Form
        form={addEmployeeForm}
        layout="vertical"
        onFinish={handleSubmit}
        onValuesChange={handleInputChange}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="first_name"
              label="First Name"
              rules={[{ required: true, message: 'Please enter your first name' }]}
            >
              <Input prefix={<UserOutlined />} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="last_name"
              label="Last Name"
              rules={[{ required: true, message: 'Please enter your last name' }]}
            >
              <Input prefix={<UserOutlined />} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="email_address"
              label="Email"
              rules={[
                { required: true, message: 'Please enter email' },
                { type: 'email', message: 'Please enter a valid email' }
              ]}
            >
              <Input prefix={<MailOutlined />} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="phone_number"
              label="Phone Number"
              rules={[{ required: true, message: 'Please enter phone number' }]}
            >
              <Input prefix={<PhoneOutlined />} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="username"
              label="Username"
              rules={[
                { required: true, message: 'Please enter username' },
              ]}
            >
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: 'Please enter password' }]}
            >
              <Input.Password />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Add User
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}