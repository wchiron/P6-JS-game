// ----------------Part 1 : Create table with a string which contains object------------------------------------
var grid = []; 
for (var row = 0; row < 10; row++) {
    var newRow = [];
    for (var column = 0; column < 10; column++) {
        var cell = {
            accessible : true,
            player : null,
            weapon : null, 
            availableMove : false,
        };
        newRow.push(cell); // push columns to the empty rows,  
    }
    grid.push(newRow); // push the rows with accessible columns to the grid
}

function pickANumber() { // to create a random number
   var rand = Math.floor(Math.random() * 10);
   return rand;
}

for (var i=0; i < 10; i++) {  //to create inaccessible blocks randomly
    var rowInaccessible = pickANumber();
    var columnInaccessible = pickANumber();

    grid[rowInaccessible][columnInaccessible].accessible = false;//create random inaccessible blocks, by setting the accessible to false
}

// ----------------Creation of the weapons------------------------------------

function placeWeapon(name) { // to generate weapons in the grid
    var weaponRow = pickANumber();
    var weaponColumn = pickANumber();
    var weaponCell = grid[weaponRow][weaponColumn];
    if ((weaponCell.accessible === true) && (weaponCell.weapon === null) && (weaponCell.player === null)) {
        grid[weaponRow][weaponColumn].weapon = name; // if the cell is accessible, with no players on it and no weapons on it, change the cell weapon null to the weapon name
    } else {
        placeWeapon(name); // otherwise restart the searching process
    }
}  

function Weapon(name, damage) { // a constructor to creat weapons, it constructs an object
    this.name = name; 
    this.damage = damage;
}

var club = new Weapon ("club", 10) // club is the default weapon, 

var dagger = new Weapon ("dagger", 20) 
placeWeapon(dagger);// passing the weapon name to the placeWeapon

var axe = new Weapon ("axe", 24) 
placeWeapon(axe);

var hammer = new Weapon ("hammer", 28) 
placeWeapon(hammer);

var sword = new Weapon ("sword", 30) 
placeWeapon(sword);

// ----------------Creation of the players------------------------------------

function checkPlayerNearby(rowForPlayer, columnForPlayer) { // to check if there is any player around the new player, to avoid putting players next to each other while generating the game
    var topBottom = rowForPlayer;
    var leftRight = columnForPlayer;

    if (topBottom === 0) { //if the player is on the top row, don't check the row above
        var checkUp = null;
    } else {
        var checkUp = grid[rowForPlayer - 1][columnForPlayer].player;
    }
    
    if (topBottom === 9) {//if the player is on the bottom row, don't check the row below
        var checkDown = null;
    } else {
        var checkDown = grid[rowForPlayer + 1][columnForPlayer].player; //before the function checks the grid for the player, now it goes to the cell.player to verifer the existance of the player
    }
    
    if (leftRight === 0) {
        var checkLeft = null;
    } else {
        var checkLeft = grid[rowForPlayer][columnForPlayer - 1].player;
    }
    
    if (leftRight === 9) {
        var checkRight = null;
    } else {
        var checkRight = grid[rowForPlayer][columnForPlayer + 1].player;
    }
    if ([checkUp, checkDown, checkLeft, checkRight].indexOf(player1) != -1 || [checkUp, checkDown, checkLeft, checkRight].indexOf(player2) != -1)  { // -1 means index not found, != -1 means there is one playe nearby
        var playerNearBy = true; // there is a player nearby
    } else {
        var playerNearBy = false;
    }
    return playerNearBy;
}

function placePlayer(playerInfo) {  // create players
    var playerRow = pickANumber();
    var playerColumn = pickANumber();
    var playerCell = grid[playerRow][playerColumn];
    var playerNearBy = checkPlayerNearby(playerRow, playerColumn); //passing the location as parameters for the function checkPlayerNearby
    if ((playerCell.accessible === true) && (playerCell.weapon === null) && (playerCell.player === null)) { // if the cell is accessible, no weapon on place, and no player on place already, check furthur more for player nearby, accessible doens't need to be equels true as it's true by default
        if (playerNearBy === true) { // if there is a player nearby, restart the player generation processe
            placePlayer(playerInfo);
        } else {
            grid[playerRow][playerColumn].player = playerInfo; // if no player nearby, generate a location for the player
            playerInfo.row = playerRow; // save the player row and column information of the player in the object for further use in checking available moving blocks for the players
            playerInfo.column = playerColumn;
        }    
    } else {
        placePlayer(playerInfo);// if the location generated is inaccessible or already taken, restart the function until find a suitable one
    }
}

function Player(name, health) { // player object setup
    this.name = name;
    this.health = health; 
    this.weapon = club;
    this.row = null;
    this.column = null;
    this.defend = false;
}

var player1 = new Player("", 100); // using constractor Player to create objects
placePlayer(player1); 

var player2 = new Player("", 100);
placePlayer(player2);  

function defaultPlayerName() {
    if (player1.name === "") {
        player1.name = "Joueur 1";
    } 
    if (player2.name === "") {
        player2.name = "Joueur 2";
    }
}

$("#startGame").click(function() {
    player1.name = $("#player1Name").val(); //get the value of the form input
    player2.name = $("#player2Name").val();
    defaultPlayerName(); // if no name inputed, put player 1 and player 2 as default names
    $("#showNamePlayer1").text(player1.name); // show the name under the player image
    $("#showNamePlayer2").text(player2.name);
    $("#currentWeaponP1").text("Arme : " + player1.weapon.name + " - Dégâts : " + player1.weapon.damage); // show the current weapon information
    $("#currentWeaponP2").text("Arme : " + player2.weapon.name + " - Dégâts : " + player2.weapon.damage);
    $("#beforeGameStarts").hide(); // hide the name inputing section
    $("#game").show(); // show the game section
})

function checkAvailableMoves(playerInfo, grid) { //check for available moves for each player for each round
    var i = 1;
    var limit = 3;
    while (i <= limit) {
        if ((playerInfo.row + i <= 9) && (grid[playerInfo.row + i][playerInfo.column].accessible === true) && (grid[playerInfo.row + i][playerInfo.column].player === null)){ // checking left. add condition that if the playInfo.row reaches outside of 0-9, stop checking for available blocks. also by adding accessible === true, the function will stop checking for accessible blocks after encoutner an obstacle.
            grid[playerInfo.row + i][playerInfo.column].availableMove = true;
            i++;
        } else {
            break;
        }
    }
    var i = 1; // to reset the i, otherwise i = 3 after the first "if" and the next 3 loops will never start
    while (i <= limit) {
        if ((playerInfo.row - i >= 0) && (grid[playerInfo.row - i][playerInfo.column].accessible === true) && (grid[playerInfo.row - i][playerInfo.column].player === null)) { // checking right. check the existence of the block before checking it's accessibility
            grid[playerInfo.row - i][playerInfo.column].availableMove = true;
            i++;
        } else {
            break;
        }
    }
    var i = 1;
    while (i <= limit) {
        if ((playerInfo.column + i <= 9) && (grid[playerInfo.row][playerInfo.column + i].accessible === true) && (grid[playerInfo.row][playerInfo.column + i].player === null)) { // checking down
            grid[playerInfo.row][playerInfo.column + i].availableMove = true;
            i++;
        } else {
            break;
        }
    }
    var i = 1;
    while (i <= limit) {
        if ((playerInfo.column - i >= 0) && (grid[playerInfo.row][playerInfo.column - i].accessible === true) && (grid[playerInfo.row][playerInfo.column - i].player === null)) { // checking up
            grid[playerInfo.row][playerInfo.column - i].availableMove = true;
            i++;
        } else {
            break;
        }
    }
} 

// -----------Send the table, players and weapons to the html and create the table into the html------------------

function createTableHTML() {
    $("table").empty(); // empty the table when reload, otherwise everytime this function is call, it will add another 10*10 to the existing table
    for (var row = 0; row < grid.length; row++) {
        var tr = $("<tr>"); // <> to create html elements,  create rows first
        $("table").append(tr);
        for (var column = 0; column < grid[row].length; column++) {  // add in the columns to the rows
            var td = $("<td>").data("row", row).data("column", column); // stock the info of each cell in the data jQuery to use in the click event
            $(tr).append(td);
            var cell = grid[row][column];            
            if (cell.accessible) {  // for showing in html only !!
                if (cell.player === player1) {
                    $(td).addClass("player1");
                } else if (cell.player === player2) {
                    $(td).addClass("player2");
                } else if (cell.weapon === dagger) {
                    $(td).addClass("dagger").attr("title", "dagger, dégâts : " + dagger.damage);
                } else if (cell.weapon === axe) {
                    $(td).addClass("axe").attr("title", "axe, dégâts : " + axe.damage);
                } else if (cell.weapon === hammer) {
                    $(td).addClass("hammer").attr("title", "hammer, dégâts : " + hammer.damage);
                } else if (cell.weapon === sword) {
                    $(td).addClass("sword").attr("title", "sword, dégâts : " + sword.damage);
                } else if (cell.weapon === club) {
                    $(td).addClass("club").attr("title", "club, dégâts : " + club.damage);
                } 
                if (cell.availableMove === true) { // using if instead of else if, means a cell could be accessible, with a weapon or a player, and availableMove at the same time
                    $(td).addClass("availableMove");
                } else {
                    $(td).addClass("emptyCell"); 
                }
            } else {
                $(td).addClass("inaccessibleCell");
            } 
        }    
    }
}