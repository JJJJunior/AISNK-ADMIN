import React, { useState, useEffect } from "react";
import { Button, Form, Input, Spin, message, Select } from "antd";
import UploadImages from "../../components/UploadImages";
import { CloseSquareOutlined, LoadingOutlined } from "@ant-design/icons";
import { CollectionType, CollectionStatusType } from "../../lib/types";
import { useNavigate, useParams } from "react-router-dom";
import { getCollectionStatus, updateCollection, getCollectionDetails } from "../../lib/actions";
import { FileListType } from "../../lib/types";
import { UploadFile } from "antd/lib";
import SortableList, { SortableItem } from "react-easy-sort";
import arrayMoveImmutable from "array-move";
import { useAuth } from "../../context/auth";
import { LogType } from "../../lib/types";
import { getIpInDBIP, logAction } from "../../lib/actions";

const EditCollection = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<FileListType[]>([]);
  const [status, setStatus] = useState<CollectionStatusType[]>([]);
  const { collectionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
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

    const fetchCollectionDetails = async () => {
      setLoading(true);
      try {
        const res = await getCollectionDetails(collectionId ? collectionId : "");
        if (res.status === 200) {
          form.setFieldsValue(res.data.data);
          setFileList(res.data.data.fileList || []);
        }
      } catch (err) {
        // console.log("[collectionId_GET]", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCollectionStatus();
    fetchCollectionDetails();
  }, [collectionId, form]);

  const onFinish = async (values: any) => {
    const newCollection: CollectionType = {
      ...values,
      fileList: fileList.map((file, index) => ({ ...file, order_index: index + 1 })),
    };
    if (newCollection.fileList.length === 0) {
      message.error("请上传至少一张图片");
      return;
    }
    setLoading(true);
    // console.log(newCollection);
    try {
      const res = await updateCollection(Number(collectionId), newCollection);
      if (res.status === 200) {
        message.success("修改栏目成功");
        const data = await getIpInDBIP();
        const logObj: LogType = {
          user: user?.username || "",
          type: "栏目管理",
          info: user?.username + "修改了栏目:" + newCollection.title,
          ip: data.ipAddress || "",
          country_name: data.countryName || "",
          city: data.city || "",
        };
        await logAction(logObj);
        navigate("/collections");
      }
    } catch (err) {
      // console.log(err);
      message.error("修改栏目失败");
    } finally {
      setLoading(false);
    }
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
        <Form.Item
          label="栏目图片"
          valuePropName="点击上传图片"
          rules={[
            {
              validator: () => {
                if (!fileList || fileList.length === 0) {
                  return Promise.reject(new Error("请至少上传一张图片"));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
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
            {status.map((s) => (
              <Select.Option key={s.status} value={s.status}>
                {s.status}
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

export default EditCollection;
