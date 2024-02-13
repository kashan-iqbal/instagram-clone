import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import SearchIcon from "@mui/icons-material/Search";
import { TextField } from "@mui/material";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import axios from "axios";
import { Link } from "react-router-dom";
import "../Home/Home.css";
import linkStyle from './../../utils';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Search() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [post, setPost] = useState([]);
  const [postCommit, setPostCommit] = useState([]);
  const [commentDetai, setCommitDetail] = useState("");
  const [commitModal, setCommitModal] = useState(false);

  var picLink = "https://cdn-icons-png.flaticon.com/128/3177/3177440.png";

  const handleSearch = async () => {
    try {
      const { data } = await axios.get(`api/v1/post/searching?q=${input}`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setPost(data.result);
      setInput("")
    } catch (error) {
      console.log(error, `some thing wnet wrong`);
      setInput("")

    }
  };


const handleCommitSubmit = async (e, id) => {
  e.preventDefault();
  const postingCommit = postCommit;
  const value = postingCommit[id];

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
  return (
    <React.Fragment>
      <Button variant="outlined" onClick={() => setOpen((prev) => !prev)}>
        <SearchIcon color="warning" />
      </Button>
      <Dialog fullScreen open={open} TransitionComponent={Transition}>
        <>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() =>( setOpen((prev) => !prev) ,setPost("")) }
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography
              sx={{ m: 1, flex: 1, backgroundColor: "none" }}
              variant="h6"
              component="div"
            >
              <TextField fullWidth onChange={(e) => setInput(e.target.value)} />
            </Typography>
            <Button
              autoFocus
              color="success"
              variant="contained"
              onClick={handleSearch}
            >
              search
            </Button>
          </Toolbar>
        </>
        {
          post&&post.map((posts)=>(
            <div className="card" key={posts._id}>
            {/* card header */}
            <Link to={`/userprofile/${posts.postedBy._id}`}style={linkStyle} >
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
          ))
        }
             {commitModal && (
          <div className="showComment">
            <div className="container">
              <div className="postPic">
                <img
                  src={commentDetai.photo ? commentDetai.photo.image : picLink}
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
                  <h5>{commentDetai && commentDetai.postedBy?.userName}</h5>
                </div>

                {/* commentSection */}
                <div
                  className="comment-section"
                  style={{ borderBottom: "1px solid #00000029" }}
                >
                  {/* Dummy comments */}
                  {commentDetai &&
                    commentDetai.comments?.map((comt) => (
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
      </Dialog>
    </React.Fragment>
  );
}
