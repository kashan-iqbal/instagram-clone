import React, { useEffect, useState } from "react";
import "./Home.css";
import { Link } from "react-router-dom";
import Layout from "../../component/Layout";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

export default function Home() {
  const [post, setPost] = useState([]);
  const [commitModal, setCommitModal] = useState(false);
  const [postCommit, setPostCommit] = useState("");
  const [commentDetai, setCommitDetail] = useState("");
  const [skip, setSkip] = useState(0);
  const [postLenght, setPostLenght] = useState("");
  var picLink = "https://cdn-icons-png.flaticon.com/128/3177/3177440.png";

  const handleLike = async (id) => {
    // console.log(`i am like button`);
    try {
      const { data } = await axios.put(
        "api/v1/post/likePost",
        { id },
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const newData = post.map((post) => {
        if (post._id === data._id) {
          return data;
        } else {
          return post;
        }
      });
      setPost(newData);
    } catch (error) {
      console.log(error);
    }
  };
  const handleunLike = async (id) => {
    try {
      const { data } = await axios.put(
        "api/v1/post/unlikePost",
        { id },
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const newData = post.map((post) => {
        if (post._id === data._id) {
          return data;
        } else {
          return post;
        }
      });
      setPost(newData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPosts();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [skip]);

  const getPosts = async () => {
    try {
      const { data } = await axios.get(`api/v1/post/allposts?skip=${skip}`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setPost((prev) => [...prev, ...data.allPost]);
      setPostLenght(data.count);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleScroll = () => {
    if (
      document.documentElement.clientHeight + window.pageYOffset >=
      document.documentElement.scrollHeight
    ) {
      if (postLenght >= skip) {
        setSkip((skip)=> skip + 10);
      }
    }
    return;
  };

  const handleCommitSubmit = async (e, id) => {
    e.preventDefault();
    console.log(id, postCommit);
    try {
      const { data } = await axios.put(
        `api/v1/post/commit/${id}`,
        { postCommit },
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const commentDetail = async (id) => {
    try {
      const { data } = await axios.get(`api/v1/post//commitdetail/${id}`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log(data);
      setCommitDetail(data);
      setCommitModal((prev) => !prev);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className="home">
        {/* card */}
        {post &&
          post?.map((posts) => (
            <div className="card" key={posts._id}>
              {/* card header */}
              <Link to={`/userprofile/${posts.postedBy._id}`}>
                <div className="card-header">
                  <div className="card-pic">
                    <img
                      src={
                        posts.postedBy.photo ? posts.postedBy.photo : picLink
                      }
                      alt=""
                    />
                  </div>
                  <h5>{posts.postedBy.userName}</h5>
                </div>
              </Link>
              <hr />
              <div className="card-body">
                <p>{posts.body}</p>
              </div>
              {/* card image */}
              <div className="card-image">
                <img key={post._id} src={posts.photo} alt="" />
              </div>

              {/* card content */}
              <div className="card-content">
                <div>
                  {posts.likes.includes(localStorage.getItem("id")) ? (
                    <button onClick={() => handleunLike(posts._id)}>
                      <ThumbUpOffAltIcon
                        color="primary"
                        sx={{ fontWeight: "bold", cursor: "pointer" }}
                      />
                    </button>
                  ) : (
                    <button onClick={() => handleLike(posts._id)}>
                      <ThumbUpOffAltIcon
                        sx={{ fontWeight: "bold", cursor: "pointer" }}
                      />
                    </button>
                  )}
                  <p>{posts.likes.length} Likes</p>
                </div>
                <p
                  onClick={() => commentDetail(posts._id)}
                  style={{ fontWeight: "bold", cursor: "pointer" }}
                >
                  View all comments
                </p>
              </div>

              {/* add Comment */}
              <div className="add-comment">
                {/* <span className="material-symbols-outlined">mood</span> */}
                <form onSubmit={(e) => handleCommitSubmit(e, posts._id)}>
                  <input
                    type="text"
                    placeholder="Add a comment"
                    onChange={(e) => setPostCommit(e.target.value)}
                  />
                  <button className="comment" type="submit">
                    Post
                  </button>
                </form>
              </div>
            </div>
          ))}

        {/* show Comment */}
        {commitModal && (
          <div className="showComment">
            <div className="container">
              <div className="postPic">
                <img
                  src={commentDetai.photo ? commentDetai.photo : picLink}
                  alt=""
                />
              </div>
              <div className="details">
                {/* card header */}
                <div
                  className="card-header"
                  style={{ borderBottom: "1px solid #00000029" }}
                >
                  <div className="card-pic">
                    <img src={picLink} alt="" />
                  </div>
                  <h5>{commentDetai && commentDetai.postedBy.userName}</h5>
                </div>

                {/* commentSection */}
                <div
                  className="comment-section"
                  style={{ borderBottom: "1px solid #00000029" }}
                >
                  {/* Dummy comments */}
                  {commentDetai &&
                    commentDetai.comments.map((comt) => (
                      <p className="comm">
                        <span
                          className="commenter"
                          style={{ fontWeight: "bolder", marginRight: "5px" }}
                        >
                          {comt.postedBy.userName}
                        </span>
                        <span className="commentText">{comt.comment}</span>
                      </p>
                    ))}
                </div>

                {/* card content */}
                <div className="card-content">
                  <p>{commentDetai.likes?.length} Likes</p>
                  <p>{commentDetai.body}</p>
                </div>
              </div>
            </div>
            <div className="close-comment">
              <span
                onClick={() => setCommitModal((prev) => !prev)}
                className="material-symbols-outlined material-symbols-outlined-comment"
              >
                <CloseIcon />
              </span>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
