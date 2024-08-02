import React, { useState, useEffect } from "react";
import UploadImages from "../../components/UploadImages";
import { Button, Form, Input, InputNumber, Select, Spin } from "antd";
import { CloseSquareOutlined, LoadingOutlined } from "@ant-design/icons";
import { CollectionType, ProductType } from "../../lib/types";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { UploadFile } from "antd/lib";
import { useCookies } from "react-cookie";
import { ProductStatusType } from "../../lib/types";
import { getCollections, getProductStatus, updateProduct, getProductDetails } from "../../lib/actions";
import { useParams } from "react-router-dom";

const EditProduct: React.FC = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [collections, setCollections] = useState<CollectionType[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [cookies] = useCookies<any>();
  const [status, setStatus] = useState<ProductStatusType[] | null>(null);
  const { productId } = useParams();

  const fetchCollections = async () => {
    try {
      const res = await getCollections();
      res.status === 200 && setCollections(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };
  const fetchProductStatus = async () => {
    try {
      const res = await getProductStatus();
      if (res.status === 200) {
        setStatus(res.data.data);
      }
    } catch (err) {
      console.log("[fetchProductStatus_GET]...", err);
    }
  };

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const res = await getProductDetails(productId ? productId : "");
      if (res.status === 200) {
        // console.log(res.data.data);
        form.setFieldsValue({
          ...res.data.data,
          collections: res.data.data.collections.map((collection) => collection.id),
        });
        setFileList(res.data.data.fileList || []);
      }
    } catch (err) {
      console.log("[collectionId_GET]", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
    fetchProductStatus();
    fetchProductDetails();
  }, [productId, form]);

  const onFinish = async (values: any) => {
    const newProduct: ProductType = {
      ...values,
      fileList,
      colors: replaceSymbols(values.colors),
      sizes: replaceSymbols(values.sizes),
      tags: replaceSymbolsInTags(values.tags),
      collections: values.collections
        .map((id: string) => collections.find((collection) => collection.id === id))
        .filter(Boolean),
    };
    console.log("Received values of form: ", newProduct);
    setLoading(true);
    try {
      const res = await updateProduct(Number(productId), newProduct, cookies);
      if (res.status === 200) {
        message.success("更新产品成功");
        navigate("/products");
      }
    } catch (err) {
      console.error(err);
      message.error("更新产品失败");
    } finally {
      cleanAll();
      setLoading(false);
    }
  };

  const cleanAll = () => {
    form.resetFields();
    setFileList([]);
  };
  const handRemoveImageBtn = (evt: React.MouseEvent<HTMLButtonElement>, uploadedFile: UploadFile) => {
    evt.preventDefault();
    setFileList((prevState) => prevState.filter((item) => item.response.url !== uploadedFile.response.url));
  };

  const replaceSymbols = (input: string): string => {
    // 定义要替换的符号和目标符号
    const symbolsToReplace = /[， ；、‧]/g;
    const replacementSymbol = ",";

    // 检查字符串是否包含要替换的符号
    if (symbolsToReplace.test(input)) {
      // 使用正则表达式替换所有符合条件的符号
      return input.replace(symbolsToReplace, replacementSymbol);
    }

    // 如果没有符号要替换，直接返回原字符串
    return input;
  };

  const replaceSymbolsInTags = (input: string): string => {
    // 定义要替换的符号和目标符号
    const symbolsToReplace = /[，、]/g;
    const replacementSymbol = ",";

    // 检查字符串是否包含要替换的符号
    if (symbolsToReplace.test(input)) {
      // 使用正则表达式替换所有符合条件的符号
      return input.replace(symbolsToReplace, replacementSymbol);
    }

    // 如果没有符号要替换，直接返回原字符串
    return input;
  };

  return (
    <div>
      <Form form={form} onFinish={onFinish} layout="vertical">
        <div>
          <Form.Item label="产品名称" name="title" rules={[{ required: true, message: "产品名称不能为空" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="产品状态" name="status" rules={[{ required: true, message: "请选择状态" }]}>
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
        </div>
        <div className="flex gap-2">
          <Form.Item label="产品编码" name="code" rules={[{ required: true, message: "产品编码不能为空" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="价格 ($)">
            <Form.Item name="price" noStyle rules={[{ required: true, message: "价格不能为空" }]}>
              <InputNumber min={0} />
            </Form.Item>
          </Form.Item>
          <Form.Item label="费用 ($)">
            <Form.Item name="expense" noStyle>
              <InputNumber min={0} />
            </Form.Item>
          </Form.Item>
          <Form.Item label="库存">
            <Form.Item name="stock" noStyle>
              <InputNumber min={0} />
            </Form.Item>
          </Form.Item>
        </div>
        <Form.Item
          label="产品图片"
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
        <div className="flex flex-wrap gap-4">
          {fileList.length > 0 &&
            fileList.map((item, index) => (
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
            ))}
        </div>
        <Form.Item label="产品描述" name="description" rules={[{ required: true, message: "产品描述不能为空" }]}>
          <Input.TextArea rows={6} />
        </Form.Item>
        <div className="grid grid-cols-3 justify-center gap-4">
          <Form.Item label="上线栏目" name="collections" rules={[{ required: true, message: "栏目不能为空" }]}>
            <Select placeholder="选择栏目" mode="multiple">
              {collections.length > 0 &&
                collections.map((collection) => (
                  <Select.Option value={collection.id} key={collection.id}>
                    {collection.title}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item label="分类名称" name="category" rules={[{ required: true, message: "分类名称不能为空" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="颜色" name="colors">
            <Input placeholder="比如：red、yellow、blue 仅支持逗号、顿号、空格进行分隔" />
          </Form.Item>
          <Form.Item label="尺寸" name="sizes">
            <Input placeholder="比如：36 37 41 42 仅支持逗号、顿号、空格进行分隔" />
          </Form.Item>
          <Form.Item label="标签" name="tags">
            <Input placeholder="比如：shoes，hot，summer 只支持逗号、顿号进行分隔" />
          </Form.Item>
        </div>
        <Form.Item>
          <div className="flex gap-4">
            <Button type="primary" htmlType="submit" disabled={loading}>
              {loading ? <Spin indicator={<LoadingOutlined spin />} /> : "保存"}
            </Button>
            <Button
              type="primary"
              onClick={() => {
                navigate("/products");
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

export default EditProduct;
