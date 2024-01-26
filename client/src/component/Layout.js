import React from "react";
// import Navbar from "./Navbar/Navbar";
import ResponsiveAppBar from "./Navbar/Appbar";


const Layout = ({ children }) => {
  return (
    <>
      < ResponsiveAppBar/>
      {children}
    </>
  );
};

export default Layout;
