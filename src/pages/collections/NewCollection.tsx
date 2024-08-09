import React, { useState, useEffect } from "react";
import { Button, Form, Input, Spin, message, Select } from "antd";
import { CloseSquareOutlined, LoadingOutlined } from "@ant-design/icons";
import { CollectionStatusType, CollectionType } from "../../lib/types";
import { useNavigate } from "react-router-dom";
import UploadImages from "../../components/UploadImages";
import { addCollection, getCollectionStatus, logAction } from "../../lib/actions";
import { FileListType } from "../../lib/types";
import { UploadFile } from "antd/lib";
import SortableList, { SortableItem } from "react-easy-sort";
import arrayMoveImmutable from "array-move";
import { useAuth } from "../../context/auth";
import { LogType } from "../../lib/types";
import { getIpInDBIP } from "../../lib/actions";

const NewCollection: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<FileListType[]>([]);
  const navigate = useNavigate();
  const [status, setStatus] = useState<CollectionStatusType[] | null>(null);
  const { user } = useAuth();

  const onFinish = async (values: any) => {
    const newCollection: CollectionType = {
      ...values,
      fileList: fileList.map((file, index) => ({ ...file, order_index: index + 1 })),
    };
    if (newCollection.fileList.length === 0) {
      message.error("请上传至少一张图片");
      return;
    }
    // console.log("Received values of form: ", newCollection);
    try {
      setLoading(true);
      const res = await addCollection(newCollection);
      if (res.status === 200) {
        message.success("创建栏目成功");
        const data = await getIpInDBIP();
        const logobj: LogType = {
          user: user?.username || "",
          type: "栏目管理",
          info: user?.username + "创建了栏目:" + newCollection.title,
          ip: data.ipAddress || "",
          country_name: data.countryName || "",
          city: data.city || "",
        };
        await logAction(logobj);
        navigate("/collections");
      }
    } catch (err) {
      // console.log(err);
      message.error("创建栏目失败");
    } finally {
      cleanAll();
      setLoading(false);
    }
  };
  const fetchCollectionStatus = async () => {
    try {
      const res = await getCollectionStatus();
      if (res.status === 200) {
        setStatus(res.data.data);
      }
    } catch (err) {
      // console.log("[getCollectionStatus_GET]...", err);
    }
  };

  useEffect(() => {
    fetchCollectionStatus();
  }, []);
  const cleanAll = () => {
    form.resetFields();
    setFileList([]);
  };
  const handRemoveImageBtn = (evt: React.MouseEvent<HTMLButtonElement>, uploadedFile: UploadFile) => {
    evt.preventDefault();
    setFileList((prevState) => prevState.filter((item) => item.response.url !== uploadedFile.response.url));
  };

  const onSortEnd = (oldIndex: number, newIndex: number) => {
    setFileList((array) => arrayMoveImmutable(array, oldIndex, newIndex));
  };

  return (
    <div>
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item label="栏目名称" name="title" rules={[{ required: true, message: "栏目名称不能为空" }]}>
          <Input />
        </Form.Item>
        <Form.Item label="栏目图片" valuePropName="点击上传图片">
          <UploadImages setFileList={setFileList} fileList={fileList} />
        </Form.Item>
        <SortableList onSortEnd={onSortEnd} className="flex flex-wrap gap-4" draggedItemClassName="dragged">
          {fileList.length > 0 &&
            fileList.map((item, index) => (
              <SortableItem key={index}>
                <div key={index} className="flex relative">
                  <div className="h-42 w-36">
                    <img
                      src={item.response?.url}
                      alt={item.name}
                      width={200}
                      height={300}
                      className="rounded-xl border shadow-lg"
                    />
                  </div>
                  <button
                    onClick={(evt) => handRemoveImageBtn(evt, item)}
                    className="absolute right-2 top-2 text-2xl text-gray-400 hover:text-red-600"
                  >
                    <CloseSquareOutlined />
                  </button>
                </div>
              </SortableItem>
            ))}
        </SortableList>
        <div className="mt-6">
          <Form.Item label="栏目描述" name="description" rules={[{ required: true, message: "栏目描述不能为空" }]}>
            <Input.TextArea rows={6} />
          </Form.Item>
        </div>
        <Form.Item label="栏目状态" name="status" rules={[{ required: true, message: "请选择状态" }]}>
          <Select placeholder="选择状态">
            {status &&
              status.length > 0 &&
              status.map((status) => (
                <Select.Option key={status.status} value={status.status}>
                  {status.status}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <div className="flex gap-4">
            <Button type="primary" htmlType="submit" disabled={loading}>
              {loading ? <Spin indicator={<LoadingOutlined spin />} /> : "提交"}
            </Button>
            <Button
              type="primary"
              onClick={() => {
                navigate("/collections");
              }}
            >
              返回
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default NewCollection;
