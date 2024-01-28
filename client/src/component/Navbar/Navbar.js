import React from "react";
import logo from "../../assets/social-high-resolution-logo (1).png";
import { Link, useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import "./Navbar.css";
import Search from "../../pages/Search/Search";

export default function Navbar() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  
  
  const Navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    Navigate("/login");
    handleClose()
  };

  const uiChange = () => {
    const token = localStorage.getItem("token");
    if (token) {
      return [
        <>
          <Link to="/profile">
            <li key={3}>Profile</li>

          </Link>
          <Search/>
          <Link style={{ marginLeft: "20px" }} to="/myfollowing">
            My Following
          </Link>
          <Link to={""}>
            <button className="primaryBtn" onClick={handleOpen}>
              Log Out
            </button>
          </Link>
        </>,  
      ];
    } else {
      return [
        <>
          <Link to="/">
            <li key={1}>SignUp</li>
          </Link>
          <Link to="/login">
            <li key={2}>SignIn</li>
          </Link>
        </>,
      ];
    }
  };

  return (
    <div className="navbar">
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Warning"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          By accessing and using our platform, you agree to comply with our Terms of Service. Please review the terms carefully. If you do not agree, kindly refrain from using our services.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleLogout} autoFocus color="error">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
      <Link to="/home">
        <img src={logo} alt="" style={{ height: "70px", width: "110px",padding:"0" }} />
      </Link>
      <ul className="nav-menu">{uiChange()}</ul>
    </div>
  );
}
