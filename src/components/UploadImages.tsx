import React from "react";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Upload } from "antd";
import ImgCrop from "antd-img-crop";
import type { UploadFile, UploadProps } from "antd";

interface UploadImagesProps {
  fileList: UploadFile[];
  setFileList: () => void;
}

const UploadImages: React.FC<UploadImagesProps> = ({ setFileList, fileList }) => {
  const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  return (
    <ImgCrop rotationSlider>
      <Upload action={`${import.meta.env.VITE_API_URL}/upload`} withCredentials fileList={fileList} onChange={onChange}>
        <Button onClick={(evt) => evt.preventDefault()} icon={<UploadOutlined />}>
          点击上传最多6张
        </Button>
      </Upload>
    </ImgCrop>
  );
};

export default UploadImages;
