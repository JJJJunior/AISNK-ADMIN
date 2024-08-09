import { useEffect, useState } from "react";
import { Table } from "antd";
import { LogType } from "../lib/types";
import { getSystemLogs } from "../lib/actions";

const SystemLogs = () => {
  const [systemLogs, setSystemLogs] = useState<LogType[]>([]);

  const fetchSystemLogs = async () => {
    try {
      const res = await getSystemLogs();
      if (res.status === 200) {
        setSystemLogs(res.data.data);
      }
    } catch (err) {
      // console.log(err);
    }
  };

  useEffect(() => {
    // 获取系统日志数据
    fetchSystemLogs();
  }, []);

  const columns = [
    {
      title: "用户",
      dataIndex: "user",
      key: "user",
    },
    {
      title: "操作类型",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "IP地址",
      dataIndex: "ip",
      key: "ip",
    },
    {
      title: "详情",
      dataIndex: "info",
      key: "info",
      render: (info: string) => <p className="w-[400px]">{info}</p>,
    },
    {
      title: "操作时间",
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
  ];
  return (
    <div>
      <Table dataSource={systemLogs} columns={columns} rowKey="ID" className="border shadow-lg" />;
    </div>
  );
};

export default SystemLogs;
