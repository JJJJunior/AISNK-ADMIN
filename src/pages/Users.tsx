import { useState, useEffect } from "react";
import RegisterForm from "../components/RegisterForm.tsx";
import { Table, Popconfirm, Button, message } from "antd";
import { useAuth } from "../context/auth.ts";
import { LogType, UserType } from "../lib/types";
import { getIpInDBIP, logAction, deleteUser, getUsers, resetPassword } from "../lib/actions.ts";

const Users = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const { user } = useAuth();
  const fetchUsers = async () => {
    // 获取用户数据
    try {
      const res = await getUsers();
      res.status === 200 && setUsers(res.data.data);
    } catch (err) {
      // console.log(err);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  console.log(user);

  const handleDelete = async (record: UserType) => {
    if (record.username === user?.username) {
      message.error("无法删除当前登录用户");
      return;
    }
    try {
      const res = await deleteUser(Number(record.id));
      if (res.status === 200) {
        const data = await getIpInDBIP();
        const logobj: LogType = {
          user: user?.username || "",
          type: "用户管理",
          info: user?.username + `删除了用户：${record.username}`,
          ip: data.ipAddress || "",
          country_name: data.countryName || "",
          city: data.city || "",
        };
        await logAction(logobj);
        message.success("用户删除成功");
        fetchUsers();
      }
    } catch (err) {
      message.error("用户删除失败");
      // console.log(err);
    }
  };

  const handleRest = async (record: UserType) => {
    try {
      const res = await resetPassword(Number(record.id));
      if (res.status === 200) {
        const data = await getIpInDBIP();
        const logobj: LogType = {
          user: user?.username || "",
          type: "用户管理",
          info: user?.username + `重置了:${record.username}的密码`,
          ip: data.ipAddress || "",
          country_name: data.countryName || "",
          city: data.city || "",
        };
        await logAction(logobj);
        message.success("密码重置成功");
        fetchUsers();
      }
    } catch (err) {
      message.error("密码重置失败");
      // console.log(err);
    }
  };

  const columns = [
    {
      title: "用户名",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "角色",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "创建",
      dataIndex: "created_at",
      key: "created_at",
      render: (created_at: Date) => {
        const date = new Date(created_at);
        const formattedDate = date
          .toLocaleString("sv-SE", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          })
          .replace("T", " ");
        return formattedDate;
      },
    },
    {
      title: "密码重置",
      dataIndex: "operation",
      key: "operation",
      render: (_: any, record: UserType) =>
        users.length >= 1 ? (
          <div>
            <Popconfirm title="确认重置?" onConfirm={() => handleRest(record)}>
              <Button type="primary">密码重置</Button>
            </Popconfirm>
          </div>
        ) : null,
    },
    {
      title: "操作",
      dataIndex: "operation",
      key: "operation",
      render: (_: any, record: UserType) =>
        users.length >= 1 ? (
          <div>
            <Popconfirm title="确定删除?" onConfirm={() => handleDelete(record)}>
              <Button type="primary" danger>
                删除
              </Button>
            </Popconfirm>
          </div>
        ) : null,
    },
  ];
  return (
    <div>
      <RegisterForm fetchUsers={fetchUsers} />
      <Table dataSource={users} columns={columns} rowKey="id" className="border shadow-lg" />;
    </div>
  );
};

export default Users;
