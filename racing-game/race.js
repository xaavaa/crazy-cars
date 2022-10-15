/*
Racing game in JavaScript
Part 16
*/

/*jshint esversion: 6 */

// Whole-script strict mode syntax
//"use strict";
//console.log("Strict mode is on!");

// required canvas variables (using ctx instead of canvasContext)
var canvas;
var ctx;

function carClass() {
  
    // constants for car direction
    const CAR_START_NORTH = -90;
    const CAR_START_SOUTH = 0;
    const CAR_START_EAST = 0;
    const CAR_START_WEST = 180;

    // create constants for the car directions
    const ROAD_FRICTION = 0.98;
    const FORWARD_RATE = 0.2;
    const REVERSE_RATE = 0.2;
    const TURNING_RATE = 0.05;
    const MINIMUM_SPEED_TO_TURN = 0.4;
    
    // car image, name, x & y position, angle, and speed variables
    this.carImage = undefined;   // Don't assign nothing, use undefined going forward.
    this.name = "unNamed";
    this.car_x_position = 50;
    this.car_y_position = 50;
    this.carAngle = 0;
    this.car_speed = 0;
    
    // keyHeldDown variables with booleans
    this.keyHeldDown_Forward = false;
    this.keyHeldDown_Reverse = false;
    this.keyHeldDown_Right = false;
    this.keyHeldDown_Left = false;
    
    // create generic control keys properties that we can assign specific keys to at set up.
    this.controlKeyForward = undefined;
    this.controlKeyReverse = undefined;
    this.controlKeyRight = undefined;
    this.controlKeyLeft = undefined;
        
    // this setup function will assign different keyboard keys to each car
    this.setKeyboardKeys = function(forward, reverse, right, left) {
        this.controlKeyForward = forward;
        this.controlKeyReverse = reverse;
        this.controlKeyRight = right;
        this.controlKeyLeft = left;
    };
    
    // function to reset the car at start
    this.resetCar = function(whichImage, playerName) {
        this.carImage = whichImage;
        this.name = playerName;
        this.car_speed = 0;
        // search the map and find the number 2 which is where the car will be placed at start
        for (var eachRow = 0; eachRow < TRACK_ROWS; eachRow++) {
            for (var eachCol = 0; eachCol < TRACK_COLUMNS; eachCol++) {
                var arrayIndex = colRowToArrayIndex(eachCol, eachRow);
                // look for a 2 in the map, when found place it at that location
                // when found, reset the 2 to a 0 to make sure it stays road
                if(trackArrayGrid[arrayIndex] === TRACK_CAR_START) {
                    trackArrayGrid[arrayIndex] = TRACK_ROAD;
                    this.carAngle = CAR_START_NORTH * (Math.PI / 180.0);
                    this.car_x_position = eachCol * TRACK_WIDTH + TRACK_WIDTH/2;
                    this.car_y_position = eachRow * TRACK_HEIGHT + TRACK_HEIGHT/2;
                    return;
                }
            }
        }
        console.log("No " + playerName + " starting point found!");
    };
    
    // calculates next car position on setInterval cycle.
    this.calculateNextCarPosition = function() {
        // slow the car as it coasts to approximate friction
        this.car_speed *= ROAD_FRICTION;
    
        if(this.keyHeldDown_Forward) {
            this.car_speed += FORWARD_RATE;
        }
        if(this.keyHeldDown_Reverse) {
            this.car_speed -= REVERSE_RATE;
        }
        if(Math.abs(this.car_speed) > MINIMUM_SPEED_TO_TURN) {
            if(this.keyHeldDown_Right) {
                this.carAngle += TURNING_RATE;
            }
            if(this.keyHeldDown_Left) {
                this.carAngle -= TURNING_RATE;
            }
        }
        this.car_x_position += Math.cos(this.carAngle) * this.car_speed;
        this.car_y_position += Math.sin(this.carAngle) * this.car_speed;
      
        carTrackInteraction(this);
    };
    
    // call the function with needed arguments for car placement and rotation
    this.drawCar = function() {
        makeCenteredImageRotate(this.carImage, this.car_x_position, this.car_y_position, this.carAngle);
    };
}  // END OF CAR CLASS

// Car image variables
var carImage1 = document.createElement("img");
var carImage2 = document.createElement("img");

// temporarily track bitmap images during initial game loading
var trackImagesList = [];

// track colums and rows constants
const TRACK_COLUMNS = 20;
const TRACK_ROWS = 15;

// track wall piece dimension constants
const TRACK_WIDTH = 40;
const TRACK_HEIGHT = 40;
const TRACK_GAP_BETWEEN = 2;

// constants show which track element is which number
const TRACK_ROAD = 0;
const TRACK_WALL = 1;
const TRACK_CAR_START = 2;
const TRACK_GOAL = 3;
const TRACK_TREE = 4;
const TRACK_FLAG = 5;
const TRACK_ORANGUTAN = 6;
const TRACK_BOULDER = 7;
const TRACK_PALM = 8;
const TRACK_1 = 9;
const TRACK_2 = 10;
const TRACK_3 = 11;

// road is displayed where 0's are placed
// track walls are displayed where 1's are placed
// the cars will be placed by number 2
// other numbers can be used to place additional game elements (3, 4, 5, 6)

var masterLevelMap1 =[1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1,
                      1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
					  1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
					  1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
					  1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
					  1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
					  1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
					  1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
					  1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
					  1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
					  1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
					  1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
					  1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
					  1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
					  1, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,5];

// list that contains the variable names of all master level maps
var arrayOfLevelMaps = [masterLevelMap1];

// this variable keeps track of which map we are currently using
var currentLevelMapNumber = 0;

// the working array into which we copy a master level map
var trackArrayGrid = [];

// mouse position variable, global instead of local
var mouse_x_value = 0;
var mouse_y_value = 0;

// create a boolean variable to handle what to do when a car wins the race
var winner = false;

// variable to hold the car winner announcement
var announceWinner = "No Winner Yet";

// create timer and time variables to track how fast a level is cleared
var sec = 0;
var timer;
var timerMin = "00";
var timerSec = "00";

// function to pad a 0 in front of a single digit second
function padSingleDigitWithZero(seconds) {
        // ternary notation   cond true : false
        //return seconds > 9 ? seconds : "0" + seconds;
        if(seconds > 9){
            return seconds;
        } else {
            return "0" + seconds;
        }
}

// function to create a count up from zero timer
function countUpTimer() {
    timer = setInterval(function (){
        timerSec = padSingleDigitWithZero(sec++ % 60);
        timerMin = padSingleDigitWithZero(parseInt(sec / 60, 10));
    }, 1000);
}

// fucntion to reset the timer variables back to zero
function resetTimerVariables(){
    timerMin = "00";
    timerSec = "00";
    sec = 0;
}
                        
// arrow key codes as constants
const ARROW_KEY_UP = 38;
const ARROW_KEY_DOWN = 40;
const ARROW_KEY_RIGHT = 39;
const ARROW_KEY_LEFT = 37;
const W_KEY_UP = 87;
const S_KEY_DOWN = 83;
const D_KEY_RIGHT = 68;
const A_KEY_LEFT = 65;

// function to determine and return the x, y mouse position on the canvas
// object regardless of how big the screen is or if you have it scrolled
// to the side, or up and down.
function determineMousePosition(event) {
    var canvasRectangle = canvas.getBoundingClientRect();
    var wholeWebPage = document.documentElement;
    mouse_x_value = event.clientX - canvasRectangle.left - wholeWebPage.scrollLeft;
    mouse_y_value = event.clientY - canvasRectangle.top - wholeWebPage.scrollTop;
    
    // TEMPORARY code tests car in any position by attaching car x & y position to mouse position
    //car_x_position = mouse_x_value;
    //car_y_position = mouse_y_value;
    //car_x_speed = 4;
    //car_y_speed = -4;
    
    return {
            x:mouse_x_value,
            y:mouse_y_value
    };
    
}

// function to actually set up control keys for each car
function carControlKeySetup(keyEvent, whichCar, bindToThisKey) {
    if(keyEvent.keyCode === whichCar.controlKeyForward) {
        whichCar.keyHeldDown_Forward = bindToThisKey;
    }
    if(keyEvent.keyCode === whichCar.controlKeyReverse) {
        whichCar.keyHeldDown_Reverse = bindToThisKey;
    }
    if(keyEvent.keyCode === whichCar.controlKeyRight) {
        whichCar.keyHeldDown_Right = bindToThisKey;
    }
    if(keyEvent.keyCode === whichCar.controlKeyLeft) {
        whichCar.keyHeldDown_Left = bindToThisKey;
    }
}

// function runs when we press and hold a key down
function keyIsPressed(keyEvent) {
    //console.log("Key Pressed: " + keyEvent.keyCode);
    carControlKeySetup(keyEvent, player1, true);
    carControlKeySetup(keyEvent, player2, true);
    
    //cancels event from occuring more than the first time, when key held down
    keyEvent.preventDefault();
}

// function runs when we release a key that was held down
function keyIsLetUp(keyEvent) {
    //console.log("Key Released: " + keyEvent.keyCode);
    carControlKeySetup(keyEvent, player1, false);
    carControlKeySetup(keyEvent, player2, false);
}

// function to load initial map level and cars
function loadStartMapLevel(mapList) {
    if(currentLevelMapNumber < mapList.length){
        //console.log("current map is: " + currentLevelMapNumber);
        trackArrayGrid = mapList[currentLevelMapNumber].slice();
        //console.log("current map is: " + mapList[currentLevelMapNumber]);
        player1.resetCar(carImage1, "Lightning Bolt");
        player2.resetCar(carImage2, "Blue Vortex");
        currentLevelMapNumber++;
    }
}

// function which will load the map level and cars
function loadNextMapLevel(mapList) {
    // copy the full contents of the parameter array into trackArrayGrid array 
    if(currentLevelMapNumber < mapList.length){
        //console.log("loadNextMapLevel - current map is: " + currentLevelMapNumber);
        //console.log("loadNextMapLevel - current map is: " + mapList[currentLevelMapNumber]);
        trackArrayGrid = mapList[currentLevelMapNumber].slice();
        //console.log("loadNextMapLevel - current map is now: " + trackArrayGrid);
        // run reset car function for each player car
        player1.resetCar(carImage1, "Lightning Bolt");
        player2.resetCar(carImage2, "Blue Vortex");
        currentLevelMapNumber++;
        //console.log("loadNextMapLevel - current map is: " + currentLevelMapNumber);
    }
}

// A list array of custom bitmap image object literals
var bitmapImageList =
    [ {varName: carImage1, imageSource: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1086855/car1_30x16.png"},
      {varName: carImage2, imageSource: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1086855/car2_30x12.png"},
      {trackPiece: TRACK_WALL, imageSource: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1086855/track_wall.png"},
      {trackPiece: TRACK_ROAD, imageSource: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1086855/track_road.png"},
      {trackPiece: TRACK_GOAL, imageSource: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1086855/track_goal.png"},
      {trackPiece: TRACK_TREE, imageSource: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1086855/track_tree.png"},
      {trackPiece: TRACK_FLAG, imageSource: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1086855/track_flag.png"},
      {trackPiece: TRACK_ORANGUTAN, imageSource: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1086855/monkey40x40.png"},
      {trackPiece: TRACK_BOULDER, imageSource: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1086855/boulderGray1_40x40.png"},
      {trackPiece: TRACK_PALM, imageSource: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1086855/palmTree1_40x40.png"},
      {trackPiece: TRACK_1, imageSource: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1086855/number-block-one40x40.jpg"},
      {trackPiece: TRACK_2, imageSource: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1086855/number-block-two40x40.jpg"},
      {trackPiece: TRACK_3, imageSource: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1086855/number-block-three40x40.jpg"}
    ];

// assign number of images to a variable we can use in for loop
var numberOfImagesToLoad = bitmapImageList.length;
console.log("number of images to load: " + numberOfImagesToLoad);

// Counter function which knows how many images are in the array
// Decreases by 1 as each image loads until numberOfImagesToLoad is zero.
function countImagesToLoad() {
    numberOfImagesToLoad--;
    //console.log(numberOfImagesToLoad + " images left to load");
    if(numberOfImagesToLoad === 0) {
        console.log("done loading images");
    }
}
    
// Triggers the loading of each game image. Handles its name and sourceURL.
// Also calls the image counting helper function.
function beginLoadingImage(imgName, sourceUrl) {
    imgName.onload = countImagesToLoad();
    imgName.src = sourceUrl;
}
    
// function which handles loading track pieces by number
function loadTrackImagePiece(trackImageNumber, sourceUrl) {
    //console.log("Image loading is: " + trackImageNumber);
    trackImagesList[trackImageNumber] = document.createElement("img");
    //console.log(trackImagesList[trackImageNumber]);
    beginLoadingImage(trackImagesList[trackImageNumber], sourceUrl);
}

// function which handles loading of all graphic images in a list
function loadAllBitmapGraphics(bitmapList) {
    for(var i = 0; i < bitmapList.length; i++) {
        // varName property is used for car images, logos and misc stuff
        if(bitmapList[i].varName !== undefined){
            beginLoadingImage(bitmapList[i].varName, bitmapList[i].imageSource);
        }
        // trackPiece property is used for all images that make up track only
        else{
            loadTrackImagePiece(bitmapList[i].trackPiece, bitmapList[i].imageSource);
        }
    }
}

// instantiate two new cars from the car class blueprint
var player1 = new carClass();
var player2 = new carClass();

// function which initially runs only after all the code has loaded into memory
window.onload = function () {
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");
    
    // calls our function to run at 30 fps
    var framesPerSecond = 30;
    setInterval(function() {
        calculateNextPosition();
        drawAllElements();
        }, 1000 / framesPerSecond);
    
     // start timer when page loads
    // TODO start timer when car moves, not on reset
    countUpTimer();
    
    // adds an Event Listener to report mouse position every time mouse is moved.
    // the mouse Y position was used to control left paddle
    canvas.addEventListener("mousemove",
            function(event) {
                var mousePosition = determineMousePosition(event);
            }
    );
    
    // event listener for a key press down and hold
    document.addEventListener("keydown", keyIsPressed);
    
    // event listener for release of a key that was held down
    document.addEventListener("keyup", keyIsLetUp);
    
    // add event listener to hear the mouse click to reset the game on reset.
    canvas.addEventListener("mousedown",
            function(event) {
                if(winner) {
                    winner = false;
                    resetTimerVariables();
                    countUpTimer();
                    loadStartMapLevel();
                }
            }
    );
    
    // call the loadMapLevel function to set up the map and car positions prior to game start.    
    loadStartMapLevel(arrayOfLevelMaps);
    console.log("after loadStartMapLevel(), current map num now: " + currentLevelMapNumber);
    
    // function call to load all bitmap graphics
    loadAllBitmapGraphics(bitmapImageList);
   
    // assign control keys to player1 and player2
    player1.setKeyboardKeys(W_KEY_UP, S_KEY_DOWN, D_KEY_RIGHT, A_KEY_LEFT);
    player2.setKeyboardKeys(ARROW_KEY_UP, ARROW_KEY_DOWN, ARROW_KEY_RIGHT, ARROW_KEY_LEFT);
};

// helper function to determine which track is at a given col, row
// used in carTrackInteraction() below to handle bottom row of tracks
// not having a valid previous track (ie. no row starting 140 etc.)
function trackPieceAtColRow(col, row) {
    if(col >= 0 && col < TRACK_COLUMNS && row >= 0 && row < TRACK_ROWS) {
        var trackIndexUnderCoord = colRowToArrayIndex(col, row);
        //return (trackArrayGrid[trackIndexUnderCoord] !== TRACK_ROAD && trackArrayGrid[trackIndexUnderCoord] !== TRACK_GOAL);
        //return (trackArrayGrid[trackIndexUnderCoord] !== TRACK_ROAD);
        return trackArrayGrid[trackIndexUnderCoord];
    } else {
        //return false;
        return TRACK_WALL;
    }
}

// This function handles the relationship between ON and OFF tracks and the car.
function carTrackInteraction(whichCar) {
    var carTrackCol = Math.floor(whichCar.car_x_position / TRACK_WIDTH);
    var carTrackRow = Math.floor(whichCar.car_y_position / TRACK_HEIGHT);
    var trackIndexUnderCar = colRowToArrayIndex(carTrackCol, carTrackRow);
    
    // Not enough to only check to see if car in col >= 0 and row >= 0.
    // Must check to ensure each are LESS than constants for TRACK_COLUMNS and
    // TRACK_ROWS to avoid opposite side bricks from changing to false.
    if(carTrackCol >= 0 && carTrackCol < TRACK_COLUMNS && carTrackRow >= 0 && carTrackRow < TRACK_ROWS) {
        var numberOfTrackPiece = trackPieceAtColRow(carTrackCol, carTrackRow);
        // custom reaction to each block number at that Column and Row.
        if(numberOfTrackPiece === TRACK_GOAL) {
            //IF there are no more maps, the current map number will equal the length
            // of the arrayOfMaps list. When goal tile is reached at this point, game pauses
            // for reset
            if(currentLevelMapNumber === arrayOfLevelMaps.length){
                //console.log(currentLevelMapNumber);
                winner = true;
                announceWinner = "ud83dude03 with" + whichCar.name + " Wins the race!";
                clearInterval(timer);
            }
            // Once a car wins on current map, load next map and place cars.
            loadNextMapLevel(arrayOfLevelMaps);
        }
        else if (numberOfTrackPiece !== TRACK_ROAD) {
            //They undo the car's most recent motion so that its center no longer overlaps a wall.
            //This cancels out whatever motion landed the car in a collision in the first place
            whichCar.car_x_position -= Math.cos(whichCar.carAngle) * whichCar.car_speed;
            whichCar.car_y_position -= Math.sin(whichCar.carAngle) * whichCar.car_speed;

            // now reverse and half the car speed value
            whichCar.car_speed *= -0.5;
        }               
    }
}

// calculates the next car position for each player car including collisions
function calculateNextPosition() {
    if(winner){
        return;
    }
    
    player1.calculateNextCarPosition();
    player2.calculateNextCarPosition();
}

// helper function to determine the array index of the track at col, row given
function colRowToArrayIndex(col, row) {
    return col + TRACK_COLUMNS * row;
}

// function which draws track pieces listed in trackImagesList as the number in trackArrayGrid
// function runs each time screen is refreshed
function drawTrackElements() {
    var bitmapArrayIndex = 0;
    var imageTopLeftX = 0;
    var imageTopLeftY = 0;
    for (var eachRow = 0; eachRow < TRACK_ROWS; eachRow++) {
        for (var eachCol = 0; eachCol < TRACK_COLUMNS; eachCol++) {
            bitmapArrayIndex = colRowToArrayIndex(eachCol, eachRow);
            
            var mapImageNumber = trackArrayGrid[bitmapArrayIndex];
            var selectedMapImage = trackImagesList[mapImageNumber];
            
            ctx.drawImage(selectedMapImage, imageTopLeftX, imageTopLeftY);
            
            imageTopLeftX += TRACK_WIDTH;
            bitmapArrayIndex ++;
        }
        imageTopLeftY += TRACK_HEIGHT;
        imageTopLeftX = 0;
    }
}

function drawAllElements() {
    // winner logic
    if(winner){
        // use the announceWinner text created and assigned in carTrackInteraction() and
        // place on black background to be easily seen.
        makeFillColorRect(95, canvas.height / 4, 600, 75, "black"); //TODO put into new text function
        makeColorText(announceWinner, 100, canvas.height / 3, "yellow", 40);
        currentLevelMapNumber = 0;
        return;
    }
    
    // draws the track walls
    drawTrackElements();

    // call the function with needed arguments for player car placement and rotation
    // call each car instance from carClass to draw each player car
    player1.drawCar();
    player2.drawCar();
    
    // race timer
    makeFillColorRect(245, 5, 145, 30, "black"); //TODO put into new text function
    makeColorText("Timer: " + timerMin + ":" + timerSec, 250, 27, "yellow", 24);
    
    // TEMPORARILY get mouse x, y position and display in white text next to the mouse pointer.
    // This is for showing how mouse pointer is mapped to pixels on screen x, y and is used 
    // for debugging.
    
    //mouse_x_value = Math.floor(mouse_x_value);
    //mouse_y_value = Math.floor(mouse_y_value);
    //makeColorText(mouse_x_value + "," + mouse_y_value, mouse_x_value, mouse_y_value, "white", 16);
    
    // TEMPORARILY get mouse x, y position and display in white text next to the mouse pointer.
    // This is for showing how mouse pointer is mapped to track row, col and track # on screen
    // x, y and is used for debugging.
    /*
    var mouse_track_column = Math.floor(mouse_x_value / TRACK_WIDTH);
    var mouse_track_row = Math.floor(mouse_y_value / TRACK_HEIGHT);
    var trackIndexUnderMouse = colRowToArrayIndex(mouse_track_column, mouse_track_row);
    makeColorText( mouse_track_column + "," + mouse_track_row + ": " + trackIndexUnderMouse,
        mouse_x_value, mouse_y_value, "white", 16);
    */
    // use mouse to change trackIndexUnderMouse in trackArraygrid[] to false, making it disappear.
    /*
    if(trackIndexUnderMouse >= 0 && trackIndexUnderMouse < TRACK_COLUMNS * TRACK_ROWS) {
        trackArrayGrid[trackIndexUnderMouse] = false;
    }
    */
    
}

// SHAPE AND TEXT FUNCTION LIBRARY

function makeCenteredImageRotate(myImage, posX, posY, atAngle) {
    // before the function runs, save the current state of the canvas
    ctx.save();
    // now in reverse order:
        // drawImage() runs
        // then rotate()
        // then translate()
    ctx.translate(posX, posY);
    ctx.rotate(atAngle);
    ctx.drawImage(myImage, -myImage.width/2, -myImage.height/2);
    // when function done and returns, return the canvas back to original state
    ctx.restore();
}

function makeFillColorRect(topLeftX, topLeftY, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(topLeftX, topLeftY, width, height);
}

function makeFillColorCircle(xCenter, yCenter, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(xCenter, yCenter, radius, 0, Math.PI * 2, true);
    ctx.fill();
}

// function to make color text appear on the screen
function makeColorText(showWords, textX, textY, color, fontSize) {
    // make the below string and pass it to ctx.font
    //ctx.font = "24px sans-serif ";
    var sizeAndTypeface = String(fontSize + "px sans-serif");
    ctx.font = sizeAndTypeface;
    ctx.fillStyle = color;
    ctx.fillText(showWords, textX, textY);
}