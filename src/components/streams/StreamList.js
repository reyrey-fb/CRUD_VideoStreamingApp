import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { fetchStreams } from "../../actions";

class StreamList extends React.Component {
  componentDidMount() {
    this.props.fetchStreams();
  }

  //helper function that decides if Delete and Edit button are shown to user
  renderAdmin(stream) {
    if (stream.userId === this.props.currentUserId) {
      return (
        <div className="right floated content">
          <Link to={`/streams/edit/${stream.id}`} className="ui button primary">
            Edit
          </Link>
          <Link to={`/streams/delete/${stream.id}`} className="ui button negative">
            Delete
          </Link>
        </div>
      );
    }
  }

  //helper function to return a display JSX for each stream item
  renderList() {
    return this.props.streams.map((stream) => {
      return (
        <div className="item" key={stream.id}>
          {this.renderAdmin(stream)}
          <i className="large middle aligned icon camera" />
          <div className="content">
            <Link to={`/streams/${stream.id}`} className="header">{stream.title}</Link>
            <div className="description">{stream.description}</div>
          </div>
        </div>
      );
    });
  }

  //helper function to display create stream button if logged in
  renderCreate() {
    if (this.props.isSignedIn) {
      return (
        <div style={{textAlign:"right"}}>
          <Link to="/streams/new" className="button ui primary">Create Stream</Link>
        </div>
      )
    }
  }

  render() {
    return (
      <div>
        <h2>Streams</h2>
        <div className="ui celled list">{this.renderList()}</div>
        {this.renderCreate()}
      </div>
    );
  }
}

 const mapStateToProps = (state) => {
  return {
    //creates this.props.streams array
    streams: Object.values(state.streams),
    //pulls in the userId from redux store
    currentUserId: state.auth.userId,
    //pulls in isSignedIn from redux store
    isSignedIn: state.auth.isSignedIn
  }; 
  
 }

export default connect(mapStateToProps, {fetchStreams}) (StreamList);
