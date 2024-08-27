import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "./Header";


import "./style.css";

function TaskTemplate() {
  const { taskName } = useParams(); // Get the company ID from the URL
  const [data, setData] = useState({ descriptions: [] });

  useEffect(() => {
    fetch(`http://localhost:5000/tasks/${taskName}`)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        console.log("Fetched Data:", data); // Log the entire data object
        console.log("Descriptions:", data.descriptions); // Log only the descriptions array
      })
      .catch((error) => console.error("Error fetching task data:", error));
  }, [taskName]);

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
        <h1>{data.title}</h1>
        <h2>{data.length}</h2>
        <h2>{data.subtitle}</h2>

        <h3>What you'll learn:</h3>
        {renderDescriptions(1)}

        <h3>What you'll do:</h3>
        {renderDescriptions(2)}

      </div>
      <footer>@2024 SmartLab. All Rights Reserved.</footer>
    </>
  );
}

export default TaskTemplate;
