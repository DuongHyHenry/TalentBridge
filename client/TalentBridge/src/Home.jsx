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
  const scrollRef = useRef(null); // Create a ref for the scrollable section arrows

  useEffect(() => {
    fetch("http://localhost:5000/companies")
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching company data:", error));
  }, []);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -800, behavior: "smooth" }); // Scroll left by the width of a card
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 800, behavior: "smooth" }); // Scroll right by the width of a card
    }
  };

  return (
    <>
      <Header />
      <div className="main-body">
        <div className="main-info">
          <h1>TalentBridge</h1>
          <h2>Prepare yourself and learn about the jobs you want.</h2>
          <p>TalentBridge lets you explore work simulations so you can get hands-on experience with the job and prepare yourself to get hired.</p>
        </div>
        <h1>Take a look at our job simulations</h1>

        <div className="scrollable-section" ref={scrollRef}> {/* Section that contains all the cards */}
          
          <div className="card-container"> {/* Cards that represent the different companies */}
            {data.map((item) => (
              <Link
                to={`/Company/${item.URL}`}
                key={item.URL}
                className="card-link"
              >
                <Card className="custom-card">
                    <div className="card-container"> {/* New container to hold both elements */}
                        <div className="card-imgtitle-container">
                            <div className="card-title">{item.name}</div>
                            <img
                                src={item.logo}
                                alt={item.name}
                                className="card-image"
                            />
                        </div>
                    </div>
                </Card>

              </Link>
            ))}
            <div className="scroll-button-left" onClick={scrollLeft}>
              <img src={LeftArrow} alt="Scroll Right" />
            </div>
            <div className="scroll-button-right" onClick={scrollRight}>
              <img src={RightArrow} alt="Scroll Right" />
            </div>
          </div>
          
        </div>
      
        
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
