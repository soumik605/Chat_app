import React, { useState } from "react";
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

const Signup = () => {
  const classes = useStyle();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
  const history = useHistory();
  const alert = useAlert();

  const addUserDetails = () => {
    fetch("/signup", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        cpassword,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.error) {
          alert.error(data.error);
        } else {
          alert.success("New account created");
          history.push("/signin");
        }
      });
  };

  return (
    <FormGroup className={classes.container}>
      <Typography variant="h4">Add User</Typography>
      <FormControl>
        <InputLabel>Name</InputLabel>
        <Input
          required
          onChange={(e) => setName(e.target.value)}
          name="name"
          value={name}
        />
      </FormControl>
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
      <FormControl>
        <InputLabel>Confirm Password</InputLabel>
        <Input
          required
          type="password"
          onChange={(e) => setCPassword(e.target.value)}
          name="cpassword"
          value={cpassword}
        />
      </FormControl>

      {email.trim().length !== 0 &&
      password.trim().length !== 0 &&
      cpassword.trim().length !== 0 &&
      name.trim().length !== 0 ? (
        <Button
          variant="contained"
          color="primary"
          onClick={() => addUserDetails()}
        >
          Add User
        </Button>
      ) : (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => alert.error("Please add all fields")}
        >
          Add User
        </Button>
      )}
    </FormGroup>
  );
};

export default Signup;
