import { useEffect, useState } from "react";
import DataTable from "../../components/collections/DataTable";
import { Button } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { CollectionType } from "../../lib/types";
import Loader from "../../components/Loader";
import { getCollections } from "../../lib/actions";

const Collections = () => {
  const [collections, setCollections] = useState<CollectionType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCollections = async () => {
    try {
      const res = await getCollections();
      if (res.status === 200) {
        // console.log(res.data.data);
        setCollections(res.data.data);
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  // console.log(collections);

  return loading ? (
    <Loader />
  ) : (
    <div className="w-full">
      <div>
        <Button type="primary">
          <a href="/collections/new">
            添加栏目
            <PlusCircleOutlined className="ml-2" />
          </a>
        </Button>
      </div>
      <div className="w-full p-4">
        <DataTable dataSource={collections} fetchCollections={fetchCollections} />
      </div>
    </div>
  );
};

export default Collections;
