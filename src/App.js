import React from "react";
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";
import "./App.css";
import { OTSession, OTStreams, preloadScript } from "opentok-react";
import ConnectionStatus from "./components/ConnectionStatus";
import Publisher from "./components/Publisher";
import Subscriber from "./components/Subscriber";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";

import CallSession from "./components/Main";


function Home() {
  return <h2>Home</h2>;
}

function About() {
  return <h2>About</h2>;
}

function Contact() {
  return <h2>Contact</h2>;
}

function UserProfile(props) {
  const { username } = props.match.params;
  return <h2>User Profile: {username}</h2>;
}
class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (

      <Router>
      <div>
       

        <Route path="/" exact component={Home} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route path="/calls/:userType/:appointmentId" component={CallSession} />
        {/* <Route path="/calls/:userType/:appointmentId" component={CallSession} /> */}
      </div>
    </Router>
    );
  }
}


export default preloadScript(App);
