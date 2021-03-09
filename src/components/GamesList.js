import React, {useContext, useEffect, useState,Backdrop,CircularProgress} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Grid, Button, Paper, Typography,Avatar} from '@material-ui/core'
import {AuthContext} from '../context/AuthContext'
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    paper: {
      maxWidth: 800,
      minWidth: 600,
      margin: `${theme.spacing(1)}px auto`,
      padding: theme.spacing(2),
    },
  }));

export default function GamesList({database}) {
    const classes = useStyles();
    const { user } = useContext(AuthContext);
    let history = useHistory();
    const [games, setGames] = useState(null)



    useEffect(()=>{
        var starCountRef = database.ref('games/');
        starCountRef.on('value', (snapshot) => {
          const data = snapshot.val();
        
          var games = []

          for(let game in data){
            if(!(data[game].complete)){
                games.push(data[game])
            }
          }
          setGames(games)
        });                  
      },[])

    function joinGame(game){
        if(!game.players[user.uid]){
            var newPlayerRef = database.ref('games/'+game.game_id+"/players/"+user.uid);
            newPlayerRef.set({id:user.uid,name:user.displayName,walls:10,x_position:5,y_position:9,winning_row:1})
            database.ref('games/'+game.game_id+"/complete").set(true)
        }
        history.push('/game/'+game.game_id)
    }
    return (
        <>
        {games&&games.map(x=>(
            <Paper className={classes.paper}>
              
            <Grid container direction='row' spacing={5}>
            <Grid item xs={1}>
            <Avatar src={x.photo} />

              </Grid>

              <Grid item xs={6}>
                <Typography  variant='h4'>{x.cretor_name}</Typography>
              </Grid>
              <Grid item xs={5}>
                <Button size="small" color="primary" onClick={() =>joinGame(x)}>JOIN GAME</Button>
                <Button size="small" color="primary" onClick={() => database.ref('teamers/').remove()}>DELETE</Button>
              </Grid>              
            </Grid>
            </Paper>
        ))}
        </>
        
    )
}
