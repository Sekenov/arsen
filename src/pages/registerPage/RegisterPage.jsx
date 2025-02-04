import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthForm.css";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    fullName: "",
  });
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
      const response = await fetch("https://ittalker-online-store-8b609d501d03.herokuapp.com/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Ошибка регистрации. Проверьте введенные данные.");
      }

      alert("Регистрация успешна! Теперь войдите в систему.");
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <h2 className="auth-form__title">Регистрация</h2>
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
        <div className="auth-form__input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="auth-form__input-group">
          <label htmlFor="fullName">Полное имя (не обязательно)</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
          />
        </div>
        {error && <p className="auth-form__error">{error}</p>}
        <button type="submit" className="auth-form__button" disabled={loading}>
          {loading ? "Загрузка..." : "Зарегистрироваться"}
        </button>
      </form>
      <p className="auth-form__toggle">
        Уже есть аккаунт?{" "}
        <span onClick={() => navigate("/login")}>Войти</span>
      </p>
    </div>
  );
};

export default RegisterPage;
