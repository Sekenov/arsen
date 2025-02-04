import React from "react";
import { useNavigate } from "react-router-dom";
import "./ProfilePage.css";

const ProfilePage = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove user from local storage
    localStorage.removeItem("user");

    // Redirect to login page
    navigate("/login");
  };

  if (!user) {
    return (
      <p className="profile-page__message">
        Вы не вошли в систему. Пожалуйста, войдите или зарегистрируйтесь.
      </p>
    );
  }

  return (
    <div className="profile-page">
      <h2 className="profile-page__title">Профиль пользователя</h2>
      <div className="profile-page__info">
        <p><strong>Имя пользователя:</strong> {user.username}</p>
      </div>
      <button className="profile-page__logout-button" onClick={handleLogout}>
        Выйти из аккаунта
      </button>
    </div>
  );
};

export default ProfilePage;
