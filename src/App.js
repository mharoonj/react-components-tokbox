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
    // return (
    //   <OTSession
    //     apiKey={this.props.apiKey}
    //     sessionId={this.props.sessionId}
    //     token={this.props.token}
    //     eventHandlers={this.sessionEvents}
    //     onError={this.onError}
    //   >
    //     <Publisher />
    //   </OTSession>

    // );
    // return <CallSession />
    return (
    //   <BrowserRouter>
    //     <Switch>
    //     <Route
    //   // this path will match URLs like
    //   // - /teams/hotspur
    //   // - /teams/real
    //   path="/calls/:number"
      
    //   component={
    //     <CallSession />
    //   }
    // />
    //     </Switch>
        
      // </BrowserRouter>
      <Router>
      <div>
        {/* <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
            <li>
              <Link to="/users/john">John's Profile</Link>
            </li>
            <li>
              <Link to="/users/jane">Jane's Profile</Link>
            </li>
          </ul>
        </nav> */}

        <Route path="/" exact component={Home} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route path="/calls/:sessionId/:tokenId" component={CallSession} />
      </div>
    </Router>
    );
  }
}

// <OTSession
// apiKey={this.props.apiKey}
// sessionId={this.props.sessionId}
// token={this.props.token}
// eventHandlers={this.sessionEvents}
// onError={this.onError}
// >

// {this.state.error ? <div id="error">{this.state.error}</div> : null}

// <ConnectionStatus connected={this.state.connected} />

// <Publisher />

// <OTStreams>
//   <Subscriber />
// </OTStreams>

// </OTSession>

export default preloadScript(App);
