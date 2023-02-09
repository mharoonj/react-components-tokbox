import React from 'react';
import { CameraVideo, CameraVideoOff, Mic, MicMute, Tv, TvFill  } from 'react-bootstrap-icons';
import { OTPublisher, OTStreams } from 'opentok-react';
import CheckBox from './CheckBox';
import { Col, Container, Row } from 'react-bootstrap';
import Subscriber from './Subscriber';

class Publisher extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      audio: true,
      video: true,
      videoSource: 'camera'
    };
  }

  setAudio = () => {
    this.setState({ audio: !this.state.audio });
  }

  setVideo = () => {
    // console.log("video : ", video);
    console.log("video: ", this.state.video)
    this.setState({ video: !this.state.video });

  }

  changeVideoSource = (videoSource) => {
    (this.state.videoSource !== 'camera') ? this.setState({videoSource: 'camera'}) : this.setState({ videoSource: 'screen' })
  }

  onError = (err) => {
    console.log(`Failed to publish: ${err.message}`);
    this.setState({ videoSource: 'camera' });
  }

  render() {
    console.log("state: ", this.state)
    return (
      <div className="video-container">

        <div className='caller-container'>
          <OTPublisher
            properties={{
              publishAudio: this.state.audio,
              publishVideo: this.state.video,
              videoSource: this.state.videoSource === 'screen' ? 'screen' : undefined
            }}
            onError={this.onError}
          />
        </div>


        <div className="receiver-container">
          <Container>
          <OTStreams>
            <Subscriber />
          </OTStreams>
          </Container>
          
        </div>

        {this.state.error ? <div id="error">{this.state.error}</div> : null}

        <Container>
          <Row>
            <Col md={{offset: 4, span:1 }} xs={{offset: 3, span:2 }}>
              <div className='rounded-border' onClick={this.setVideo}>
                {this.state.video ? <CameraVideo color="royalblue" size={30}/> : <CameraVideoOff color="royalblue" size={30}/>}
              </div>
            </Col>
            <Col md={1} xs={{ span:2 }}>
              <div className='rounded-border' onClick={this.setAudio}>
                {this.state.audio ? <Mic color="royalblue" size={30} /> : <MicMute color="royalblue" size={30}/>}
              </div>
            </Col>
            <Col md={1} xs={{ span:2 }}>
              <div className='rounded-border' onClick={this.changeVideoSource}>
                {this.state.videoSource === "screen" ? <TvFill color="royalblue" size={30} /> : <Tv color="royalblue" size={30}/>}
              </div>
            </Col>
          </Row>
        </Container>

        {/* 

        <CheckBox
          label="Share Screen"
          onChange={this.changeVideoSource}
        />

        <CheckBox
          label="Publish Audio"
          initialChecked={this.state.audio}
          onChange={this.setAudio}
        />

        <CheckBox
          label="Publish Video"
          initialChecked={this.state.video}
          onChange={this.setVideo}
        /> */}

      </div>
    );
  }
}
export default Publisher;
