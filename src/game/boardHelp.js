const letters = ['a','b','c','d','e','f','g','h','i']

export function boardToStrings(walls_placed,players){

    var keys = Object.keys(players)
    const X_x = players[keys[1]].x_position
    const X_y = players[keys[1]].y_position

    const Y_x = players[keys[0]].x_position
    const Y_y = players[keys[0]].y_position

    var result = [""]
    const tab = "\u00a0\u00a0\u00a0\u00a0"
    for(let y=9;y>0;y--){
        let temp1 = ""
        let temp2 = ""
        for(let x=1;x<10;x++){
            if(X_x===x&&X_y===y){
                temp1+="X "
            }else if(Y_x===x&&Y_y===y){
                temp1+="Y "
            }else{
                temp1 += letters[x-1] + y.toString()
            }
            if(x<9){
                if(!WallV(x,y,walls_placed)){
                    temp1 += "-- "
                }else{
                    temp1 +="\u00a0\u00a0\u00a0"
                }
            }
            if(!WallH(x,y,walls_placed)){
                temp2 += "|"+ tab 
            }else{
                temp2 += "\u00a0" + tab
            }
        }
        result.push(temp1)
            if(y>1){
                result.push(temp2)
                result.push(temp2)
            }
    }
    return result
}

export function validCommand(cmd,player,otherPlayer,walls_placed){
    if(typeof walls_placed==='undefined'){
        walls_placed=[]
    }
    if(cmd.length === 2){
        if(letters.includes(cmd[0])&&0<parseInt(cmd[1])&&10>parseInt(cmd[1])){
            return validStep(letters.indexOf(cmd[0])+1,parseInt(cmd[1]),player,otherPlayer,walls_placed)
        }
    }
    if(cmd.length === 3){
        if((letters.slice(0, -1)).includes(cmd[0])&&0<parseInt(cmd[1])&&9>parseInt(cmd[1])&&(cmd[2]==='h'||cmd[2]==='v') ){
            return validWall(letters.indexOf(cmd[0])+1,parseInt(cmd[1]),cmd[2],player,walls_placed)
        }
    }
    return false
}

function validWall(x,y,mode,player,walls_placed){
    if(typeof walls_placed==='undefined'){
        walls_placed=[]
    }
    var cell00 = x.toString() + y.toString()
    var cell01 = x.toString() + (y+1).toString()
    var cell10 = (x+1).toString() + y.toString()
    var cell11 = (x+1).toString() + (y+1).toString()
    
    if(mode=='h'){
        var wall1 = cell00 + cell01
        var wall2 = cell10 + cell11

        var wall3 = cell00 + cell10
        var wall4 = cell01 + cell11
    }else{
        var wall1 = cell00 + cell10
        var wall2 = cell01 + cell11

        var wall3 = cell00 + cell01
        var wall4 = cell10 + cell11
    }
    if(player['walls']>0){
        if( (!walls_placed.includes(wall1)) && (!walls_placed.includes(wall2) ) && (!(walls_placed.includes(wall3)&&walls_placed.includes(wall4))) ){
            return [wall1,wall2]
        }    
    }
    return false
}

function validStep(x,y,player,otherPlayer,walls_placed){
    if(typeof walls_placed==='undefined'){
        walls_placed=[]
    }
    var x_ = player.x_position
    var y_ = player.y_position

    var x__ = otherPlayer.x_position
    var y__ = otherPlayer.y_position

    var cell1 = x.toString() + y.toString()
    var cell2 = x_.toString() + y_.toString()

    var wall1 = cell1 + cell2
    var wall2 = cell2 + cell1

    if( (x===x_&& (y===y_+1||y===y_-1)) || (y===y_&&(x===x_+1||x===x_-1))){
        if( (!walls_placed.includes(wall1)) && (!walls_placed.includes(wall2) ) ){
            if(!(x===x__ && y===y__)){
                return [x,y]
            }
        }
    }
    return false
}

function WallV(x,y,walls_placed){
    if(typeof walls_placed==='undefined'){
        walls_placed=[]
    }
    var cell1 = x.toString() + y.toString()
    var cell2 = (x+1).toString() + y.toString()
    var wall = cell1 + cell2
    return walls_placed.includes(wall)
}

function WallH(x,y,walls_placed){
    if(typeof walls_placed==='undefined'){
        walls_placed=[]
    }
    var cell1 = x.toString() + y.toString()
    var cell2 = x.toString() + (y-1).toString()
    var wall =  cell2 + cell1
    return walls_placed.includes(wall)
}