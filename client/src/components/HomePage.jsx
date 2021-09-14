import React, { useState, useContext, useEffect, useRef } from "react";
import "../css/popupstyle.css";
import "../css/chatPage.css";
import "../css/loadingStyle.css";
import {
  List,
  Button,
  ListItem,
  ListItemAvatar,
  Avatar,
  Typography,
  ListItemText,
  TextField,
  makeStyles,
} from "@material-ui/core";
import { userContext } from "../App";
import SendIcon from "@material-ui/icons/Send";
import { useAlert } from "react-alert";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { useHistory } from "react-router-dom";
import MoreVertIcon from "@material-ui/icons/MoreVert";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "80%",
    margin: "auto",
    marginTop: "70px",
  },
  inline: {
    display: "inline",
    backgroundColor: "gray",
  },
  roomlist: {
    width: "100%",
    backgroundColor: "dodgerblue",
    marginBottom: "2px",
    borderRadius: "10px",
    border: "1px solid black",
  },
}));

const HomePage = () => {
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState(true);
  const [isOpen2, setIsOpen2] = useState(false);
  const { state, dispatch } = useContext(userContext);
  const [userrooms, setUserrooms] = useState([]);
  const [room, setRoom] = useState(null);
  const [message, setMessage] = useState("");
  const [allmessage, setAllmessage] = useState([]);
  const alert = useAlert();
  const bottomRef = useRef();
  const history = useHistory();

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const scrollToBottom = () => {
    bottomRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  useEffect(() => {
    console.log(allmessage.length);
    scrollToBottom();
  }, [allmessage.length]);

  useEffect(() => {
    if (state) {
      fetch(`/userrooms/${state._id}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setUserrooms(data);
        });
    }
  }, [state]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (room) {
        fetch(`/getmessages/${room._id}`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
        })
          .then((res) => res.json())
          .then((data) => {
            setAllmessage(data);
          });
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [room]);

  const EnterRoom = (roomid) => {
    fetch(`/room/${roomid}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setIsOpen(false);
        setRoom(data);
      });
  };

  const leaveroom = (room) => {
    if (window.confirm("Leave room?")) {
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
          history.push("/avroom");
          alert.show("You left the room !");
        })
        .catch((err) => console.log(err));
    }
  };

  const deleteroom = (room) => {
    if (window.confirm("Delete room?")) {
      fetch(`/deleteroom/${room._id}`, {
        method: "delete",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
        .then((res) => res.json())
        .then((data) => {
          alert.success("Room deleted !!");
        })
        .catch((err) => console.log(err));
    }
  };

  const clearchat = (room) => {
    if (window.confirm("Clear chat?")) {
      fetch("/clearchat", {
        method: "put",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          roomid: room._id,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          alert.success("All messages deleted !");
        });
    }
  };

  const sendMessage = (room) => {
    fetch("/sendmessage", {
      method: "post",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        roomid: room._id,
        message,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setMessage("a");
        scrollToBottom();
      });
  };

  return (
    <div>
      {isOpen && (
        <div className="popup-box">
          <div className="box">
            <span className="close-icon" onClick={() => togglePopup()}>
              x
            </span>
            <div style={{ margin: "auto" }}>
              <ol style={{ padding: "0px" }}>
                {userrooms.length !== 0 ? (
                  userrooms.map((room) => (
                    <ListItem
                      alignItems="flex-start"
                      className={classes.roomlist}
                      key={room._id}
                    >
                      <ListItemAvatar>
                        <Avatar
                          alt="Remy Sharp"
                          src="/static/images/avatar/1.jpg"
                        />
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
                              Creator:
                            </Typography>
                            {room.creator.name}
                          </React.Fragment>
                        }
                      />
                      <Button
                        style={{ backgroundColor: "green", color: "white" }}
                        onClick={() => EnterRoom(room._id)}
                      >
                        Chat
                      </Button>
                    </ListItem>
                  ))
                ) : (
                  <ListItem
                    alignItems="flex-start"
                    className={classes.roomlist}
                  >
                    <ListItemText primary="You have not joined any room." />
                    <Button
                      style={{ backgroundColor: "green", color: "white" }}
                      onClick={() => {
                        history.push("/avroom");
                      }}
                    >
                      Join a room ?
                    </Button>
                  </ListItem>
                )}
              </ol>
            </div>
          </div>
        </div>
      )}

      <div className="container">
        <div className="info">
          <h2>{room && room.name}</h2>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            {" "}
            {room && <MoreVertIcon onClick={() => setIsOpen2(!isOpen2)} />}
          </div>
        </div>

        {isOpen2 && (
          <div className="RoomDetails">
            <ul>
              <li>
                <a>Room Details</a>
              </li>
              <li>
                <a>Invite Friends</a>
              </li>
              {room.creator._id === state._id ? (
                <>
                  <li>
                    <a onClick={() => deleteroom(room)}>Delete Room</a>
                  </li>
                  <li>
                    <a onClick={() => clearchat(room)}>Clear Chat</a>
                  </li>
                </>
              ) : (
                <li>
                  <a onClick={() => leaveroom(room)}>Leave Room</a>
                </li>
              )}
            </ul>
          </div>
        )}

        <div className="main">
         
          <Button
            onClick={() => {
              setIsOpen(true);
            }}
          >
            Rooms
          </Button>

          {allmessage.length !== 0 ? (
            allmessage.map((msg) => {
              return msg.postedBy._id === state._id ? (
                <div className="msgbox my" key={msg._id}>
                  <h4>You</h4>
                  <h2>{msg.message}</h2>
                </div>
              ) : (
                <div className="msgbox ot" key={msg._id}>
                  <h4>{msg.postedBy.name}</h4>
                  <h2>{msg.message}</h2>
                </div>
              );
            })
          ) : (
            <div className="loader">Loading...</div>
          )}

          <div ref={bottomRef} className="list-bottom"></div>
        </div>
        <div className="input">
          <TextField
            id="outlined-password-input"
            placeholder="Type a message"
            variant="outlined"
            className="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          {room &&
            (message.trim().length !== 0 ? (
              <SendIcon
                style={{ fontSize: "39px", margin: "auto" }}
                onClick={() => {
                  sendMessage(room);
                  setMessage(" ");
                }}
              />
            ) : (
              <SendIcon
                style={{ fontSize: "39px", margin: "auto" }}
                onClick={() => alert.error("Type a message")}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
