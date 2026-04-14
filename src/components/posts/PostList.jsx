import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function PostList() {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL;

  const fetchPosts = async (page) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/posts?page=${page}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "게시글을 불러오는데 실패했습니다.");
      }
      setPosts(data.data.posts || []);
      setTotalPages(
        (data.data.pagination && data.data.pagination.totalPages) || 1
      );
      setError(null);
    } catch (err) {
      console.error("오류가 발생했습니다.", err);
      setError("게시글을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage, API_URL]);
  // eslint-disable-next-line

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  if (loading) return <div>로딩 중..</div>;
  if (error) return <div className="">{error}</div>;

  return (
    <div className="post-wrap">
      <div className="post-content">
        <h2 className="">List</h2>

        {posts.length === 0 ? (
          <div className="">게시글이 없습니다.</div>
        ) : (
          <div className="post-form">
            <table cellPadding="0" cellSpacing="0">
              <thead className="">
                <tr>
                  <th>No</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Date</th>
                  <th>Comment</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id}>
                    <td>{post.id}</td>
                    <td>
                      <Link to={`/posts/${post.id}`} className="">
                        {post.title}
                      </Link>
                    </td>
                    <td>{post.author?.name || "알 수 없음"}</td>
                    <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                    <td>{post.commentCount ?? 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="">
            <nav>
              <ul className="">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    Prev
                  </button>
                </li>
                {[...Array(totalPages)].map((_, i) => (
                  <li
                    key={i + 1}
                    className={`page-item ${
                      currentPage === i + 1 ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}
                <li
                  className={`page-item ${
                    currentPage === totalPages ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}

        <div className="post-btns">
          <Link to="/create" className="">
            Write
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PostList;
