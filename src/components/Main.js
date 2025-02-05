import React from "react";
import { OTSession, OTStreams, preloadScript } from "opentok-react";
import ConnectionStatus from "./ConnectionStatus";
import Publisher from "./Publisher";
import Subscriber from "./Subscriber";
import config from "../config";
import getEnvironment from "./apiConfig";
import axios from "axios";
import FloatingButtonMenu from "./FloatingButtonMenu";

class CallSession extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionId: "",
      token: "",
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

  // Fetch video call details when the component mounts
  componentDidMount() {
    const { appointmentId } = this.props.match.params;
    this.fetchVideoCallDetails(appointmentId);
  }

  // Fetch video call details from the API
  fetchVideoCallDetails = async (appointmentId) => {
    const baseURL = getEnvironment(); // Assuming you have baseURL set in your config

    try { // test stagging appointment id = 6798ff6bbf2f346416127d0a
      const response = await axios.get( 
        `${baseURL}/appointment/video-calls/details?appointmentId=${
          appointmentId
        }`
      );
      this.setState({
        sessionId: response.data.result.video_call.sessionId,
        token: response.data.result.video_call.token,
        result: response.data.result
      });
    } catch (error) {
      console.error("Error fetching video call details:", error);
      this.setState({ error: "Failed to fetch video call details" });
    }
  };

  onError = (err) => {
    this.setState({ error: `Failed to connect: ${err.message}` });
  };

  render() {
    const { sessionId, token, error } = this.state;
    const { userType } = this.props.match.params;
    if (error) {
      return <div id="error">{error}</div>;
    }

    if (!sessionId || !token) {
      return <div>Loading...</div>;
    }

    return (
      <>
        {userType === "clinicians" ? <FloatingButtonMenu {...this.state.result} />: null}
        <OTSession
          apiKey={config.API_KEY}
          sessionId={sessionId}
          token={token}
          eventHandlers={this.sessionEvents}
          onError={this.onError}
        >
          {error ? <div id="error">{error}</div> : null}
          <ConnectionStatus connected={this.state.connected} />
          <Publisher />
          <OTStreams>
            <Subscriber />
          </OTStreams>
        </OTSession>
      </>
    );
  }
}

export default preloadScript(CallSession);
