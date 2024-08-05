import React from "react";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Upload } from "antd";
import type { UploadProps } from "antd";
import { FileListType } from "../lib/types";

interface UploadImagesProps {
  fileList: FileListType[];
  setFileList: React.Dispatch<React.SetStateAction<FileListType[]>>;
}

const UploadImages: React.FC<UploadImagesProps> = ({ setFileList, fileList }) => {
  const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  return (
    <Upload
      maxCount={12}
      action={`${import.meta.env.VITE_API_URL}/upload`}
      withCredentials
      fileList={fileList}
      multiple
      onChange={onChange}
    >
      <Button
        type="primary"
        onClick={(evt) => evt.preventDefault()}
        icon={<UploadOutlined />}
        disabled={fileList.length > 11}
      >
        点击上传最多12张
      </Button>
    </Upload>
  );
};

export default UploadImages;
