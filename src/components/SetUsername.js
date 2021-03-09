import React, {useContext, useState} from 'react';
import {AuthContext} from '../context/AuthContext'

import {Grid, Button, TextField, Typography} from '@material-ui/core'

function SetUsername({database,auth}) {
    const { user } = useContext(AuthContext);
    const [username,setUsername] = useState("")
    const [error,setError] = useState(false)

    const handleSubmit =(e)=>{
        e.preventDefault()
        var usernameRegex = /^[a-zA-Z0-9]+$/;
        
        
        if(usernameRegex.test(username)){
            user.updateProfile({
                displayName: username,
                }).then(function() {
                // Update successful.
                }).catch(function(error) {
                    console.log(error)
                });
        }
        else{
            setError(true)
        }

    }

  return (
    <><form onSubmit={(e)=>handleSubmit(e)}>
        <Grid
        container
        spacing={1}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: '50vh' }}
        >
            <Typography>
                People will know you by the following name
            </Typography>
            <Grid item xs={3}>
                <TextField
                id="standard-multiline-flexible"
                placeholder="xXxQuoridormAsteRxxX"
                label="Username"
                value={username}
                error = {error}
                onChange={(e)=>{setUsername(e.target.value);setError(false)}}
                helperText={error ? 'INVALID USERNAME! try again buddy' : ''}
                />
            </Grid>  
            <Grid item xs={3}>

                <Button
                    type='submit'
                    variant="contained"
                >Continue</Button>
            </Grid>  
             

        </Grid> 
        </form>
    </>
  );
}

export default SetUsername;
