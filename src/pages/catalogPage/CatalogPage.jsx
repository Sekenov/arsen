import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./CatalogPage.css";
import Loader from "../../components/loader/Loader";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const CatalogPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingProductId, setLoadingProductId] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [totalProducts, setTotalProducts] = useState(0);

  // Fetch filters, products, and favorites on page load
  useEffect(() => {
    const fetchFiltersAndProducts = async () => {
      try {
        const filtersResponse = await fetch(
          `https://ittalker-online-store-8b609d501d03.herokuapp.com/api/v1/catalog/products/filters?category_id=${id}`
        );
        const filtersData = await filtersResponse.json();
        setFilters(filtersData.filters);

        const productsResponse = await fetch(
          "https://ittalker-online-store-8b609d501d03.herokuapp.com/api/v1/catalog/products",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ category_id: id, page }),
          }
        );

        const productsData = await productsResponse.json();
        setProducts(productsData.products);
        setPageSize(productsData.page_size);
        setTotalProducts(productsData.total);

        // Fetch favorites
        await fetchFavorites();
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFiltersAndProducts();
  }, [id, page]);

  // Fetch the user's favorite products
  const fetchFavorites = async () => {
    const savedUser = localStorage.getItem("user");
    const user = savedUser ? JSON.parse(savedUser) : null;
    const token = user?.token;

    if (!token) return;

    try {
      const response = await fetch(
        "https://ittalker-online-store-8b609d501d03.herokuapp.com/api/v1/users/favorites",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const favoriteProductIds = data.products.map((product) => product.id);
        setFavorites(favoriteProductIds);
      } else {
        console.error("Ошибка при загрузке избранного.");
      }
    } catch (error) {
      console.error("Ошибка при получении избранных товаров:", error);
    }
  };

  const handleAddToCart = async (productId) => {
    const savedUser = localStorage.getItem("user");
    const user = savedUser ? JSON.parse(savedUser) : null;
    const token = user?.token;

    if (!token) {
      console.error("Пользователь не авторизован");
      return;
    }

    try {
      setLoadingProductId(productId);
      const response = await fetch(
        "https://ittalker-online-store-8b609d501d03.herokuapp.com/api/v1/cart/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId, quantity: 1 }),
        }
      );

      if (!response.ok) {
        throw new Error("Ошибка при добавлении товара в корзину");
      }

      console.log("Товар успешно добавлен в корзину");
    } catch (error) {
      console.error("Ошибка при добавлении товара:", error);
    } finally {
      setLoadingProductId(null);
    }
  };

  const handleFavoriteToggle = async (productId) => {
    const savedUser = localStorage.getItem("user");
    const user = savedUser ? JSON.parse(savedUser) : null;
    const token = user?.token;

    if (!token) {
      console.error("Пользователь не авторизован");
      return;
    }

    try {
      if (favorites.includes(productId)) {
        // Remove from favorites
        const response = await fetch(
          `https://ittalker-online-store-8b609d501d03.herokuapp.com/api/v1/users/products/favorites/${productId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Ошибка при удалении товара из избранного");
        }

        console.log("Товар успешно удален из избранного");
        setFavorites((prevFavorites) =>
          prevFavorites.filter((id) => id !== productId)
        );
      } else {
        // Add to favorites
        const response = await fetch(
          "https://ittalker-online-store-8b609d501d03.herokuapp.com/api/v1/users/favorites",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ productId }),
          }
        );

        if (!response.ok) {
          throw new Error("Ошибка при добавлении товара в избранное");
        }

        console.log("Товар успешно добавлен в избранное");
        setFavorites((prevFavorites) => [...prevFavorites, productId]);
      }
    } catch (error) {
      console.error("Ошибка при работе с избранным:", error);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleFilterChange = (filterId, valueId) => {
    setSelectedFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (!updatedFilters[filterId]) {
        updatedFilters[filterId] = new Set();
      }

      if (updatedFilters[filterId].has(valueId)) {
        updatedFilters[filterId].delete(valueId);
      } else {
        updatedFilters[filterId].add(valueId);
      }

      return updatedFilters;
    });
  };

  const handlePriceChange = (min, max) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      price_range: { min, max },
    }));
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="catalog-page">
      <div className="catalog-page__header">
        <h2 className="catalog-page__title">Каталог товаров</h2>
        <p className="catalog-page__breadcrumb">Главная / Каталог</p>
      </div>

      <div className="catalog-page__content">
        <aside className="catalog-page__filters">
          <h3 className="filters__title">Фильтры</h3>
          {filters.map((filter) => (
            <div key={filter.filter_id} className="filter-group">
              <h4 className="filter-group__title">{filter.filter_name}</h4>
              {filter.filter_type === "checkbox" &&
                filter.values.map((value) => (
                  <label key={value.value_id} className="filter-group__label">
                    <input
                      type="checkbox"
                      onChange={() => handleFilterChange(filter.filter_id, value.value_id)}
                      checked={selectedFilters[filter.filter_id]?.has(value.value_id) || false}
                    />
                    {value.value_name}
                  </label>
                ))}

              {filter.filter_type === "range" && (
                <div className="filter-group__range">
                  <input
                    type="number"
                    placeholder="Мин."
                    defaultValue={filter.values.min_price}
                    onChange={(e) =>
                      handlePriceChange(
                        Number(e.target.value),
                        selectedFilters.price_range?.max || filter.values.max_price
                      )
                    }
                  />
                  <input
                    type="number"
                    placeholder="Макс."
                    defaultValue={filter.values.max_price}
                    onChange={(e) =>
                      handlePriceChange(
                        selectedFilters.price_range?.min || filter.values.min_price,
                        Number(e.target.value)
                      )
                    }
                  />
                </div>
              )}
            </div>
          ))}
        </aside>

        <section className="catalog-page__products">
          {products.map((product) => (
            <div
              key={product.id}
              className="product-card"
              onClick={() => handleProductClick(product.id)}
            >
              <div className="product-card__image-wrapper">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="product-card__image"
                />
                {product.discount && (
                  <span className="product-card__discount">-{product.discount.amount}%</span>
                )}
              </div>
              <h3 className="product-card__name">{product.name}</h3>
              <p className="product-card__price">
                {product.discount ? (
                  <>
                    <span className="product-card__price--old">{product.price} ₽</span>
                    {product.discount.new_price.toFixed(2)} ₽
                  </>
                ) : (
                  `${product.price} ₽`
                )}
              </p>
              <p className={`product-card__status ${product.inStock ? "in-stock" : "out-of-stock"}`}>
                {product.inStock ? "В наличии" : "Нет в наличии"}
              </p>
              <div className="product-card__actions">
                <button
                  className="product-card__button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product.id);
                  }}
                  disabled={loadingProductId === product.id}
                >
                  {loadingProductId === product.id ? "Добавление..." : "В корзину"}
                </button>
                <button
                  className="product-card__favorite"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFavoriteToggle(product.id);
                  }}
                >
                  {favorites.includes(product.id) ? <FaHeart color="red" /> : <FaRegHeart />}
                </button>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default CatalogPage;
