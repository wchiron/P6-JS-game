//----------------Part 2 : the movements------------------------------------------------

function sendContentToPage(player) { // player1 or player2
    checkAvailableMoves(player, grid); // call this function here because the rows and columns are generated in the createTableHTMl function which will be called here
    createTableHTML();
    moveClick(player); 
}

var count = 0; // set up the general var for the count click function for activating players below in the loop, if the var left inside the function, it will be reset to zero everytime the function is called, hence the second player will never be called.

function moveClick(player) {
    $("td").click(function(event) {  // click function in this function to use the grid that just generated above
        var row = $(event.target).data("row");// using the clicked position data stocked in the function above
        var column = $(event.target).data("column");
        var cell = grid[row][column]; // get the location where the block is clicked
        if (cell.availableMove === true) {
            // count ++; // if leave the count++ here, even when the battle starts, it will be the next player to start the battle instead of the player who moved the last. since the count++ took place here
            grid[player.row][player.column].player = null;  // wipe out the old location of the player before setting up new location, otherwise there will be double player
            movePlayerToClick(player, row, column); // to move the player to the clicked location and change weapon if pass by
            grid[row][column].player = player; // after moving the player, retake the original position of the players
            player.row = row; // set the new row position
            player.column = column; // set the new column position
            if (checkStartBattle(player) === false) {
                count ++;  // count click and increment to swith between in the case where no battle was triggered, if no battle, count++ to switch to next player
            }
            for (var row = 0; row < grid.length; row++) {  // reset all the blocks after the click to wipe out the availableMoves of each turn after click, otherwise the availableMove blocks for both players will be showed at the same time
                for (var column = 0; column < grid[row].length; column++) { 
                    var cell = grid[row][column]; 
                    cell.availableMove = false; // wipe out the old availableMove
                }
            }
        } else {
            alert("Cette case est inaccessible"); // if block clicked is not valide, show this message, no click++ means not moving to next player until a valide click
        }
        whosTurn(); // next player's turn
    });
}

function whosTurn() {
    var player;
    if (count % 2 === 0) { // player1 goes first. if it's even number, it's player1's turn, odd number is player2's turn
        player = player1;
    } else {
        player = player2;
    }

    if (checkStartBattle(player) === true) { // if there is a player nearby, battle starts
        createTableHTML(); //display last player's movement before starting the battle
        battle(player);
    } else {
      sendContentToPage(player); // otherwise continue to show available move and update the html
    }
}
whosTurn(); // The function starts the move once the page is loaded

function movePlayerToClick(playerPosition, rowOfClick, columnOfClick) { //playerPosition is the player in the function of sendContentToPage. ANd added the cell in the parameter as it will be used in the changeWeapon function
    var directionRow = 0;
    var directionCol = 0;
    if (rowOfClick === playerPosition.row) { // when valide click and the player on the same row, check if the click is on the left or right the player to determine the moving direction
        if (columnOfClick < playerPosition.column) { // click position is on the left of the player position
            directionCol = -1;  // column - 1 until 
        } else { // click right side of the player
            directionCol = 1;
        }
    } else if (columnOfClick === playerPosition.column) { // check if the click is above or under of the player to determine the moving direction
        if (rowOfClick < playerPosition.row) { // click above the player
            directionRow = -1;
        } else {
            directionRow = 1;
        }
    }
    while ((playerPosition.row != rowOfClick) || (playerPosition.column != columnOfClick)) {  // as long as the row and column of player are not equel with the click, keep moving the player
        playerPosition.row = playerPosition.row + directionRow; 
        playerPosition.column = playerPosition.column + directionCol;
        changeWeapon(playerPosition,grid[playerPosition.row][playerPosition.column]); 
        $("#currentWeaponP1").text("Arme : " + player1.weapon.name + " - Dégâts : "  + player1.weapon.damage);// update the current weapon information
        $("#currentWeaponP2").text("Arme : " + player2.weapon.name + " - Dégâts : "  + player2.weapon.damage);

    }
}

function changeWeapon(playerPosition,cell) { //swith the weapon of the player when a player pass on top of the cell
    if (cell.weapon != null) {
        var temperaryDrop = playerPosition.weapon;
        playerPosition.weapon = cell.weapon;
        cell.weapon = temperaryDrop;
    } else {
        return null;
    }
}

function checkStartBattle(player) {
    var startBattle = false;
    if ((player.row - 1 >= 0) && (grid[player.row - 1][player.column].player != null)) { //left side of the player
        startBattle = true;
    } else if ((player.row + 1 <= 9) && (grid[player.row + 1][player.column].player != null)) { // right side of the player
        startBattle = true;
    } else if ((player.column - 1 >= 0) && (grid[player.row][player.column - 1].player != null)) { // above
        startBattle = true;
    } else if ((player.column + 1 <= 9) && (grid[player.row][player.column + 1].player != null)) { // below
        startBattle = true;
    } else {
        startBattle = false; // if no player nearby, no battle 
    }
    return startBattle;
}