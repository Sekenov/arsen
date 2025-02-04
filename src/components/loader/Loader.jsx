import React from "react";
import "./Loader.css";

const Loader = () => {
  return (
    <div className="loader">
      <div className="loader__circle"></div>
      <p className="loader__text">Загрузка...</p>
    </div>
  );
};

export default Loader;
