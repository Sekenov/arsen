import React, { useEffect, useState } from "react";
import Loader from "./Loader";

const WithLoading = (WrappedComponent, fetchData) => {
  return function WithLoadingComponent(props) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const loadData = async () => {
        try {
          const result = await fetchData();
          setData(result);
        } catch (error) {
          console.error("Ошибка загрузки данных:", error);
        } finally {
          setLoading(false);
        }
      };

      loadData();
    }, []);

    if (loading) {
      return <Loader />;
    }

    return <WrappedComponent data={data} {...props} />;
  };
};

export default WithLoading;
