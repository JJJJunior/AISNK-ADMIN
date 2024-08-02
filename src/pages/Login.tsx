import React, { useState } from "react";
import type { FormProps } from "antd";
import { Button, Checkbox, Form, Input } from "antd";
import { message } from "antd/lib";
import { login } from "../lib/actions.ts";
import { useCookies } from "react-cookie";

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

const App: React.FC = () => {
  const [cookies, setCookies] = useCookies(["token"]);
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    // console.log('Success:', values);
    try {
      setLoading(true);
      const res = await login(values);
      if (res.status === 200) {
        setCookies("Authorization", res.data.token);
        message.success("登录成功");
        // 用navigate有时候无法跳转
        window.location.href = "/";
      }
    } catch (err) {
      console.log(err);
      message.error("登录失败");
    } finally {
      form.resetFields();
      setLoading(false);
    }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  return (
    <div className="h-screen flex justify-center items-center">
      <Form
        form={form}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        className="border border-green-500 h-1/3 w-1/3 p-8 rounded-lg"
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

        <Form.Item<FieldType> name="remember" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={loading}>
            {loading ? "加载中..." : "登录"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default App;
