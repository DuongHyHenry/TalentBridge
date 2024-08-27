import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "./Header";
import { Card } from "antd";
import { Link } from "react-router-dom";


import "./style.css";

function CompanyTemplate() {
  const { companyName } = useParams(); // Get the company ID from the URL
  const [data, setData] = useState({ descriptions: [] });

  useEffect(() => {
    fetch(`http://localhost:5000/companies/${companyName}`)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        console.log("Fetched Data:", data); // Log the entire data object
        console.log("Descriptions:", data.descriptions); // Log only the descriptions array
      })
      .catch((error) => console.error("Error fetching company data:", error));
  }, [companyName]);

  // Helper function to render descriptions
  const renderDescriptions = (section) => {
    return (
      <>
        {data.descriptions
          .filter((desc) => desc.section === section)
          .map((desc, index) => (
            <div key={index}>
              {desc.bulletPoint === 1 ? (
                <ul>
                  <li>{desc.content}</li>
                </ul>
              ) : (
                <p>{desc.content}</p>
              )}
            </div>
          ))}
      </>
    );
  };

  return (
    <>
      <Header />
      <div className="company-body">
        <h1>{data.name}</h1>
        <img src={data.logo} alt={data.name} />
        <h2>{data.title}</h2>
        <h2>{data.subtitle}</h2>

        <h3>Why Complete Our Simulation:</h3>
        {renderDescriptions(1)}

        <h3>What's in it for you?</h3>
        {renderDescriptions(2)}

        <h3>How it works:</h3>
        {renderDescriptions(3)}

        <div className="task-container">


          <h3>Tasks in this Program:</h3>
          {Array.isArray(data.tasks) ? (
            data.tasks.map((task, index) => (
              <Link
                to={`/Task/${task.name}`}
                key={task.name}
                className="task-link"
              >
                <Card className="task-card">
                  <div key={index}>
                    <h4>{task.title}</h4>
                    <p>{task.subtitle}</p>
                    <p>{task.length}</p>
                  </div>
                </Card>
              </Link>
            ))
          ) : (
            <p>No tasks available.</p>
          )}
        </div>
      </div>
      <footer>@2024 SmartLab. All Rights Reserved.</footer>
    </>
  );
}

export default CompanyTemplate;
