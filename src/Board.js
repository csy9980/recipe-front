import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import Login from "./auth/Login";
import Register from "./auth/Register";
import PostList from "./posts/PostList";
import PostDetail from "./posts/PostDetail";
import PostForm from "./posts/PostForm";
import EditPost from "./posts/EditPost";

function Board() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      setUser(JSON.parse(localStorage.getItem("user")));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <div className="">
      <nav className="">
        <div className="">
          <Link className="" to="/">
            게시판
          </Link>
          <div className="">
            <ul className="">
              <li className="">
                <Link className="" to="/">
                  게시글 목록
                </Link>
              </li>
              {isAuthenticated ? (
                <>
                  <li className="">
                    <Link className="" to="/create">
                      새 게시글
                    </Link>
                  </li>
                  <li className="">
                    <button className="" onClick={handleLogout}>
                      로그아웃
                    </button>
                  </li>
                </>
              ) : null}
            </ul>
            {user && <span className="">{user.email}</span>}
          </div>
        </div>
      </nav>

      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <PostList /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <Login
                setIsAuthenticated={setIsAuthenticated}
                setUser={setUser}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/register"
          element={!isAuthenticated ? <Register /> : <Navigate to="/" />}
        />
        <Route
          path="/posts/:id"
          element={<PostDetail isAuthenticated={isAuthenticated} user={user} />}
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
      </Routes>
    </div>
  );
}

export default Board;
