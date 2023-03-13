import React from "react";

import { OTSession, OTStreams, preloadScript } from "opentok-react";
import ConnectionStatus from "./ConnectionStatus";
import Publisher from "./Publisher";
import Subscriber from "./Subscriber";
import config from '../config';




class CallSession extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      connected: false,
    };
    this.sessionEvents = {
      sessionConnected: () => {
        this.setState({ connected: true });
      },
      sessionDisconnected: () => {
        this.setState({ connected: false });
      },
    };
  }

  onError = (err) => {
    this.setState({ error: `Failed to connect: ${err.message}` });
  };


  render() {
    console.log("PROPS : ", this.props)
    const { sessionId= "", tokenId = "" } = this.props.match.params
    return (
      <OTSession
        apiKey={config.API_KEY}
        sessionId={sessionId}
        token={tokenId}
        eventHandlers={this.sessionEvents}
        onError={this.onError}
      >
        <Publisher /> 
      </OTSession>
    //   <Routes>
    //   <Route
    //   // this path will match URLs like
    //   // - /teams/hotspur
    //   // - /teams/real
    //   path="/calls/:isNumber"
      
    //   element={
    //          this.MyComponent
    //   }
    // />
    // </Routes>
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

export default preloadScript(CallSession);
