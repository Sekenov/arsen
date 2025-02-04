import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import "./SearchPage.css";

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [recentViewed, setRecentViewed] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchProducts();

    // Получаем историю поиска и последние просмотренные товары из localStorage
    const savedHistory = localStorage.getItem("searchHistory");
    const savedViewed = localStorage.getItem("recentViewed");
    if (savedHistory) setSearchHistory(JSON.parse(savedHistory));
    if (savedViewed) setRecentViewed(JSON.parse(savedViewed));
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        "https://ittalker-online-store-8b609d501d03.herokuapp.com/api/v1/catalog/products",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ page: 1, page_size: 100 }),
        }
      );
      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error("Ошибка при загрузке товаров:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`);

    // Обновляем последние просмотренные товары
    const updatedViewed = [product, ...recentViewed.filter((p) => p.id !== product.id)];
    setRecentViewed(updatedViewed);
    localStorage.setItem("recentViewed", JSON.stringify(updatedViewed));

    // Скрываем выпадающий блок
    setShowDropdown(false);
  };

  const handleSearchSubmit = () => {
    if (!searchQuery.trim()) return;

    // Сохраняем запрос в истории поиска
    const updatedHistory = [searchQuery, ...searchHistory.filter((q) => q !== searchQuery)];
    setSearchHistory(updatedHistory);
    localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));

    // Очистка поля поиска и скрытие блока
    setSearchQuery("");
    setShowDropdown(false);
  };

  const filteredProducts = searchQuery
    ? products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="search-page">
      <div className="search-bar" onClick={() => setShowDropdown(true)}>
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Поиск"
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={() => setShowDropdown(true)} 
        />
      </div>

      {showDropdown && (
        <div className="search-dropdown" ref={dropdownRef}>
          <div className="search-dropdown__left">
            <h3>История поиска</h3>
            {searchHistory.length === 0 ? (
              <p>История пуста</p>
            ) : (
              searchHistory.map((query, index) => (
                <div
                  key={index}
                  className="history-item"
                  onClick={() => setSearchQuery(query)}
                >
                  {query}
                </div>
              ))
            )}
          </div>

          <div className="search-dropdown__right">
            <h3>{searchQuery ? "Результаты поиска" : "Вы недавно смотрели"}</h3>
            {searchQuery ? (
              filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="product-item"
                    onClick={() => handleProductClick(product)}
                  >
                    <img src={product.images[0]} alt={product.name} />
                    <p>{product.name}</p>
                  </div>
                ))
              ) : (
                <p>Товары не найдены</p>
              )
            ) : (
              recentViewed.map((product) => (
                <div
                  key={product.id}
                  className="product-item"
                  onClick={() => handleProductClick(product)}
                >
                  <img src={product.images[0]} alt={product.name} />
                  <p>{product.name}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
