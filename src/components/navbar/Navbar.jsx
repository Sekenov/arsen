import React, { useState } from "react";
import { FaSearch, FaList, FaShoppingCart, FaUser, FaHeart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ user, allProducts }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const navigate = useNavigate();

  // Фильтрация товаров при изменении поиска
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = allProducts.filter((product) =>
      product.name.toLowerCase().includes(query)
    );
    setFilteredProducts(filtered);
  };

  // Обработка клика на товар в результатах поиска
  const handleProductClick = (productId) => {
    setSearchQuery("");  // Очищаем поисковый запрос
    setFilteredProducts([]);  // Скрываем список результатов
    navigate(`/product/${productId}`);  // Переход на страницу товара
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">It Talker Shop</Link>
      </div>

      <div className="navbar-search">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Поиск товаров..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      <div className="navbar-menu">
        <div className="menu-item">
          <FaList />
          <span>Каталог</span>
        </div>
        <div className="menu-item">
          <FaHeart />
          <Link to="/favorites">Избранное</Link>
        </div>
        <div className="menu-item">
          <FaShoppingCart />
          <Link to="/cart">Корзина</Link>
        </div>
        <div className="menu-item">
          <FaUser />
          <Link to={user ? "/profile" : "/login"}>
            {user ? "Профиль" : "Войти"}
          </Link>
        </div>
      </div>

      {/* Список результатов поиска */}
      {searchQuery && (
        <div className="search-results">
          {filteredProducts.length === 0 ? (
            <p>Товары не найдены</p>
          ) : (
            <div className="search-results__list">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="search-results__item"
                  onClick={() => handleProductClick(product.id)}
                >
                  <img src={product.images[0]} alt={product.name} />
                  <span>{product.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
