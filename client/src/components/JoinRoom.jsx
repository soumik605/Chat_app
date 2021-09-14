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
    borderRadius: "40px",
    boxShadow: "0 15px 20px 5px black",
    margin: "auto",
    marginTop: "80px",
    "& > *": {
      margin: 20,
    },
  },
});

const JoinRoom = () => {
  const classes = useStyle();
  const [roomkey, setRoomkey] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();
  const { state, dispatch } = useContext(userContext);
  const alert = useAlert();

  const JoinRoom = () => {
    fetch("/joinroom", {
      method: "post",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        roomkey,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          alert.error(data.error);
        } else {
          dispatch({
            type: "UPDATE",
            payload: {
              rooms: data.user.rooms,
            },
          });
          localStorage.setItem("user", JSON.stringify(data.user));
          history.push("/");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <FormGroup className={classes.container}>
      <Typography variant="h4">Join Room</Typography>

      <FormControl>
        <InputLabel>Room Key</InputLabel>
        <Input
          required
          onChange={(e) => setRoomkey(e.target.value)}
          name="roomkey"
          value={roomkey}
        />
      </FormControl>
      <FormControl>
        <InputLabel>Password (if any)</InputLabel>
        <Input
          onChange={(e) => setPassword(e.target.value)}
          name="password"
          value={password}
        />
      </FormControl>

      {roomkey.trim().length !== 0 ? (
        <Button variant="contained" color="primary" onClick={() => JoinRoom()}>
          Join
        </Button>
      ) : (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => alert.error("Enter a room key")}
        >
          Join
        </Button>
      )}
    </FormGroup>
  );
};

export default JoinRoom;
