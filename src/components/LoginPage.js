import React, {useContext} from 'react';
import {AuthContext} from '../context/AuthContext'
import firebase from 'firebase'

import {Grid, Button} from '@material-ui/core'
import GitHubIcon from '@material-ui/icons/GitHub';

function LoginPage({database,auth}) {

  function githubSignInPopup(provider) {
    // [START auth_github_signin_popup]
    auth.signInWithPopup(provider).then((result) => {
      var credential = result.credential;
      // This gives you a GitHub Access Token. You can use it to access the GitHub API.
      var token = credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      // ...
    }).catch((error) => {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
    // [END auth_github_signin_popup]
  }
  return (
    <>
        <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: '50vh' }}
        >

            <Grid item xs={3}>
                <Button
                    onClick = {()=> githubSignInPopup(new firebase.auth.GithubAuthProvider())}
                    variant="contained"
                    endIcon={<GitHubIcon />}
                >Sign in with GitHub</Button>
            </Grid>   

        </Grid> 
    </>
  );
}

export default LoginPage;
