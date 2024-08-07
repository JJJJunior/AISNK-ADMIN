import React, { useState } from "react";
import type { FormProps } from "antd";
import { Button, Form, Input } from "antd";
import { message } from "antd/lib";
import { login } from "../lib/actions.ts";

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

const App: React.FC = () => {
  // const [cookies, setCookies] = useCookies(["token"]);
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    // console.log('Success:', values);
    try {
      setLoading(true);
      const res = await login(values);
      if (res.status === 200) {
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

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  return (
    <div className="h-screen flex flex-col gap-4 justify-center items-center">
      <h1 className="text-xl font-bold text-center">AISNK产品管理系统</h1>
      <Form
        form={form}
        name="basic"
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
        className="border shadow-lg h-1/3 w-1/3 p-8 rounded-lg"
      >
        <Form.Item<FieldType> label="用户名" name="username" rules={[{ required: true, message: "请输入用户名！" }]}>
          <Input />
        </Form.Item>

        <Form.Item<FieldType> label="密码" name="password" rules={[{ required: true, message: "请输入密码!" }]}>
          <Input.Password />
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
