import React from "react";
import flv from 'flv.js';
import { connect } from "react-redux";
import { fetchStream } from '../../actions';

class StreamShow extends React.Component {
  //creating a ref prop for the video element, so we can interact with it in the DOM
  constructor(props) {
    super(props);
    this.videoRef = React.createRef();
  }
  //rendered once to screen on initial load
  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.fetchStream(id);
    this.buildPlayer(); 
  }

  //rendered anytime there is an update to the page 
  //written in as a check in case the stream is not fetched on initial load, but is later and still needs a player
  componentDidUpdate() {
    this.buildPlayer();
  }
  //rendered anytime the page is navigated away from (unmounted)
  componentWillUnmount() {
    //tells player to stop existing/playing
    this.player.destroy();
  }

  //helper function to build video player
  buildPlayer() {
    //catching error of video player being created before there is a stream fetched
    if (this.player || !this.props.stream) {
      //do nothing if there is a player and no stream inside it
      return;
    }
    //hook up the flv video player library (code from flv library)
    const { id } = this.props.match.params;
    this.player = flv.createPlayer({
      type: "flv",
      url: `http://127.0.0.1:8000/live/${id}.flv`,
    });
    this.player.attachMediaElement(this.videoRef.current);
    this.player.load();
  }

  render() {
    if (!this.props.stream) {
      return <div>Loading...</div>;
    }

    const {title , description} = this.props.stream;

    return (
      <div>
        <video ref={this.videoRef} style={{width : '100%'}} controls />
        <h1>{title}</h1>
        <h5>{description}</h5>
      </div>
      )
  }
}

const mapStateToProps = (state, ownProps) => {
  return { stream : state.streams[ownProps.match.params.id]}
}

export default connect(mapStateToProps, {fetchStream})(StreamShow);
