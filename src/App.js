import React, {useContext, useEffect, useState} from 'react';
import {AuthContext} from './context/AuthContext'
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import firebase from 'firebase'

import { Button, Grid } from '@material-ui/core';

import LoginPage from './components/LoginPage'
import SetUsername from './components/SetUsername'
import GamePage from './components/GamePage'

import {newGame} from './game/newGame'
import GamesList from './components/GamesList';


function App({database,auth}) {
  const { user } = useContext(AuthContext);
  const [newGameID, setNewGameID] = useState(null)

  if(!user){
    return <LoginPage database={database} auth={auth}/>
  }
  else if(!user.displayName){
    return <SetUsername database={database} auth={auth}/>
  }

  function createGame(){
    var gameListRef = database.ref('games');
    var newGameRef = gameListRef.push();
    const newGameObj = newGame(newGameRef.getKey(),user)
    newGameRef.set(newGameObj);

    var newPlayerRef = newGameRef.child("/players/"+user.uid)
    newPlayerRef.set({id:user.uid,name:user.displayName,walls:10,x_position:5,y_position:1,winning_row:9})
    setNewGameID(newGameRef.getKey())
  }

  return (
    <Router>
      {newGameID&&<Redirect to={"/game/"+newGameID}/>}
      <Switch>
        <Route exact path="/">
        <Grid
          container
          direction="row"
          justify="space-evenly"
          alignItems="center"
        >
          <Button variant="contained" onClick = {()=> createGame()}>Create a game</Button>
          <Button variant="contained" onClick = {()=> auth.signOut()}>SIGN OUT</Button>
        </Grid>
          <GamesList database={database}></GamesList>
        </Route>
        <Route exact path="/game/:id" children={<GamePage database={database}/>} />
      </Switch>
    </Router>
  );
}

export default App;
