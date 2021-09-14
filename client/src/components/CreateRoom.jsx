import React, { useState, useEffect, useContext } from "react";
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
    width: "85%",
    //backgroundColor:"gray",
    //color: "white",
    borderRadius: "40px",
    boxShadow: "0 15px 20px 5px black",
    margin: "auto",
    marginTop: "80px",
    maxWidth: "800px",
    "& > *": {
      margin: 20,
    },
  },
});

const CreateRoom = () => {
  const [name, setName] = useState("");
  const [roomkey, setRoomkey] = useState("");
  const [password, setPassword] = useState("");
  const { state, dispatch } = useContext(userContext);
  const history = useHistory();
  const classes = useStyle();
  const alert = useAlert();

  const createroom = () => {
    fetch("/createroom", {
      method: "post",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        name,
        roomkey,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if(data.error){
          alert.error(data.error)
        }
        else{
          dispatch({
            type: "UPDATE",
            payload: {
              rooms: data.user.rooms,
            },
          });
          localStorage.setItem("user", JSON.stringify(data.user));
          alert.success("Room created ")
          history.push("/");
        }
       
      });
  };

  return (
    <FormGroup className={classes.container}>
      <Typography variant="h4">Create Room</Typography>

      <FormControl>
        <InputLabel>Room Name</InputLabel>
        <Input
          onChange={(e) => setName(e.target.value)}
          name="name"
          value={name}
        />
      </FormControl>
      <FormControl>
        <InputLabel>Room Key</InputLabel>
        <Input
          onChange={(e) => setRoomkey(e.target.value)}
          name="roomkey"
          value={roomkey}
        />
      </FormControl>
      <FormControl>
        <InputLabel>Room Password (optional)</InputLabel>
        <Input
          onChange={(e) => setPassword(e.target.value)}
          name="password"
          value={password}
        />
      </FormControl>

      

      {name.trim().length !== 0 &&
      roomkey.trim().length !== 0 ?
      (
        <Button variant="contained" color="primary" onClick={() => createroom()}>
        Create Room
      </Button>
      ) : (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => alert.error("Please add all fields")}
        >
         Create Room
        </Button>
      )}
    </FormGroup>
  );
};

export default CreateRoom;
