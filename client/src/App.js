import React, { useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import { useLocalStorage } from "react-use";

import Login from "./components/login/Login.jsx";
import Register from "./components/login/Register.jsx";
import TokenValidate from "./components/login/TokenValidate.jsx";
import Main from "./components/Main.jsx";
import Balance from "./components/Balance.jsx";
import Recharge from "./components/Recharge.jsx";
import Payments from "./components/Payments.jsx";
import Footer from "./components/Footer.jsx";

function App() {
  const [localUser, setLocalUser, removeLocalUser] = useLocalStorage(
    "user",
    undefined
  );

  useEffect(() => {
    if (localUser) {
      if (localUser.token) {
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${localUser.token}`;
      } else {
        axios.defaults.headers.common["Authorization"] = ``;
      }
    } else {
      axios.defaults.headers.common["Authorization"] = ``;
    }
  }, [localUser]);

  return (
    <Router>
      <h2>Web de prueba</h2>
      {!localUser ? (
        <Switch>
          <Route
            exact
            path="/"
            render={() => <Login setLocalUser={setLocalUser} />}
          />
          <Route path="/register" component={Register} />
          <Route path="/tokenvalidate" component={TokenValidate} />
        </Switch>
      ) : (
        <div>
          <Switch>
            <Route
              exact
              path="/main"
              component={Main}
              setLocalUser={setLocalUser}
              localUser={localUser}
            />
            <Route path="/main/balance" component={Balance} />
            <Route path="/main/recharge" component={Recharge} />
            <Route path="/main/payments" component={Payments} />

            <Route path="/main/tokenvalidate" component={TokenValidate} />
          </Switch>
          <Footer setLocalUser={setLocalUser} />
        </div>
      )}
    </Router>
  );
}
export default App;
