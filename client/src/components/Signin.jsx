import React, { useState, useContext } from "react";
import {
  Button,
  FormControl,
  FormGroup,
  Input,
  InputLabel,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { useAlert } from "react-alert";
import { userContext } from "../App";

const useStyle = makeStyles({
  container: {
    width: "80%",
    //backgroundColor:"gray",
    //color:"white",
    borderRadius: "40px",
    boxShadow: "0 15px 20px 5px black",
    margin: "auto",
    marginTop: "80px",
    "& > *": {
      margin: 20,
    },
  },
});

const Signin = () => {
  const classes = useStyle();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();
  const { state, dispatch } = useContext(userContext);
  const alert = useAlert();

  const loginUser = () => {
    fetch("/signin", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          alert.error(data.error);
        } else {
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          dispatch({ type: "USER", payload: data.user });

          alert.success("Login Successful");
          history.push("/");
        }
      });
  };

  return (
    <FormGroup className={classes.container}>
      <Typography variant="h4">Login</Typography>

      <FormControl>
        <InputLabel>Email</InputLabel>
        <Input
          required
          onChange={(e) => setEmail(e.target.value)}
          name="email"
          value={email}
        />
      </FormControl>
      <FormControl>
        <InputLabel>Password</InputLabel>
        <Input
          required
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          name="password"
          value={password}
        />
      </FormControl>

      {email.trim().length !== 0 && password.trim().length !== 0 ? (
        <Button variant="contained" color="primary" onClick={() => loginUser()}>
          Login
        </Button>
      ) : (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => alert.error("Please add all fields")}
        >
          Login
        </Button>
      )}
    </FormGroup>
  );
};

export default Signin;
