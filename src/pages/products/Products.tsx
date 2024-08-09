import { useEffect, useState } from "react";
import DataTable from "../../components/products/DataTable";
import { Button, Select, message } from "antd";
import { PlusCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { CollectionType, ProductType } from "../../lib/types";
import Loader from "../../components/Loader";
import { getProducts, getCollections } from "../../lib/actions";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";
import { LogType } from "../../lib/types";
import { logAction, getIpInDBIP } from "../../lib/actions";

const Collections = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddColumns, setShowAddColumns] = useState(false);
  const [collections, setCollections] = useState<CollectionType[]>([]);
  const [selectedPds, setSelectedPds] = useState<ProductType[]>([]);
  const [selectedCols, setSelectedCols] = useState<CollectionType[]>([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  const receiveDataFromChild = (productIds: []) => {
    const selectedProducts = productIds
      .map((pid) => products.find((product: ProductType) => product.id === pid) || null)
      .filter((product): product is ProductType => product !== null);
    setSelectedPds(selectedProducts);
  };
  const fetchCollections = async () => {
    try {
      const res = await getCollections();
      if (res.status === 200) {
        // console.log(res.data.data);
        setCollections(res.data.data);
      }
    } catch (err) {
      // console.log(err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await getProducts();
      if (res.status === 200) {
        // console.log(res.data.data);
        setProducts(res.data.data);
        setLoading(false);
      }
    } catch (err) {
      // console.log(err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCollections();
  }, []);

  // console.log(products);

  const handleProductConnectionToCollections = async () => {
    // TODO: 实现产品和栏目关联的逻辑
    const newData = {
      product_ids: selectedPds.map((p) => p.id),
      collection_ids: selectedCols.map((col) => col.id),
    };

    if (newData.collection_ids.length === 0) {
      message.warning("请先选择栏目");
      return;
    }
    // 发送请求到后台，实现产品和栏目关联
    // console.log(newData, "fasongshujudaohoutai");
    try {
      setLoading(true);
      const res = await axios.post("/products_on_collections", newData);
      if (res.status === 200) {
        const data = await getIpInDBIP();
        const logobj: LogType = {
          user: user?.username || "",
          type: "产品管理",
          info:
            user?.username +
            `将产品:${selectedPds.map((p) => p.title).join(",")}批量上架了栏目:${selectedCols
              .map((col) => col.title)
              .join(",")}`,
          ip: data.ipAddress || "",
          country_name: data.countryName || "",
          city: data.city || "",
        };
        await logAction(logobj);
        message.success("产品上架栏目成功");
        window.location.href = "/products";
      }
      // console.log(res.data.data);
    } catch (err) {
      // console.log(err);
      message.error("产品上架栏目失败");
    } finally {
      setShowAddColumns(false);
      setLoading(false);
    }
  };
  const handleSelected = (values: []) => {
    const selectedCollections = values
      .map((value) => collections.find((collection: CollectionType) => collection.id === value) || null)
      .filter((collection): collection is CollectionType => collection !== null);
    setSelectedCols(selectedCollections);
  };
  return loading ? (
    <Loader />
  ) : (
    <div className="w-full">
      <div className="flex gap-4">
        {showAddColumns && (
          <>
            <Select
              showSearch
              mode="multiple"
              style={{ width: 300 }}
              placeholder="选择栏目"
              onChange={handleSelected}
              filterOption={(input, option) => (option?.value ?? "").toLowerCase().includes(input.toLowerCase())}
              options={(collections || []).map((collection) => ({
                value: collection.id,
                label: collection.title,
              }))}
            />
            <Button onClick={handleProductConnectionToCollections} type="primary" ghost>
              批量上栏目
              <PlusCircleOutlined className="ml-2" />
            </Button>
            <Button
              onClick={() => {
                setShowAddColumns(false);
                setSelectedCols([]);
                setSelectedPds([]);
                navigate("/products");
              }}
            >
              取消
              <CloseCircleOutlined />
            </Button>
          </>
        )}
        <Button type="primary">
          <Link to="/products/new">
            添加产品
            <PlusCircleOutlined className="ml-2" />
          </Link>
        </Button>
      </div>
      <div className="w-full">
        <DataTable
          dataSource={products}
          fetchCollections={fetchProducts}
          setShowAddColumns={setShowAddColumns}
          receiveDataFromChild={receiveDataFromChild}
        />
      </div>
    </div>
  );
};

export default Collections;
