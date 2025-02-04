import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./Slider.css";

const Slider = () => {
  return (
    <div className="slider">
      <button className="slider-button slider-button-left">
        <FaChevronLeft />
      </button>
      <div className="slider-content">
        <div className="slider-text">
          <h1>Умная колонка</h1>
          <p className="discount-text">СКИДКА 30%</p>
          <p>при покупке второго товара</p>
        </div>
        <div className="slider-image">
          <img src="https://via.placeholder.com/300x300" alt="Умная колонка" />
        </div>
      </div>
      <button className="slider-button slider-button-right">
        <FaChevronRight />
      </button>
    </div>
  );
};

export default Slider;
