import React, { useEffect, useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  List,
  Button,
  ListItem,
  ListItemAvatar,
  Avatar,
  Typography,
  ListItemText,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { userContext } from "../App";
import "../css/popupstyle.css";
import { useAlert } from "react-alert";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "95%",
    maxWidth: "800px",
    margin: "auto",
    marginTop: "70px",
  },
  inline: {
    display: "inline",
    backgroundColor: "gray",
  },
  roomlist: {
    backgroundColor: "gray",
    marginBottom: "2px",
    borderRadius: "15px",
  },
}));

const AvailableRoom = () => {
  const classes = useStyles();
  const [rooms, setRooms] = useState([]);
  const history = useHistory();
  const { state, dispatch } = useContext(userContext);
  const alert = useAlert();

  useEffect(() => {
    fetch("/allrooms", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setRooms(data.rooms);
      });
  }, [rooms]);

  const joinroom = (room) => {
    if (room.password) {
      history.push("/joinroom");
    } else {
      fetch("/joinroom", {
        method: "post",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          roomkey: room.roomkey,
          password: room.password,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          dispatch({
            type: "UPDATE",
            payload: {
              rooms: data.user.rooms,
            },
          });
          localStorage.setItem("user", JSON.stringify(data.user));
        })
        .catch((err) => console.log(err));
    }
  };

  const leaveroom = (room) => {
    fetch("/leaveroom", {
      method: "post",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        roomkey: room.roomkey,
        password: room.password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({
          type: "UPDATE",
          payload: {
            rooms: data.user.rooms,
          },
        });
        localStorage.setItem("user", JSON.stringify(data.user));
      })
      .catch((err) => console.log(err));
  };

  const deleteroom = (room) => {
    fetch(`/deleteroom/${room._id}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        alert.success("Room deleted !!")
      })
      .catch((err) => console.log(err));
  };

  return (
    <List className={classes.root}>
      {rooms &&
        rooms.map((room) => {
          return (
            <ListItem
              alignItems="flex-start"
              className={classes.roomlist}
              key={room._id}
            >
              <ListItemAvatar>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
              </ListItemAvatar>
              <ListItemText
                primary={room.name}
                secondary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      className={classes.inline}
                      color="textPrimary"
                    >
                      Creator :
                    </Typography>
                    {room.creator.name}
                  </React.Fragment>
                }
              />
              <ListItemText
                primary="Room Type  :  "
                secondary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      className={classes.inline}
                      color="textPrimary"
                    >
                      {room.password ? "Close" : "Open"}
                    </Typography>
                  </React.Fragment>
                }
              />
              {room.creator._id === state._id ? (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => deleteroom(room)}
                >
                  Delete Room
                </Button>
              ) : room.members.includes(state._id) ? (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => leaveroom(room)}
                >
                  Left Room
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => joinroom(room)}
                >
                  Join Room
                </Button>
              )}
            </ListItem>
          );
        })}
    </List>
  );
};

export default AvailableRoom;
