import { useState } from "react";
import { useNavigate } from "react-router-dom";

function PostForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [files, setFiles] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }
    if (!formData.content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    try {
      setLoading(true);
      const form = new FormData();
      form.append("title", formData.title);
      form.append("content", formData.content);
      files.forEach((file) => {
        form.append("files", file);
      });
      const response = await fetch(`${API_URL}/posts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: form,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "게시글 작성에 실패했습니다.");
      }
      navigate("/posts");
    } catch (err) {
      console.error("게시글 작성 중 오류가 발생했습니다. :", err);
      setError("게시글 작성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="board">
      <div className="post-wrap">
        <h2>New Post</h2>
        {error && <div className="">{error}</div>}

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mt-5">
            <label htmlFor="title" className="">
              Title
            </label>
            <input
              type="text"
              className=""
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mt-5">
            <label htmlFor="content" className="">
              Content
            </label>
            <textarea
              className=""
              id="content"
              name="content"
              rows="10"
              value={formData.content}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="add-attachment mt-5">
            <label htmlFor="files" className="">
              Attachments (Limit 5 Files)
            </label>
            <input
              type="file"
              className=""
              id="files"
              name="files"
              multiple
              onChange={handleFileChange}
            />
            {files.length > 0 && (
              <ul className="">
                {files.map((file, idx) => (
                  <li key={idx}>{file.name}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="post-btns">
            <button
              type="button"
              className=""
              onClick={() => navigate("/posts")}
            >
              Cancel
            </button>
            <button type="submit" className="" disabled={loading}>
              {loading ? "Now Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PostForm;
