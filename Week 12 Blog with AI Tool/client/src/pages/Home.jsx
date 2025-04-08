import React from "react";
import Browser from "../components/Browser";
import GenerateTable from "../components/GenerateTable";
import RecentAnalysis from "../components/RecentAnalysis";
import ListAll from "../components/ListAll";
// import EmptyTable from "../components/EmptyTable";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <h1>AMI'S VALORANT BLOG</h1>
      <div className="instructions">
        Instructions:
        <ul>
          <li>1) In the browser below, enter your player ID and #. Mine is Ilikebread#888</li>
          <li>
            2) Once loaded, select "Matches" in the header. Scroll down to view
            all matches.
          </li>
          <li>3) Select the match you'd like to analyze.</li>
          <li>
            4) Scroll down to the bottom of the table and copy all texts and paste inside the empty textbox.
          </li>
          <li>
            5) Select your agent and press Convert! This should render this data
            into the table on the right.
          </li>
          <li>
            6) Double check the information, if correct, select Analyze to
            save and process the game analysis.{" "}
          </li>
          <li>
            7) Hang tight while it runs! The analysis will always be
            rendered.
          </li>
          <li>
            At the very bottom, you will see a list of all previouslyanalyzed matches. 
          </li>
        </ul>
      </div>


      <Browser />

      <GenerateTable />

      <RecentAnalysis />

      <ListAll />
    </div>
  );
};

export default Home;
