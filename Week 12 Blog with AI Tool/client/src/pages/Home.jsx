import React, { useState } from "react";
import Browser from "../components/Browser";
import GenerateTable from "../components/GenerateTable";
import RecentAnalysis from "../components/RecentAnalysis";
import ListAll from "../components/ListAll";
import "./Home.css";
import EmptyTable from "../components/EmptyTable";

const Home = () => {
  const [recentAnalysis, setRecentAnalysis] = useState(null);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState(null);

  return (
    <div className="home-container">
      <h1>WELCOME TO<br /> AMI'S VALORANT BLOG</h1>
      <div className="instructions">
        Instructions:
        <ul>
          <li>1) In the browser below, enter your player ID with #. Mine is Ilikebread#888</li>
          <li>
            2) Once loaded, select "Matches" in the header. Scroll down to view
            all matches.
          </li>
          <li>3) Select the match you'd like to analyze.</li>
          <li>
            4) Scroll down to the bottom of the table and copy all texts and enter in the "Paste Your information" textbox.
          </li>
          <li>
            5) Select your agent and press Convert! This should render this data
            into the table on the right.
          </li>
          <li>
            6) Double check the information, then select Analyze to
            save and process the game analysis.
          </li>
          <li>
            7) Hang tight while it runs! The analysis will render in a moment. 
          </li>
          <li>
            8) Refresh the page to see the expandable list of all previously analyzed matches. 
          </li>
        </ul>
      </div>

      <Browser />

      <GenerateTable onAnalysisComplete={(analysis) => {
        console.log("Home component received analysis data:", analysis);
        setRecentAnalysis(analysis);
      }} />

      <RecentAnalysis recentAnalysis={recentAnalysis} />

      <ListAll />


    </div>
  );
};

export default Home;
