import React, { useState } from "react";
import type { FormProps } from "antd";
import { Button, Form, Input } from "antd";
import { message } from "antd/lib";
import { useNavigate } from "react-router-dom";
import { register } from "../lib/actions.ts";

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

const App: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    // console.log('Success:', values);
    if (values.username == "" || values.password == "") {
      return;
    }
    try {
      setLoading(true);
      const res = await register(values);
      if (res.status === 200) {
        message.success("注册成功");
        navigate("/users");
      }
    } catch (err) {
      // console.log(err)
      if (err) {
        message.error("注册失败");
      }
    } finally {
      setLoading(false);
      form.resetFields();
    }
  };

  return (
    <Form
      form={form}
      name="basic"
      layout="inline"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.Item<FieldType>
        label="Username"
        name="username"
        rules={[{ required: true, message: "Please input your username!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<FieldType>
        label="Password"
        name="password"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" disabled={loading}>
          {loading ? "加载中..." : "添加用户"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default App;
