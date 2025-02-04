import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import "./ProductPage.css";

const ProductPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addToCartLoading, setAddToCartLoading] = useState(false);

  // Загрузка информации о товаре
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `https://ittalker-online-store-8b609d501d03.herokuapp.com/api/v1/catalog/products/${productId}`
        );
        if (!response.ok) {
          throw new Error("Ошибка при загрузке товара");
        }
        const productData = await response.json();
        setProduct(productData);
      } catch (error) {
        console.error("Ошибка загрузки товара:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Добавление товара в корзину
  const handleAddToCart = async () => {
    const savedUser = localStorage.getItem("user");
    const user = savedUser ? JSON.parse(savedUser) : null;
    const token = user?.token;

    if (!token) {
      console.error("Пользователь не авторизован");
      return;
    }

    setAddToCartLoading(true);

    try {
      const response = await fetch(
        "https://ittalker-online-store-8b609d501d03.herokuapp.com/api/v1/cart/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId: product.id, quantity: 1 }),
        }
      );

      if (!response.ok) {
        throw new Error("Ошибка при добавлении товара в корзину");
      }

      console.log("Товар успешно добавлен в корзину");
    } catch (error) {
      console.error("Ошибка при добавлении товара:", error);
    } finally {
      setAddToCartLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!product) {
    return <p>Товар не найден</p>;
  }

  return (
    <div className="product-page">
      <div className="product-page__breadcrumb">
        <Link to="/">Главная</Link> /{" "}
        <Link to={`/catalog/${product.category.id}`}>{product.category.name}</Link> / Карточка товара
      </div>

      <div className="product-page__content">
        <div className="product-page__main">
          <div className="product-page__image-wrapper">
            <img
              src={product.images[0]}
              alt={product.name}
              className="product-page__image"
            />
          </div>

          <div className="product-page__details">
            <h1 className="product-page__name">{product.name}</h1>
            <div className="product-page__characteristics">
              <h3>Характеристики:</h3>
              <ul>
                {product.characteristics.map((char, index) => (
                  <li key={index}>
                    <strong>{char.name}:</strong> {char.value}
                  </li>
                ))}
              </ul>
              <Link to="#" className="product-page__more-characteristics">
                Все характеристики
              </Link>
            </div>

            <div className="product-page__price">
              <p>
                {product.discount ? (
                  <>
                    <span className="product-page__price--old">
                      {product.price} ₽
                    </span>{" "}
                    {product.discount.new_price.toFixed(2)} ₽
                  </>
                ) : (
                  `${product.price} ₽`
                )}
              </p>
              <button
                className="product-page__add-to-cart"
                onClick={handleAddToCart}
                disabled={addToCartLoading}
              >
                {addToCartLoading ? "Добавление..." : "В корзину"}
              </button>
            </div>
          </div>
        </div>

        <div className="product-page__reviews">
          <h3>Отзывы</h3>
          <p>1325 отзывов | 2000 оценок</p>
          <div className="product-page__review-images">
            {Array.from({ length: 6 }).map((_, i) => (
              <img
                key={i}
                src="https://via.placeholder.com/150"
                alt={`Review ${i + 1}`}
                className="product-page__review-image"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
