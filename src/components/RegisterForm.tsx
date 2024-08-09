import React, { useState } from "react";
import type { FormProps } from "antd";
import { Button, Form, Input } from "antd";
import { message } from "antd/lib";
import { register, getIpInDBIP, logAction } from "../lib/actions.ts";
import { LogType } from "../lib/types";
import { useAuth } from "../context/auth.ts";

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

interface AppProps {
  fetchUsers: () => Promise<void>;
}

const App: React.FC<AppProps> = ({ fetchUsers }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { user } = useAuth();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    // console.log('Success:', values);
    if (values.username == "" || values.password == "") {
      return;
    }
    try {
      setLoading(true);
      const res = await register(values);
      if (res.status === 200) {
        const data = await getIpInDBIP();
        const logobj: LogType = {
          user: user?.username || "",
          type: "用户管理",
          info: user?.username + `创建了用户:${values.username}`,
          ip: data.ipAddress || "",
          country_name: data.countryName || "",
          city: data.city || "",
        };
        await logAction(logobj);
        message.success("注册成功");
        fetchUsers();
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
