import React, { useContext, createContext, useEffect, useReducer } from "react";
import "./App.css";
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
import HomePage from "./components/HomePage";
import Navbar from "./components/Navbar";
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import CreateRoom from "./components/CreateRoom";
import JoinRoom from "./components/JoinRoom";
import AvailableRoom from './components/AvailableRoom'
import {reducer, initialState} from './reducer/userReducer'

export const userContext = createContext();

const Routing = () => {
  const { dispatch } = useContext(userContext);
  const user = JSON.parse(localStorage.getItem("user"));
  const history = useHistory();

  useEffect(() => {
    if (user) {
      dispatch({ type: "USER", payload: user });
    } else {
      history.push("/signin");
    }
  }, []);

  return (
    <Switch>
      <Route exact path="/">
        <HomePage />
      </Route>
      <Route exact path="/signin">
        <Signin />
      </Route>
      <Route exact path="/signup">
        <Signup />
      </Route>
      <Route exact path="/createroom">
        <CreateRoom />
      </Route>
      <Route exact path="/joinroom">
        <JoinRoom />
      </Route>
      <Route exact path="/avroom">
        <AvailableRoom />
      </Route>
    </Switch>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div className="App">
      <userContext.Provider value={{ state, dispatch }}>
        <BrowserRouter>
          <Navbar />
          <Routing />
        </BrowserRouter>
      </userContext.Provider>
    </div>
  );
}

export default App;
