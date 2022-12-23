class Game {
    constructor(title){
      this.title = title;
      this.moves = [];
    }
  }

class Move {
    constructor(title, learnMethod, learnLevel) {
        this.title = title;
        this.learnMethod = "no method";
        this.learnLevel = 99999;
    }

}

function displayMoves(pokemonData) {
    console.log("Näytetään liikkeet");

    var moves = pokemonData.moves;
    var cachedGames = [];

    for (let i = 0; i < moves.length; i++) {
        const move = moves[i];
        var gamesList = move.version_group_details;


        for (let g = 0; g < gamesList.length; g++) {
            const game = gamesList[g];
            
            // lisätään kaikki pokemonin liikelistassa mainitut pelit cachedGames-listaan
            if(cachedGames.findIndex(cachedGame => cachedGame.title === game.version_group.name) <= -1){
                cachedGames.push(new Game(game.version_group.name));
            }
            // jokainen liike oikean pelin kohdalle cachedGames-listaan
            const gameFound = cachedGames.findIndex(cachedGame => cachedGame.title == game.version_group.name);

            if(gameFound > -1){
                const gameIndexInData = gamesList.findIndex(game => game.version_group.name == cachedGames[gameFound].title)

                newMove = new Move(move.move.name);

                newMove.learnMethod = gamesList[gameIndexInData].move_learn_method.name;
                newMove.learnLevel = gamesList[gameIndexInData].level_learned_at;
                
                cachedGames[gameFound].moves.push(newMove);
            }
        }
    }
    console.log(cachedGames);
    displayMoves(cachedGames);
}


function displayMoves(cachedGames){

    const movesDiv = document.getElementById("moves");
    movesDiv.innerHTML = "";
    movesDiv.innerHTML += "<p>Moves</p>";

    for (let i = 0; i < cachedGames.lenght; i++) {
        const game = cachedGames[i];
        movesDiv.innerHTML += `<p>${game.title}</p>`;
        movesDiv.innerHTML += `<ol id='${game.title}'></ol>`;

        for (let m = 0; m < game.moves.length; m++) {
            const move = game.moves[m];
            document.getElementById(`${game.title}`).innerHTML +=
            `<li>${move.title}, ${move.learnMethod}, ${move.learnLevel}</li>`
        } 
    }
}
