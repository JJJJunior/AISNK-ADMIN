import React from "react";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Upload } from "antd";
import type { UploadProps } from "antd";

interface UploadImagesProps {
  setSizeImage: React.Dispatch<React.SetStateAction<string>>;
}

const UploadOne: React.FC<UploadImagesProps> = ({ setSizeImage }) => {
  const onChange: UploadProps["onChange"] = ({ file: newfile }) => {
    if (newfile.status === "done") {
      setSizeImage(newfile.response.url);
    }
  };

  return (
    <Upload action={`${import.meta.env.VITE_API_URL}/upload`} withCredentials onChange={onChange}>
      <Button onClick={(evt) => evt.preventDefault()} icon={<UploadOutlined />}>
        点击上传最多1张
      </Button>
    </Upload>
  );
};

export default UploadOne;
