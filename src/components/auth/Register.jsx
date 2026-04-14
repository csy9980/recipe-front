import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
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
        `${process.env.REACT_APP_API_URL}`, 
        {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "회원가입에 실패했습니다.");
      }
      alert("회원가입이 완료되었습니다. 로그인해주세요.");
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2 className="">Sign Up</h2>
        {error && (
          <div className="" role="alert">
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
            <label htmlFor="password" className="form-label">
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
          <div className="auth-input">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              className=""
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="" disabled={loading}>
            {loading ? "Now Submit..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
