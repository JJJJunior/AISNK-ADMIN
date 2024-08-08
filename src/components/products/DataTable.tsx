import React, { useRef, useState } from "react";
import type { FilterDropdownProps } from "antd/es/table/interface";
import { Button, Input, InputRef, message, Popconfirm, Tag, Space, TableColumnType, Image, Table } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { FileListType, ProductType } from "../../lib/types";
import { deleteProduct } from "../../lib/actions";
import type { TableColumnsType } from "antd";
import { Link } from "react-router-dom";

type DataIndex = keyof ProductType;

interface DataTableProps {
  dataSource: ProductType[] | [];
  fetchCollections: () => Promise<void>;
  setShowAddColumns: React.Dispatch<React.SetStateAction<boolean>>;
  receiveDataFromChild: (productIds: []) => void;
}

const DataTable: React.FC<DataTableProps> = ({
  dataSource,
  fetchCollections,
  setShowAddColumns,
  receiveDataFromChild,
}) => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);

  // rowSelection object indicates the need for row selection
  const rowSelection = {
    onChange: (selectedRows: []) => {
      if (selectedRows.length > 0) {
        setShowAddColumns(true);
      } else {
        setShowAddColumns(false);
      }
      // console.log(`selectedRowKeys: ${selectedRowKeys}`, "selectedRows: ", selectedRows);
      receiveDataFromChild(selectedRows);
    },
    getCheckboxProps: (record: ProductType) => ({
      disabled: record.id === "Disabled User", // Column configuration not to be checked
      name: record.id,
    }),
  };

  // console.log(dataSource);

  const handleSearch = (selectedKeys: string[], confirm: FilterDropdownProps["confirm"], dataIndex: DataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleDelete = async (key: React.Key) => {
    // console.log(key);
    try {
      const res = await deleteProduct(Number(key));
      if (res.status === 200) {
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
  const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<ProductType> => ({
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
  const columns: TableColumnsType<ProductType> = [
    {
      title: "产品名称",
      dataIndex: "title",
      key: "title",
      ...getColumnSearchProps("title"),
      render: (_, record) => (
        <Link to={`/products/${record.id}`} className="text-green-500">
          {record.title}
        </Link>
      ),
    },
    {
      title: "产品编码",
      dataIndex: "code",
      key: "code",
      ...getColumnSearchProps("code"),
    },
    {
      title: "产品图片",
      dataIndex: "fileList",
      key: "fileList",
      render: (fileList: FileListType[]) => (
        <Image className="rounded-lg shadow-lg" width={80} src={fileList[0]?.response?.url} />
      ),
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      ...getColumnSearchProps("status"),
      render: (text) => (
        <Tag className={`${text === "上线" ? "text-green-500" : text === "归档" ? "text-yellow-500" : "text-red-500"}`}>
          {text}
        </Tag>
      ),
    },
    {
      title: "价格",
      dataIndex: "price",
      key: "price",
      render: (text) => <p className="text-sm font-semibold">{Number(text).toFixed(2)}</p>,
    },
    {
      title: "库存",
      dataIndex: "stock",
      key: "stock",
    },
    {
      title: "分类名称",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "尺码表",
      dataIndex: "size_image",
      key: "size_image",
      render: (size_image) => <p className="w-8">{size_image === "" || size_image === undefined ? "无" : "有"}</p>,
    },
    {
      title: "操作",
      dataIndex: "operation",
      key: "operation",
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <div className="flex flex-col items-center gap-2">
            <Button type="primary">
              <Link to={`/products/${record.id}`}>编辑</Link>
            </Button>
            <Popconfirm title="确定删除?" onConfirm={() => handleDelete(record.id)}>
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
      <Table
        rowSelection={{
          type: "checkbox",
          ...rowSelection,
        }}
        sticky={true}
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        className="border overflow-hidden shadow-lg"
      />
    </div>
  );
};

export default DataTable;
