import "./App.css";
import { Switch, Route, Redirect } from "react-router-dom";

import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from 'reselect';
import HomePage from "./pages/homepage/homepage.component";
import ShopPage from "./pages/shop/shop.component";
import Header from "./components/header/header.component";
import SignInAndSignUpPage from "./pages/sign-in-and-sign-up/sign-in-and-sign-up.component";
import CheckoutPage from "./pages/checkout/checkout.component";
import { auth, createUserProfileDocument } from "./firebase/firebase.utils";
import { setCurrentUser } from "./redux/user/user.actions";
import { selectCurrentUser } from "./redux/user/user.selector";

class App extends React.Component {
  /* constructor() {
    super();

    this.state = {
      currentUser: null,
    };
  } */

  unsubscribeFromAuth = null;

  componentDidMount() {

    const { setCurrentUser } = this.props;

    this.unsubscribeFromAuth = auth.onAuthStateChanged(async (userAuth) => {
      //createUserProfileDocument(user);
      console.log("in mount");

      if (userAuth) {
        const userRef = await createUserProfileDocument(userAuth);

        userRef.onSnapshot((snapShot) => {
          /* this.setState({
            currentUser: {
              id: snapShot.id,
              ...snapShot.data(),
            },
          }); */
          setCurrentUser({
              id: snapShot.id,
              ...snapShot.data(),
          });
        });
      }

      setCurrentUser( userAuth );
      //console.log(user);
    });
  }

  componentWillUnmount() {
    this.unsubscribeFromAuth();
  }

  render() {
    return (
      <div>
        {/* <Header currentUser={this.state.currentUser} /> */}
        <Header />
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/shop" component={ShopPage} />
          <Route exact path="/checkout" component={CheckoutPage} />
          <Route path="/signin"  render={() => this.props.currentUser ? (<Redirect to='/' />) : (<SignInAndSignUpPage/>)} /* component={SignInAndSignUpPage} */ />
        </Switch>
      </div>
    );
  }
}

/* const mapStateToProps = ({ user }) => ({
  currentUser: user.currentUser
}) */



const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser
})

const mapDispatchToProps = dispatch => ({
  setCurrentUser: user => dispatch(setCurrentUser(user))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
