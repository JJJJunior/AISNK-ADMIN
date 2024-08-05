import { useEffect, useState } from "react";
import DataTable from "../../components/products/DataTable";
import { Button } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { ProductType } from "../../lib/types";
import Loader from "../../components/Loader";
import { getProducts } from "../../lib/actions";

const Collections = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchProducts = async () => {
    try {
      const res = await getProducts();
      if (res.status === 200) {
        // console.log(res.data.data);
        setProducts(res.data.data);
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // console.log(products);

  return loading ? (
    <Loader />
  ) : (
    <div className="w-full">
      <div>
        <Button type="primary">
          <a href="/products/new">
            添加产品
            <PlusCircleOutlined className="ml-2" />
          </a>
        </Button>
      </div>
      <div className="w-full">
        <DataTable dataSource={products} fetchCollections={fetchProducts} />
      </div>
    </div>
  );
};

export default Collections;
