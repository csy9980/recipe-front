import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditPost({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const [attachments, setAttachments] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {

    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/posts/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "게시글을 불러오는데 실패했습니다.");
        }
        if (data.data.authorId !== user.id) {
          navigate("/");
          return;
        }

        setFormData({
          title: data.data.title,
          content: data.data.content,
        });
        setAttachments(data.data.attachments || []);
        setError(null);
      } catch (err) {
        console.error("게시글을 불러오는데 실패했습니다. :", err);
        setError("게시글을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, user?.id, navigate]);



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setNewFiles(Array.from(e.target.files));
  };
  const handleRemoveAttachment = (idx) => {
    setAttachments((prev) => prev.filter((_, i) => i !== idx));
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
      setSubmitting(true);
      const form = new FormData();
      form.append("title", formData.title);
      form.append("content", formData.content);
      form.append("attachments", JSON.stringify(attachments));
      newFiles.forEach((file) => {
        form.append("files", file);
      });
      const response = await fetch(`/posts/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: form,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "게시글 수정에 실패했습니다.");
      }
      navigate(`/posts/${id}`);
    } catch (err) {
      console.error("게시글 수정 중 오류가 발생했습니다. :", err);
      setError("게시글 수정에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };
  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="board">
      <div className="post-wrap">
        <h2>Edit Post</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="">
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
          <div className="">
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
          <div className="attached">
            <label className="">Attached Files</label>
            {attachments.length === 0 ? (
              <div className="">No Attachments</div>
            ) : (
              <ul>
                {attachments.map((file, idx) => (
                  <li key={idx}>
                    <a
                      href={file.path ? file.path.replace(/^\./, "") : "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {file.originalname || file.filename}
                    </a>
                    <button
                      type="button"
                      className=""
                      onClick={() => handleRemoveAttachment(idx)}
                    >
                      X
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="add-attachment">
            <label htmlFor="files" className="">
              Add Attachments
            </label>
            <input
              type="file"
              className=""
              id="files"
              name="files"
              multiple
              onChange={handleFileChange}
            />
            {newFiles.length > 0 && (
              <ul className="">
                {newFiles.map((file, idx) => (
                  <li key={idx}>{file.name}</li>
                ))}
              </ul>
            )}
          </div>
          <div className="post-btns">
            <button
              type="button"
              className=""
              onClick={() => navigate(`/posts/${id}`)}
            >
              Cancel
            </button>
            <button type="submit" className="" disabled={submitting}>
              {submitting ? "Now Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPost;
