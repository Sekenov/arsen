import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthForm.css";

const LoginPage = ({ setUser }) => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("https://ittalker-online-store-8b609d501d03.herokuapp.com/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Ошибка входа. Проверьте имя пользователя и пароль.");
      }

      const data = await response.json();

      // Сохраняем только username и token
      const userData = { username: formData.username, token: data.token };
      localStorage.setItem("user", JSON.stringify(userData));
      
      setUser(userData);

      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <h2 className="auth-form__title">Вход</h2>
      <form onSubmit={handleSubmit}>
        <div className="auth-form__input-group">
          <label htmlFor="username">Имя пользователя</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="auth-form__input-group">
          <label htmlFor="password">Пароль</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        {error && <p className="auth-form__error">{error}</p>}
        <button type="submit" className="auth-form__button" disabled={loading}>
          {loading ? "Загрузка..." : "Войти"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
