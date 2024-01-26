import React, { useCallback, useEffect, useState } from "react";
import Layout from "../../component/Layout";
import axios from "axios";
import { Link } from "react-router-dom";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import CloseIcon from "@mui/icons-material/Close";
import "../Home/Home.css";

const Following = () => {
  const [post, setPost] = useState("");
  const [checkingLike, setCheckingLike] = useState("");
  const [postCommit, setPostCommit] = useState("");
  const [commitModal, setCommitModal] = useState(false);
  const [commentDetai, setCommitDetail] = useState("");
  var picLink = "https://cdn-icons-png.flaticon.com/128/3177/3177440.png";

  const LinkStyle = {
    mr: 2,
    display: { xs: "none", md: "flex" },
    fontFamily: "monospace",
    fontWeight: 700,
    letterSpacing: ".3rem",
    color: "inherit",
    textDecoration: "none",
  };
  const getFollowingData = async () => {
    try {
      const { data } = await axios.get(`api/v1/post/myfollowing`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setPost(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLike = useCallback(async (id) => {
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
      setCheckingLike(data);
    } catch (error) {
      console.log(error);
    }
  }, []);
  const handleunLike = useCallback(async (id) => {
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
      setCheckingLike(data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getFollowingData();
  }, [checkingLike]);

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
console.log(post);
  return (
    <Layout>
      {post &&
        post?.map((posts) => (
          <div className="card" key={posts._id}>
            {/* card header */}
            <Link style={LinkStyle} to={`/userprofile/${posts.postedBy._id}`}>
              <div className="card-header">
                <div className="card-pic">
                  <img
                    src={posts.postedBy.photo ? posts.postedBy.photo : picLink}
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
              <img src={posts.photo.image} alt="" />
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
              <span className="material-symbols-outlined">mood</span>
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
    </Layout>
  );
};

export default Following;
