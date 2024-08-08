import { useState, useEffect } from "react";
import RegisterForm from "../components/RegisterForm.tsx";
import { UserType } from "../lib/types";
import { getUsers } from "../lib/actions.ts";
import { useCookies } from "react-cookie";
import { Table } from "antd";

const Users = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [cookies] = useCookies();
  const fetchUsers = async () => {
    // 获取用户数据
    try {
      const res = await getUsers(cookies);
      res.status === 200 && setUsers(res.data.data);
    } catch (err) {
      // console.log(err);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);
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
      dataIndex: "CreatedAt",
      key: "CreatedAt",
      render: (CreatedAt: Date) => {
        const date = new Date(CreatedAt);
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
  ];
  return (
    <div>
      <RegisterForm />
      <Table dataSource={users} columns={columns} rowKey="ID" className="border shadow-lg" />;
    </div>
  );
};

export default Users;
