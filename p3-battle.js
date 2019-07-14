// --------------------------------Part 3 : The battle ! --------------------------------

//After the player click,
$("#restartGame").hide(); // add a hidden button to show in the end of the game

function removeEventHandler() {
    $("#player1Att, #player1Def, #player2Att, #player2Def").off("click");
    $(".showPlayer1, .showPlayer2").removeClass("highLight");
}

function battle(player) {
    removeEventHandler(); // remove all the event handlers on the bottons and highlights once the battle starts
    if (player === player1) { // when it's player1 who attack first, next player will be P2
        battlePlayers(player1, player2);
    } else {
        battlePlayers(player2, player1);
    }
}

function battlePlayers(currentPlayer, nextPlayer) {
    var currentPlayerNumber;
    var nextPlayerNumber;

    if (currentPlayer === player1) {
        currentPlayerNumber = 1;
        nextPlayerNumber = 2;
    } else {
        currentPlayerNumber = 2;
        nextPlayerNumber = 1;
    }

    $(".showPlayer" + currentPlayerNumber).addClass("highLight");// highlight the buttons of the player when it's their turn
    $("#player" + currentPlayerNumber + "Att").click(function(event) { // add event listner to the attack botton
        count ++;
        currentPlayer.defend = false; // if currentPlayer clicked attack botton, means it's not gonna defend
        if (nextPlayer.defend === false) { //if the other player also chooses attack
            nextPlayer.health = nextPlayer.health - currentPlayer.weapon.damage
        } else { //if the other player chooses defend
            nextPlayer.health = nextPlayer.health - currentPlayer.weapon.damage/2
        };
        $("#pb-player" + nextPlayerNumber).css("width", nextPlayer.health + "%").text(nextPlayer.health); // update the progress bar of the other player's health

        if (nextPlayer.health > 0){ // if the player has more than 0 in health, the game continues
        whosTurn();
        } else { // otherwise show message which player wins the game. 
            $("#pb-player" + nextPlayerNumber).text("0").css("width", "0%");
            $(".showPlayer" + currentPlayerNumber).removeClass("highLight"); // remove the highlight after one player has won
            setTimeout(function(){ alert( currentPlayer.name + " a gagné le combat !"); }, 1000);
            $("#restartGame").show();// in the end of the game, show the button to restart the game by refreshing the page
        }
    });
    $("#player" + currentPlayerNumber + "Def").click(function(event) { // add event listenr to the defend botton
        count ++;
        currentPlayer.defend = true;
        whosTurn();
    });
}
