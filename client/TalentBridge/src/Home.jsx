import React, { useContext, useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Tooltip } from "antd";
import { Card } from "antd";
import Header from "./Header";
import LeftArrow from "./assets/LeftArrow.png";
import RightArrow from "./assets/RightArrow.png";
import "./style.css";

const Home = () => {
  const [data, setData] = useState([]);
  const scrollRef = useRef(null); // Create a ref for the scrollable section

  useEffect(() => {
    fetch("http://localhost:5000/companies")
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching company data:", error));
  }, []);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -220, behavior: "smooth" }); // Scroll left by the width of a card
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 220, behavior: "smooth" }); // Scroll right by the width of a card
    }
  };

  return (
    <>
      <Header />
      <div className="main-body">
        <div className="scrollable-section" ref={scrollRef}>
          <div className="card-container">
            {data.map((item) => (
              <Link
                to={`/company/${item.ID}`}
                key={item.ID}
                className="card-link"
              >
                <Card className="custom-card">
                  <div className="card-title">{item.companyName}</div>
                  <img
                    src={item.companyLogo}
                    alt={item.companyName}
                    className="card-image"
                  />
                </Card>
              </Link>
            ))}
          </div>
        </div>
        <div className="scroll-button-left" onClick={scrollLeft}>
            <img src={LeftArrow} alt="Scroll Right" />
        </div>
        <div className="scroll-button-right" onClick={scrollRight}>
          <img src={RightArrow} alt="Scroll Right" />
        </div>
        

        <Tooltip title="prompt text">
          <span>Tooltip will show on mouse enter.</span>
        </Tooltip>
        <br/>
        <br/>

        <br/>

        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>

      </div>
      <footer>@2024 SmartLab. All Rights Reserved.</footer>
    </>
  );
};

export default Home;
