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
          <li>1) In the browser below, enter your player ID and #.</li>
          <li>
            2) Once loaded, select "Matches" in the header. Scroll down to view
            all matches.
          </li>
          <li>3) Select the match you'd like to analyze.</li>
          <li>
            4) Copy the entire table onto clipboard and paste under in the empty
            textbox.
          </li>
          <li>
            5) Enter your agent and press Convert! This should render this data
            into the table on the right.
          </li>
          <li>
            6) Double check the information, if correct, select Analyze to
            process a game analysis.{" "}
          </li>
          <li>
            7) Hang tight while it runs! The most recent analysis will always be
            rendered underneath.
          </li>
          <li>
            Below our most recent analysis will be a list of all past matches!
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
