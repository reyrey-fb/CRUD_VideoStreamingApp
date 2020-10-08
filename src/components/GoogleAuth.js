import React from 'react';
import { connect } from 'react-redux';
import { signIn, signOut } from '../actions';

class GoogleAuth extends React.Component {

  componentDidMount() {
    //load and initiate the Google OAuth library
    window.gapi.load("client:auth2", () => {
      window.gapi.client
        .init({
          clientId:
            "593773892680-evumsb22g15djm9i1i1ieqv4159om7fq.apps.googleusercontent.com",
          scope: "email",
        })
        .then(() => {
          //after the asynch function of load and init are complete, create an auth instance
          this.auth = window.gapi.auth2.getAuthInstance();
          //set initial state of whether user is signed in or out (at page load)
          this.onAuthChange(this.auth.isSignedIn.get());
          //.listen method is listening for a real-time authentication status change
          this.auth.isSignedIn.listen(this.onAuthChange);
        });
    });
  }

  //callback function tied to .listen on isSignedIn
  onAuthChange = (isSignedIn) => {
    if (isSignedIn) {
      //call signIn action creator
      this.props.signIn(this.auth.currentUser.get().getId());
    } else {
      //call signOut action creator
      this.props.signOut();
    }
  };

  //helper callback function
  onSignInClick = () => {
    this.auth.signIn();
  };

  //helper callback function
  onSignOutClick = () => {
    this.auth.signOut();
  };

  //helper render function
  renderAuthButton() {
    if (this.props.isSignedIn === null) {
      return null; //displays nothing
    } else if (this.props.isSignedIn) {
      return (
        <button onClick={this.onSignOutClick} className="ui red google button">
          <i className="google icon" />
          Sign Out
        </button>
      );
    } else {
      return (
        <button onClick={this.onSignInClick} className="ui red google button">
          <i className="google icon" />
          Sign In with Google
        </button>
      );
    }
  }

  render() {
    return <div>{this.renderAuthButton()}</div>;
  }
}

const mapStateToProps = state => {
  return { isSignedIn : state.auth.isSignedIn};
}

export default connect (mapStateToProps, {signIn, signOut}) (GoogleAuth);