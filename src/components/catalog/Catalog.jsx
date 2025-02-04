import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import Loader from "../loader/Loader";
import "./Catalog.css";

const Catalog = () => {
  const [catalogItems, setCatalogItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true); // Добавляем состояние загрузки
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const response = await fetch("https://ittalker-online-store-8b609d501d03.herokuapp.com/api/v1/catalog/catalogs");
        const data = await response.json();

        const formattedCatalog = data.catalog.map((item) => ({
          id: item.id,
          title: item.name,
          image: item.image_url || "https://via.placeholder.com/150",
        }));

        setCatalogItems(formattedCatalog);
      } catch (error) {
        console.error("Ошибка загрузки каталога:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, []);

  if (loading) {
    return <Loader />; // Централизованная загрузка
  }

  const nextSlide = () => {
    if (currentIndex < catalogItems.length - itemsPerPage) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  return (
    <div className="catalog">
      <h2 className="catalog__title">Каталог</h2>
      <div className="catalog__slider">
        <button
          className={`catalog__slider-button catalog__slider-button--left ${
            currentIndex === 0 ? "catalog__slider-button--disabled" : ""
          }`}
          onClick={prevSlide}
          disabled={currentIndex === 0}
        >
          <FaChevronLeft />
        </button>
        <div className="catalog__slider-window">
          <div
            className="catalog__slider-track"
            style={{ transform: `translateX(-${currentIndex * 20}%)` }}
          >
            {catalogItems.map((item) => (
              <Link to={`/catalog/${item.id}`} key={item.id} className="catalog__slider-item">
                <img
                  src={item.image}
                  alt={item.title}
                  className="catalog__slider-image"
                />
                <p className="catalog__slider-text">{item.title}</p>
              </Link>
            ))}
          </div>
        </div>
        <button
          className={`catalog__slider-button catalog__slider-button--right ${
            currentIndex >= catalogItems.length - itemsPerPage
              ? "catalog__slider-button--disabled"
              : ""
          }`}
          onClick={nextSlide}
          disabled={currentIndex >= catalogItems.length - itemsPerPage}
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Catalog;
