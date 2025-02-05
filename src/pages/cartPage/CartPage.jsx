import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import "./CartPage.css";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingProductId, setUpdatingProductId] = useState(null);
  const navigate = useNavigate();

  const fetchCartItems = async () => {
    const savedUser = localStorage.getItem("user");
    const user = savedUser ? JSON.parse(savedUser) : null;
    const token = user?.token;

    if (!token) {
      console.error("Пользователь не авторизован");
      return;
    }

    try {
      const response = await fetch(
        "https://ittalker-online-store-8b609d501d03.herokuapp.com/api/v1/cart/items",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Ошибка при загрузке товаров в корзине");
      }

      const data = await response.json();
      setCartItems(data.cart.products);
    } catch (error) {
      console.error("Ошибка загрузки корзины:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateCartItemQuantity = async (productId, newQuantity) => {
    const savedUser = localStorage.getItem("user");
    const user = savedUser ? JSON.parse(savedUser) : null;
    const token = user?.token;

    if (!token) {
      console.error("Пользователь не авторизован");
      return;
    }

    setUpdatingProductId(productId);
    try {
      const response = await fetch(
        "https://ittalker-online-store-8b609d501d03.herokuapp.com/api/v1/cart/update",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId, quantity: newQuantity }),
        }
      );

      if (!response.ok) {
        throw new Error("Ошибка при обновлении количества товара");
      }

      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.productId === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } catch (error) {
      console.error("Ошибка при обновлении товара:", error);
    } finally {
      setUpdatingProductId(null);
    }
  };

  const handleRemoveFromCart = async (productId) => {
    const savedUser = localStorage.getItem("user");
    const user = savedUser ? JSON.parse(savedUser) : null;
    const token = user?.token;

    if (!token) {
      console.error("Пользователь не авторизован");
      return;
    }

    setUpdatingProductId(productId);
    try {
      const response = await fetch(
        "https://ittalker-online-store-8b609d501d03.herokuapp.com/api/v1/cart/remove",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId }),
        }
      );

      if (!response.ok) {
        throw new Error("Ошибка при удалении товара из корзины");
      }

      setCartItems((prevItems) =>
        prevItems.filter((item) => item.productId !== productId)
      );
    } catch (error) {
      console.error("Ошибка при удалении товара:", error);
    } finally {
      setUpdatingProductId(null);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  if (loading) {
    return <Loader />;
  }

  const totalPrice = cartItems.reduce(
    (total, item) => total + (item.newPrice || 0) * item.quantity,
    0
  );

  return (
    <div className="cart-page">
      <h2 className="cart-page__title">Корзина</h2>

      <div className="cart-page__content">
        <div className="cart-page__items">
          {cartItems.length === 0 ? (
            <p className="cart-page__empty">Корзина пуста</p>
          ) : (
            cartItems.map((item) => (
              <div key={item.productId} className="cart-item">
                <input type="checkbox" className="cart-item__checkbox" />
                <div
                  className="cart-item__image-wrapper"
                  onClick={() => handleProductClick(item.productId)}
                >
                  <img
                    src={item.productImage || "https://via.placeholder.com/150"}
                    alt={item.productName}
                    className="cart-item__image"
                  />
                </div>
                <div className="cart-item__details">
                  <h3
                    className="cart-item__name"
                    onClick={() => handleProductClick(item.productId)}
                  >
                    {item.productName}
                  </h3>
                  <p className="cart-item__price">
                    {item.oldPrice && (
                      <span className="cart-item__price--old">
                        {item.oldPrice} ₽
                      </span>
                    )}
                    {item.newPrice ? `${item.newPrice} ₽` : "Цена не указана"}
                  </p>
                  <div className="cart-item__quantity-controls">
                    {updatingProductId === item.productId ? (
                      <Loader />
                    ) : (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Останавливаем всплытие события
                            updateCartItemQuantity(
                              item.productId,
                              item.quantity - 1 > 0 ? item.quantity - 1 : 1
                            );
                          }}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Останавливаем всплытие события
                            updateCartItemQuantity(
                              item.productId,
                              item.quantity + 1
                            );
                          }}
                        >
                          +
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <button
                  className="cart-item__remove"
                  onClick={(e) => {
                    e.stopPropagation(); // Останавливаем всплытие события
                    handleRemoveFromCart(item.productId);
                  }}
                >
                  Удалить
                </button>
              </div>
            ))
          )}
        </div>

        <aside className="cart-page__summary">
          <h3>Сумма к оплате</h3>
          <p className="cart-page__total">Итого: {totalPrice.toFixed(2)} ₽</p>
          <button className="cart-page__checkout-button">Оформить заказ</button>
        </aside>
      </div>
    </div>
  );
};

export default CartPage;
