import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./CreatePost.css";
import { CircularProgress, Dialog } from "@mui/material";
import usePositionedSnackbar from "../../hooks/useSnackBarHook";

export default function Createpost({ asOpen, closeHandle }) {
  const [body, setBody] = useState("");
  const [file, setFile] = useState("");
  const [loading, setLoading] = useState(false);
  const imageref = useRef(null);



  // snack bar notification
  const { PositionedSnackbar, showSnackbar } = usePositionedSnackbar();

  const submitHandler = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    console.log(body, file);
    if (!body && !file) {
      setLoading(false);
      showSnackbar(`all field are Required`);
      return;
    }
    if (!body) {
      setLoading(false);
      showSnackbar(`caption is required`);
      return;
    }
    if (!file) {
      setLoading(false);
      showSnackbar(`upload image`);
      return;
    }
    try {
      const result = await axios.post(
        "/api/v1/post/createPost",
        { body, file },
        {
          headers: {
            "Content-Type": "multipart/form-data",
            authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(result.data);
      setFile(null);
      imageref.current.src = null;
      setBody("");
      closeHandle();
      showSnackbar(result?.data?.message);
      setLoading(false);
      window.location.reload();
    } catch (error) {
      console.log(error);
      showSnackbar(`something went wrong`);
      setLoading(false);
    }
  };
  const handleChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (imageref.current) {
          imageref.current.src = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  };
  useEffect(() => {
    setBody("");
    setFile("");
  }, [closeHandle]);
  return (
    <>
      <PositionedSnackbar />
      <Dialog open={asOpen} onClose={closeHandle}sx={{height:"500px"}} >
        <div className="createPost">
          {/* header */}
          <div className="post-header">
            <h4 style={{ margin: "3px auto" }}>Create New Post</h4>
            {loading ? (
              <CircularProgress sx={{ height: "5px" }} />
            ) : (
              <button onClick={submitHandler} id="post-btn">
                Post
              </button>
            )}
          </div>
          {/* image preview */}
          <div className="main-div">
            <img ref={imageref} alt="" id="output" />
            {loading ? (
              ""
            ) : (
              <input
                type="file"
                onChange={(e) => handleChange(e)}
                id="post-btn"
              />
            )}
          </div>
          {/* details */}
          <div className="details">
            <div className="card-header">

            </div>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write a caption...."
            ></textarea>
          </div>
        </div>
      </Dialog>
    </>
  );
}
