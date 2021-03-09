export function newGame(game_id,user){
    return {
        game_id:game_id,
        cretor_name:user.displayName,
        walls_placed:[],
        turn:user.uid,
        photo:user.photoURL,
        finished:false,
        complete:false
    }
}