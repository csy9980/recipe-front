import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  return (
    <div className="home-contents">
      <h2>Looking for a recipe? Click here!</h2>
      <ul>
        <li>
          <Link to="/keyword">
            <img src="/images/recipe.png" alt="" />
            <span>Search By Keyword</span>
            <p>
              Search for your favorite meals, weather-friendly recipes, or diet
              options!
            </p>
          </Link>
        </li>
        <li>
          <Link to="/ingredients">
            <img src="/images/ingredient.png" alt="" />
            <span>Search By Ingredients</span>
            <p>
              What ingredients do you have?
              <br />
              Find recipes based on what you have!
            </p>
          </Link>
        </li>
        <li>
          <Link to="/random">
            <img src="/images/random.png" alt="" />
            <span>Random!</span>
            <p>
              Not sure what to eat?
              <br />
              Use the random recommendation feature!
            </p>
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Home;
