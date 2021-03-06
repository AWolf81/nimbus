const AUTHENTICATING = 'AUTHENTICATING';
const NOT_AUTHED = 'NOT_AUTHED';
const IS_AUTHED = 'IS_AUTHED';

import { fbAuth, db } from '~/config/firebase';
import { Actions } from 'react-native-router-flux';

export function authenticating () {
  return {
    type: AUTHENTICATING
  }
}

export function notAuthed () {
  return {
    type: NOT_AUTHED
  }
}

export function isAuthed (uid) {
  return {
    type: IS_AUTHED,
    uid
  }
}

export function loginUser (credentials) {
  return function (dispatch, getState) {
    dispatch(authenticating());

    const email = credentials.email;
    const password = credentials.password;

    fbAuth.signInWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
    }).then(() => {
      const user = fbAuth.currentUser;
      dispatch(isAuthed(user.uid));
      Actions.home();
    }).catch((error) => {
      console.warn('Error in createUser callback', error)
    });
  }
}

export function createUser (userData) {
  return function (dispatch, getState) {
    dispatch(authenticating());

    const email = userData.email;
    const password = userData.password;

    fbAuth.createUserWithEmailAndPassword(email, password).catch((error) => {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
    }).then(() => {
      const user = fbAuth.currentUser;

      db.ref('/users/' + user.uid).set({
        username: userData.username,
        displayName: userData.displayName,
        uid: user.uid
      })

      dispatch(isAuthed(user.uid));
      Actions.home()
    }).catch((error) => {
      console.warn('Error in createUser callback', error)
    });
  }
}

const initialState = {
  isAuthed: false,
  isAuthenticating: false
};

export default function authentication (state = initialState, action) {
  switch (action.type) {
    case AUTHENTICATING :
      return {
        ...state,
        isAuthenticating: true
      }
    case NOT_AUTHED :
      return {
        isAuthenticating: false,
        isAuthed: false
      }
      case IS_AUTHED :
        return {
          isAuthenticating: false,
          isAuthed: true,
          uid: action.uid
        }
    default :
      return state
  }
};
