import React, { useEffect, useState } from "react";
import "./Home.css";
import { Link } from "react-router-dom";
import Layout from "../../component/Layout";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  CircularProgress,
  Modal,
  SpeedDial,
  SpeedDialIcon,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Createpost from "../CreatePost/CreatePost";

export default function Home() {
  const [post, setPost] = useState([]);
  const [commitModal, setCommitModal] = useState(false);
  const [postCommit, setPostCommit] = useState([]);
  const [commentDetai, setCommitDetail] = useState("");
  const [skip, setSkip] = useState(0);
  const [postLenght, setPostLenght] = useState("");
  const [disable, setDisable] = useState(true);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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

  const getPosts = async () => {
    try {
      const { data } = await axios.get(
        `api/v1/post/allposts?skip=${skip === 0 ? 0 : skip * 10}`,
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (data.allPost && data.allPost.length) {
        setPost((prev) => [...prev, ...data.allPost]);
        setPostLenght(data.count);
      }
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPosts();
  }, [skip]);

  useEffect(() => {
    if (post.length === postLenght) setDisable(false);
  }, [post]);

  const handleCommitSubmit = async (e, id) => {
    e.preventDefault();
    const postingCommit = postCommit;
    const value = postingCommit[id];

    if (value === "") {
      return alert("type comment");
    }

    try {
      const { data } = await axios.put(
        `api/v1/post/commit/${id}`,
        { value },
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setPostCommit((prev) => {
        return {
          ...prev,
          [id]: "",
        };
      });
      console.log(data);
      if (data) {
        setPostCommit("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const commentDetail = async (id) => {
    try {
      const { data } = await axios.get(`api/v1/post/commitdetail/${id}`, {
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

  const formateDate = (timeStamps) => {
    const newDate = new Date(timeStamps);

    const formate = newDate.toLocaleDateString("en-US").replace(/\//g, "-");

    return formate;
  };

  return (
    <Layout>
      <div className="home">
        {/* card */}
        <InfiniteScroll
          dataLength={post.length}
          next={() => setSkip(skip + 1)}
          hasMore={disable}
          loader={
            <CircularProgress
              color="primary"
              sx={{ width: "100%", ml: "40%" }}
            />
          }
          style={{ overflow: "hidden" }}
        >
          {post &&
            post?.map((posts) => (
              <div className="card" key={posts._id}>
                {/* card header */}
                <Link
                  to={`/userprofile/${posts.postedBy._id}`}
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <div className="card-header">
                    <div className="card-pic">
                      <img
                        src={
                          posts.postedBy.photo ? posts.postedBy.photo : picLink
                        }
                        alt=""
                      />
                    </div>
                    <div className="scard-header-detail">
                      <p>
                        {posts.postedBy.userName} <br />{" "}
                        {formateDate(posts.createdAt)}{" "}
                      </p>
                    </div>
                  </div>
                </Link>
                <hr />
                <div className="card-body">
                  <p>{posts.body}</p>
                </div>
                {/* card image */}
                <div className="card-image">
                  <img key={post._id} src={posts.photo.image} alt="" />
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
                      required
                      placeholder="Add a comment"
                      value={postCommit[posts._id] || ""}
                      onChange={(e) =>
                        setPostCommit((prev) => ({
                          ...prev,
                          [posts._id]: e.target.value,
                        }))
                      }
                    />
                    <button className="comment" type="submit">
                      Post
                    </button>
                  </form>
                </div>
              </div>
            ))}
        </InfiniteScroll>

        {/* show Comment */}
        <Modal open={commitModal}>
          <div className="container">
            <div className="header">
              <h4>{commentDetai && commentDetai.postedBy?.userName} Posts</h4>
              <p onClick={() => setCommitModal((prev) => !prev)}>
                <CloseIcon />
              </p>
            </div>
            <hr
              style={{
                width: "100%",
                opacity: "0.8",
                margin: "0px",
              }}
            />
            <div className="profile_header">
              <div style={{ display: "flex" }}>
                <div className="image">
                  <img
                    src={
                      commentDetai && commentDetai.postedBy.photo
                        ? commentDetai.postedBy.photo
                        : picLink
                    }
                    alt="other"
                  />
                </div>
                <div>
                  <p>{commentDetai && commentDetai.postedBy?.userName}</p>
                  <div>{formateDate(commentDetai.createdAt)}</div>
                </div>
              </div>
              <div>
                <MoreVertIcon />
              </div>
            </div>
            <div className="post_body">
              <p className="padding">{commentDetai.body}</p>
            </div>
            <div className="post_img">
              <img
                src={commentDetai.photo ? commentDetai.photo.image : picLink}
                alt="images"
              />
            </div>
            <hr
              style={{
                width: "100%",
                opacity: "0.8",
                margin: "5px 0px",
              }}
            />
            <div className="like_section">
              <p>Likes {commentDetai.likes?.length} </p>
              <p>commit {commentDetai?.comments?.length}</p>
            </div>
            <hr
              style={{
                width: "100%",
                opacity: "0.8",
                margin: "10px 0px",
              }}
            />

            <div className="commit_continer">
              {commentDetai &&
                commentDetai.comments?.map((comt) => (
                  <div className="single_commit" key={comt._id}>
                    <p>{comt.postedBy.userName}</p>
                    <p>{comt.comment}</p>
                  </div>
                ))}
            </div>
          </div>
        </Modal>

        <SpeedDial
          ariaLabel="SpeedDial basic example"
          sx={{ position: "fixed", bottom: 40, right: 16 }}
          icon={<SpeedDialIcon />}
          onClick={handleOpen}
        ></SpeedDial>
        <Createpost asOpen={open} closeHandle={handleClose} />
      </div>
    </Layout>
  );
}
