import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import SearchIcon from "@mui/icons-material/Search";
import { TextField } from "@mui/material";
import "../Home/Home.css";
import  axios  from 'axios';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Search() {
  const [open, setOpen] = React.useState(false);
  const [input, setInput] = React.useState("");

  var picLink = "https://cdn-icons-png.flaticon.com/128/3177/3177440.png";

  const handleSearch = async() => {
    try {
      const { data } = await axios.get(`api/v1/post/searching?q=${input}`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log(data);
    } catch (error) {
      console.log(error,`some thing wnet wrong`)
    }
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={() => setOpen((prev) => !prev)}>
        <SearchIcon />
      </Button>
      <Dialog fullScreen open={open} TransitionComponent={Transition}>
        <>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setOpen((prev) => !prev)}
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
        <div className="card">
          {/* <!-- card header --> */}
          <div className="card-header">
            <div className="card-pic">
              <img src={picLink} alt="" />
            </div>
            <h5>John Doe</h5>
          </div>
          <hr />
          <div className="card-body">
            <p>This is a post body.</p>
          </div>
          {/* <!-- card image --> */}
          <div className="card-image">
            <img src={picLink} alt="" />
          </div>

          {/* <!-- card content --> */}
          <div className="card-content">
            <div>
              <button>
                {/* <span style="font-weight: bold; cursor: pointer;">👍</span> */}
              </button>
              <p>42 Likes</p>
            </div>
            {/* <p style="font-weight: bold; cursor: pointer;">View all comments</p> */}
          </div>

          {/* <!-- add Comment --> */}
          <div className="add-comment">
            <form>
              {/* <input type="text" placeholder="Add a comment" value="" /> */}
              <button className="comment" type="submit">
                Post
              </button>
            </form>
          </div>
        </div>
      </Dialog>
    </React.Fragment>
  );
}
