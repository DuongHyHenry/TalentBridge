import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "./Header";
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
  console.log("Company Name: ", companyName);
  console.log("Company Name: ", data.name);


  return (
    <>
      <Header />
      <div className="main-body">
        <h1>{data.name}</h1>
        <img src={data.logo} alt={data.name} />
        <h2>{data.title}</h2>
        <h2>{data.subtitle}</h2>
        
        <h3>Why Complete Our Simulation:</h3>
        {Array.isArray(data.descriptions) && data.descriptions.length > 0 ? (
          data.descriptions.map((desc, index) => (
            <div key={index}>
              <p>{desc.content}</p>
            </div>
          ))
        ) : (
          <p>No descriptions available.</p>
        )}
        <h3>What's in it for you?</h3>
        {Array.isArray(data.descriptions) && data.descriptions.section == 2 ? (
          data.descriptions.map((desc, index) => (
            <div key={index}>
              <p>{desc.content}</p>
            </div>
          ))
        ) : (
          <p>No descriptions available.</p>
        )}
        <h3>How it works:</h3>
        {Array.isArray(data.descriptions) && data.descriptions.section == 3 ? (
          data.descriptions.map((desc, index) => (
            <div key={index}>
              <p>{desc.content}</p>
            </div>
          ))
        ) : (
          <p>No descriptions available.</p>
        )}
        <h3>Tasks in this Program:</h3>
        {Array.isArray(data.tasks) ? (
          data.descriptions.map((desc, index) => (
            <div key={index}>
              <p>{desc.task}</p>
            </div>
          ))
        ) : (
          <p>No tasks available.</p>
        )}
      </div>
      <footer>@2024 SmartLab. All Rights Reserved.</footer>
    </>
  );
}

export default CompanyTemplate;
