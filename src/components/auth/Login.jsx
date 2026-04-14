import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Login({ setIsAuthenticated, setUser }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/auth/login`, 
        {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "로그인에 실패했습니다.");
      }
      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      setIsAuthenticated(true);
      setUser(data.user);
      navigate("/");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2 className="">Welcome Back! Log In</h2>
        {error && (
          <div className="alert" role="alert">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="auth-input">
            <label htmlFor="email" className="">
              Email
            </label>
            <input
              type="email"
              className=""
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="auth-input">
            <label htmlFor="password" className="">
              Password
            </label>
            <input
              type="password"
              className=""
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="" disabled={loading}>
            {loading ? "Now Login..." : "Login"}
          </button>
        </form>
        <div className="register-txt">
          <span>Need an account?</span>
          <Link to="/register">Sign up now!</Link>
          {/* <a href="/register">회원가입</a> */}
        </div>
      </div>
    </div>
  );
}

export default Login;
