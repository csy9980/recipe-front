import React from "react";
import { Routes, Route, Link, Navigate, useLocation } from "react-router-dom";

import SearchByIngredients from "./components/SearchByIngredients";
import SearchByKeyword from "./components/SearchByKeyword";
import SearchByRandom from "./components/SearchByRandom";
import Header from "./common/Header";
import Home from "./components/Home";
import Footer from "./common/Footer";

import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import PostList from "./components/posts/PostList";
import PostDetail from "./components/posts/PostDetail";
import EditPost from "./components/posts/EditPost";
import PostForm from "./components/posts/PostForm";

function AppContent({ isAuthenticated, setIsAuthenticated, user, setUser }) {
  const location = useLocation();
  const isHome = location.pathname === "/" || location.pathname === "/*";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <>
      <Header isAuthenticated={isAuthenticated} user={user} />
      {!isHome && (
        <div className="nav-wrap">
          <div className="auth-links">
            {isAuthenticated ? (
              <button onClick={handleLogout}>Logout</button>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Sign Up</Link>
              </>
            )}
          </div>
          <nav>
            <div className="category">
              <Link to="/">Go to main</Link>
            </div>
            <div className="category">
              <Link to="/keyword">Search By Keyword</Link>
            </div>
            <div className="category">
              <Link to="/ingredients">Search By Ingredients</Link>
            </div>
            <div className="category">
              <Link to="/random">Random!</Link>
            </div>
            <div className="category">
              <Link to="/posts">Board</Link>
            </div>
          </nav>
        </div>
      )}
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/keyword" element={<SearchByKeyword />} />
          <Route path="/ingredients" element={<SearchByIngredients />} />
          <Route path="/random" element={<SearchByRandom />} />
          <Route
            path="/login"
            element={
              !isAuthenticated ? (
                <Login
                  setIsAuthenticated={setIsAuthenticated}
                  setUser={setUser}
                />
              ) : (
                <Navigate to="/posts" />
              )
            }
          />
          <Route
            path="/register"
            element={!isAuthenticated ? <Register /> : <Navigate to="/posts" />}
          />
          <Route
            path="/posts"
            element={isAuthenticated ? <PostList /> : <Navigate to="/login" />}
          />
          <Route
            path="/posts/:id"
            element={
              isAuthenticated ? (
                <PostDetail isAuthenticated={isAuthenticated} user={user} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/create"
            element={isAuthenticated ? <PostForm /> : <Navigate to="/login" />}
          />
          <Route
            path="/edit/:id"
            element={
              isAuthenticated ? (
                <EditPost user={user} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          {/* Optional catch-all route */}
          {/* <Route path="*" element={<Home />} /> */}
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default AppContent;
