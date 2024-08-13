import React, { useRef, useState } from "react";
import type { FilterDropdownProps } from "antd/es/table/interface";
import { Button, Input, InputRef, message, Popconfirm, Space, Table, TableColumnsType, TableColumnType } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { CollectionType } from "../../lib/types";
import { deleteCollection } from "../../lib/actions";
import { FileListType } from "../../lib/types";
import { Image } from "antd";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/auth";
import { LogType } from "../../lib/types";
import { logAction, getIpInDBIP } from "../../lib/actions";

type DataIndex = keyof CollectionType;

interface DataTableProps {
  dataSource: CollectionType[];
  fetchCollections: () => Promise<void>;
}

const DataTable: React.FC<DataTableProps> = ({ dataSource, fetchCollections }) => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);
  const { user } = useAuth();

  const handleSearch = (selectedKeys: string[], confirm: FilterDropdownProps["confirm"], dataIndex: DataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  // console.log(dataSource);

  const handleDelete = async (record: CollectionType) => {
    // console.log(key);
    try {
      const res = await deleteCollection(Number(record.id));
      if (res.status === 200) {
        const data = await getIpInDBIP();
        const logobj: LogType = {
          user: user?.username || "",
          type: "栏目管理",
          info: user?.username + "删除了栏目:" + record.title,
          ip: data.ipAddress || "",
          country_name: data.countryName || "",
          city: data.city || "",
        };
        await logAction(logobj);
        message.success("删除成功");
      }
    } catch (err) {
      // console.log(err);
    } finally {
      fetchCollections();
    }
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };
  const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<CollectionType> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`查找 ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => clearFilters && handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });
  const columns: TableColumnsType<CollectionType> = [
    {
      title: "栏目名称",
      dataIndex: "title",
      key: "title",
      ...getColumnSearchProps("title"),
      render: (_, record) => <Link to={`/collections/${record.id}`}>{record.title}</Link>,
    },
    {
      title: "栏目图片",
      dataIndex: "fileList",
      key: "fileList",
      render: (fileList: FileListType[]) => (
        <Image className="rounded-lg shadow-lg" width={80} src={fileList[0]?.response?.url} />
      ),
    },
    {
      title: "栏目排序",
      dataIndex: "order_index",
      key: "order_index",
    },
    {
      title: "栏目描述",
      dataIndex: "description",
      key: "description",
      ...getColumnSearchProps("description"),
      render: (text) => <p className="truncate">{text}</p>,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      ...getColumnSearchProps("status"),
      render: (text) => (
        <p
          className={`ellipsis-1-lines max-w-[800px] ${
            text === "上线" ? "text-green-500" : text === "归档" ? "text-yellow-500" : "text-red-500"
          }`}
        >
          {text}
        </p>
      ),
    },
    {
      title: "产品数量",
      dataIndex: "products",
      key: "products",
      sorter: (a) => a.products?.length,
      sortDirections: ["descend", "ascend"],
      render: (products) => products?.length,
    },
    {
      title: "操作",
      dataIndex: "operation",
      key: "operation",
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <div className="flex flex-col items-center gap-2">
            <Button type="primary">
              <Link to={`/collections/${record.id}`}>编辑</Link>
            </Button>
            <Popconfirm title="确定删除?" onConfirm={() => handleDelete(record)}>
              <Button type="primary" danger>
                删除
              </Button>
            </Popconfirm>
          </div>
        ) : null,
    },
  ];
  return <Table sticky={true} columns={columns} dataSource={dataSource} rowKey="id" className="border shadow-lg" />;
};

export default DataTable;
