import React, { useContext, useState } from "react";
import { AppBar, Toolbar, Button } from "@material-ui/core";
import { NavLink, useHistory } from "react-router-dom";
import { userContext } from "../App";
import WhatsAppIcon from "@material-ui/icons/WhatsApp";
import "../css/NavStyle.css";
import MenuIcon from '@material-ui/icons/Menu';

const Navbar = () => {
  const { state, dispatch } = useContext(userContext);
  const history = useHistory();
  const [showMediaIcons, setShowMediaIcons] = useState(false);

  const RenderList = () => {
    if (state) {
      return [
        <ul>
          <li>
            {" "}
            <NavLink
              onClick={() => setShowMediaIcons(!showMediaIcons)}
              key="createroom"
              to="/createroom"
              exact
            >
              Create Room
            </NavLink>
          </li>
          <li>
            <NavLink
              onClick={() => setShowMediaIcons(!showMediaIcons)}
              key="joinroom"
              to="/joinroom"
              exact
            >
              Join Room
            </NavLink>
          </li>
          <li>
            <NavLink
              onClick={() => setShowMediaIcons(!showMediaIcons)}
              key="avroom"
              to="/avroom"
              exact
            >
              Available Rooms
            </NavLink>
          </li>
          <li>
            <Button
              key="logout"
              variant="contained"
              color="secondary"
              onClick={() => {
                localStorage.clear();
                dispatch({ type: "CLEAR" });
                setShowMediaIcons(!showMediaIcons);
                history.push("/signin");
              }}
            >
              Logout
            </Button>
          </li>
        </ul>,
      ];
    } else {
      return [
        <ul>
          <li>
            <NavLink
              onClick={() => setShowMediaIcons(!showMediaIcons)}
              key="login"
              to="/signin"
              exact
            >
              Login
            </NavLink>
          </li>
          <li>
            <NavLink
              onClick={() => setShowMediaIcons(!showMediaIcons)}
              key="signup"
              to="/signup"
              exact
            >
              Signup
            </NavLink>
          </li>
        </ul>,
      ];
    }
  };

  return (
    <>
      <nav className="main-nav">
        <div className="logo">
          <NavLink to={state ? "/" : "/signin"} exact>
            <WhatsAppIcon style={{ fontSize: "2.5rem", color: "white" }} />
          </NavLink>
        </div>
        <div
          className={
            showMediaIcons ? "menu-link mobile-menu-link" : "menu-link"
          }
        >
          {RenderList()}
        </div>
         <div className="social-media">
          <div className="hamburger-menu">
            <a href="#" onClick={() => setShowMediaIcons(!showMediaIcons)}>
              <MenuIcon style={{paddingRight:"10px", fontSize: "4rem"}}/>
            </a>
          </div>
        </div> 
      </nav>
    </>
  );
};

export default Navbar;
