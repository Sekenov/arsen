import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/mainPage/MainPage";
import RegisterPage from "./pages/registerPage/RegisterPage";
import LoginPage from "./pages/loginPage/LoginPage";
import ProfilePage from "./pages/profilePage/ProfilePage";
import CatalogPage from "./pages/catalogPage/CatalogPage.jsx";
import Navbar from "./components/navbar/Navbar";
import CartPage from "./pages/cartPage/CartPage.jsx";
import ProductPage from "./pages/productPage/ProductPage.jsx";
import FavoritesPage from "./pages/favoritesPage/FavoritesPage.jsx";

function App() {
  const [user, setUser] = useState(null);
  const [allProducts, setAllProducts] = useState([]);  // Все товары для поиска

  // Загрузка товаров для поиска при запуске приложения
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "https://ittalker-online-store-8b609d501d03.herokuapp.com/api/v1/catalog/products/search",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ page: 1, page_size: 100 }),  // Загрузим товары
          }
        );

        if (!response.ok) {
          throw new Error("Ошибка при загрузке товаров");
        }

        const data = await response.json();
        setAllProducts(data.products);
      } catch (error) {
        console.error("Ошибка загрузки товаров:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={<><Navbar user={user} allProducts={allProducts} /><MainPage /></>}
          />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage setUser={setUser} />} />
          <Route
            path="/profile"
            element={<><Navbar user={user} allProducts={allProducts} /><ProfilePage user={user} /></>}
          />
          <Route
            path="/catalog/:id"
            element={<><Navbar user={user} allProducts={allProducts} /><CatalogPage /></>}
          />
          <Route
            path="/cart"
            element={<><Navbar user={user} allProducts={allProducts} /><CartPage /></>}
          />
          <Route
            path="/product/:productId"
            element={<><Navbar user={user} allProducts={allProducts} /><ProductPage /></>}
          />
          <Route
            path="/favorites"
            element={<><Navbar user={user} allProducts={allProducts} /><FavoritesPage /></>}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
