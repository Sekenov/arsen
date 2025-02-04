import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import "./FavoritesPage.css";

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingProductId, setLoadingProductId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      const savedUser = localStorage.getItem("user");
      const user = savedUser ? JSON.parse(savedUser) : null;
      const token = user?.token;

      if (!token) {
        console.error("Пользователь не авторизован");
        return;
      }

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

        if (!response.ok) {
          throw new Error("Ошибка при загрузке избранных товаров");
        }

        const data = await response.json();
        setFavorites(data.products);
      } catch (error) {
        console.error("Ошибка загрузки избранного:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
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

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="favorites-page">
      <h2 className="favorites-page__title">Избранные товары</h2>

      {favorites.length === 0 ? (
        <p className="favorites-page__empty">У вас нет избранных товаров</p>
      ) : (
        <div className="favorites-page__products">
          {favorites.map((product) => (
            <div
              key={product.id}
              className="favorites-product-card"
              onClick={() => handleProductClick(product.id)}
            >
              <img
                src={product.images[0]}
                alt={product.name}
                className="favorites-product-card__image"
              />
              <h3 className="favorites-product-card__name">{product.name}</h3>
              <p className="favorites-product-card__price">
                {product.discount ? (
                  <>
                    <span className="favorites-product-card__price--old">
                      {product.price} ₽
                    </span>
                    {product.discount.new_price.toFixed(2)} ₽
                  </>
                ) : (
                  `${product.price} ₽`
                )}
              </p>
              <p
                className={`favorites-product-card__status ${
                  product.inStock ? "in-stock" : "out-of-stock"
                }`}
              >
                {product.inStock ? "В наличии" : "Нет в наличии"}
              </p>
              <button
                className="favorites-product-card__button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(product.id);
                }}
                disabled={loadingProductId === product.id}
              >
                {loadingProductId === product.id ? "Добавление..." : "В корзину"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
