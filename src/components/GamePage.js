import {   Button, Dialog,DialogActions,DialogContentText,DialogContent,DialogTitle
,    TextareaAutosize, Box, Paper, Grid, Typography,CircularProgress,Backdrop,TextField, useTheme} from '@material-ui/core';
import { keys } from '@material-ui/core/styles/createBreakpoints';
import React, { useState, useEffect,useContext} from 'react'
import {useParams} from "react-router-dom";
import {AuthContext} from '../context/AuthContext'
import { useHistory } from 'react-router-dom';


import {boardToStrings,validCommand} from "../game/boardHelp"

export default function GamePage({database}) {
    var { id } = useParams();
    const [game, setGame] = useState(null)
    const [command, setCommand] = useState("")
    const { user } = useContext(AuthContext);
    const [open, setOpen] = useState(false)
    const [error, setError] = useState(false)
    const [menssage, setMessage] = useState({title:"Victory!",text:"YOU WON THIS GAME, YAAYYYY",button:"Enjoy success"})
    let history = useHistory();

    function currentPlayer(){
        return game.players[user.uid]
    }
    function otherPlayer(){
        for(let key in game.players){
            if(key!=user.uid){
                return  game.players[key]
            }
        }
    }

    function addToConsole(cmd){
        if(typeof game.console==="undefined"){
            database.ref('games/'+id+"/console").set(user.displayName+"-"+cmd);
        }else{
            var temp = game.console + "\n" + user.displayName + "-" + cmd
            database.ref('games/'+id+"/console").set(temp)          
        }
    }

    function handleMove(x,y){
        database.ref('games/'+id+'/players/'+user.uid).update({
            x_position: x,
            y_position : y
          }, (error) => {
            if (error) {
              console.log(error)
            }
        })
    }
    function handleWall(wall1,wall2){
        if(typeof game.walls_placed==="undefined"){
            database.ref('games/'+id+"/walls_placed").set([wall1,wall2]);
        }else{
            var temp = game.walls_placed
            temp.push(wall1)
            temp.push(wall2)
            database.ref('games/'+id+"/walls_placed").set(temp);
        }
        database.ref('games/'+id+"/players/"+user.uid+"/walls").set(game.players[user.uid].walls-1)
    }
    function handleCommand(){
        var checkCommand = validCommand(command,currentPlayer(),otherPlayer(),game.walls_placed)
        if(checkCommand){
            if(Number.isInteger(checkCommand[0])){
                handleMove(checkCommand[0],checkCommand[1])
            }else{
                handleWall(checkCommand[0],checkCommand[1])
            }
            
            database.ref('games/'+id+"/turn").set(otherPlayer().id)
            addToConsole(command)
            setCommand("")
        }else{
            setError(true)
        }
    } 
    function checkIntro(e){
        if(e.keyCode === 13){
            handleCommand()
        }
    }
    function handleClose(){
        history.push('/')
        database.ref('games/'+id).remove()
    }


    useEffect(()=>{
        var starCountRef = database.ref('games/'+id);
        starCountRef.on('value', (snapshot) => {
          const data = snapshot.val();
          setGame(data)
        });
    },[])

    
    if(!game){
        return<Typography variant='h6'>This game no longer exists!</Typography>
    }
    else if(Object.keys(game.players).length<2){
        return <><Typography variant='h3'>Waiting for someone else to join</Typography><CircularProgress color="inherit" /></>
    }
    
    if(!open){
        if(currentPlayer().y_position===currentPlayer().winning_row){
            setMessage({title:"Victory!",text:"YOU WON THIS GAME, YAAYYYY",button:"Enjoy success"})
            setOpen(true)
       }else if(otherPlayer().y_position===otherPlayer().winning_row){
        setMessage({title:"Defeat",text:"You lost, try to learn something for next time",button:"Accept faliure"})
        setOpen(true)
        } 
    }


    return (
        <>
            <Dialog
            open={open}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{menssage.title}</DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
            {menssage.text}
            </DialogContentText>
            </DialogContent>
            <DialogActions>
          <Button onClick={()=>handleClose()} color="primary">
          {menssage.button}
          </Button>
        </DialogActions>
        </Dialog>
        <Grid container direction='row' justify="flex-end">
        <Button variant="contained" color="secondary" onClick={()=>handleClose()}> leave </Button>
        </Grid>
        <Box mt={5}>
            <Grid
            container
            spacing={2}
            direction="row"
            alignItems="center"
            justify="center"
            >

                <Grid item xs={5}>
                <Typography variant="h5">{currentPlayer().name} Vs {otherPlayer().name} </Typography>
                {(boardToStrings(game.walls_placed,game.players)).map((x,i)=><h3 key={i} style={{fontFamily:"monospace",margin:0}}>{x}</h3>)}
                {(game.turn===user.uid)?(
                <Typography variant='h6'>Make your move</Typography>
                ):(
                    <><Typography variant='h6'>Wait for your opponent to move</Typography><CircularProgress color="inherit" /></>
                ) }
                </Grid>
                
                
                <Grid item xs={3}>
                    <Typography variant='h4'>Terminal</Typography><TextareaAutosize
                    rowsMax={10}
                    rowsMin={6}
                    value={game.console}
                    disabled={true}
                />
                    <TextField disabled={game.turn!==user.uid} variant="standard" vaid="standard-basic" label={game.turn!==user.uid?"Not your turn":"Type a command"} onKeyDown={(e)=>checkIntro(e)}
                     onChange={(e)=>{setCommand(e.target.value);setError(false)}} error={error} value={command} helperText={error ? 'INVALID COMAND' : ''}/>
                </Grid>   

            </Grid>
        </Box>
        </>
    )
}
