import { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";

function PostDetail({ isAuthenticated, user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`/posts/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "게시글을 불러오는데 실패했습니다.");
      }
      setPost(data.data);
      setError(null);
    } catch (err) {
      console.error("게시글을 불러오는데 실패했습니다. :", err);
      setError("게시글을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(`/posts/${id}/comments`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "댓글을 불러오는데 실패했습니다.");
      }
      setComments(data.data || []);
    } catch (err) {
      console.error("댓글을 불러오는 중 오류가 발생했습니다. :", err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
      return;
    }
    try {
      const response = await fetch(`/posts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "게시글 삭제에 실패했습니다.");
      }

      navigate("/posts");
    } catch (err) {
      console.error("게시글 삭제 중 오류가 발생했습니다:", err);
      alert("게시글 삭제에 실패했습니다.");
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      const response = await fetch(`/posts/${id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ content: newComment }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "댓글 작성에 실패했습니다.");
      }
      setNewComment("");
      fetchComments();
    } catch (err) {
      console.err("댓글 작성 중 오류가 발생했습니다.:", err);
      alert("댓글 작성에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCommentDelete = async (commentId) => {
    if (!window.confirm("정말로 댓글을 삭제하시겠습니까?")) {
      return;
    }
    try {
      const response = await fetch(`/posts/${id}/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "댓글 삭제에 실패했습니다.");
      }
      fetchComments();
    } catch (err) {
      console.error("댓글 삭제 중 오류가 발생했습니다.:", err);
      alert("댓글 삭제에 실패했습니다.");
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;
  if (!post) return <div>게시글을 찾을 수 없습니다.</div>;

  return (
    <div className="board">
      <div className="post-wrap">
        <div className="post-info">
          <h2>{post.title}</h2>
          <div className="">
            <small>
              <span>Author</span> {post.author?.name || "알 수 없음"}
            </small>
            <small>
              <span>Date</span> {new Date(post.createdAt).toLocaleString()}
            </small>
          </div>
        </div>
        <div className="post-detail">
          <div className="post-txt">
            {post.content.split("\n").map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
          {Array.isArray(post.attachments) && post.attachments.length > 0 && (
            <div className="detail-attached">
              <strong>Attached Files</strong>
              <ul>
                {post.attachments.map((file, idx) => (
                  <li key={idx}>
                    <a
                      href={
                        file.path
                          ? `http://localhost:3000/downloads/${encodeURIComponent(
                              file.filename
                            )}`
                          : "#"
                      }
                      className="attached-files"
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                    >
                      {file.originalname || file.filename}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="post-btns post-detail">
          <div>
            <Link to="/posts" className="">
              Go To List
            </Link>
          </div>
          {isAuthenticated && user && post.authorId === user.id && (
            <div className="d-flex">
              <Link to={`/edit/${post.id}`} className="ml-5">
                Edit
              </Link>
              <button onClick={handleDelete} className="ml-5">
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="comment-wrap">
        <div className="">
          <h3>Comments</h3>
        </div>
        <div className="">
          {isAuthenticated ? (
            <form onSubmit={handleCommentSubmit} className="">
              <div className="">
                <textarea
                  className=""
                  rows="3"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="댓글을 입력하세요"
                  required
                ></textarea>
              </div>
              <div className="d-flex justify-content-end">
                <button
                  type="submit"
                  className="comment-btn"
                  disabled={submitting}
                >
                  {submitting ? "Now Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          ) : (
            <div className="">
              댓글을 작성하려면 <Link to="/login">로그인</Link>이 필요합니다.
            </div>
          )}

          {comments.length === 0 ? (
            <p className="no-comments">No comments have been posted</p>
          ) : (
            <div className="has-comments">
              {comments.map((comment) => (
                <div key={comment.id} className="">
                  <div className="comment-info">
                    <div className="info-items">
                      <strong className="info-name">
                        {comment.author?.name || "알 수 없음"}
                      </strong>
                      <small className="info-date ml-5">
                        {new Date(comment.createdAt).toLocaleString()}
                      </small>
                    </div>
                    {isAuthenticated &&
                      user &&
                      comment.author?.id === user.id && (
                        <button
                          onClick={() => handleCommentDelete(comment.id)}
                          className="comment-btn"
                        >
                          Delete
                        </button>
                      )}
                  </div>
                  <p className="comment-txt">{comment.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PostDetail;
