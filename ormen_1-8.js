document.addEventListener("keydown", inputHandler);
let start = document.getElementById("start");
let reset_game = document.getElementById("reset");
start.addEventListener("click", timer);
reset_game.addEventListener("click", reset);

//canvas
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
var heightRatio = 1; //responsiv canvas
canvas.height = canvas.width * heightRatio; //responsiv canvas

//highscore
const scoreListContainer = document.getElementById("scoreListContainer");
var scoreCounters = scoreListContainer.getElementsByClassName("scoreCount");

let enableBlocks = false; //används för om vi ska spawna blocks eller inte
let movingBlocks = document.getElementById("movingBlocks");

//variabel för att det ska finnas borders eller inte
let enableBorders = true;

let playing = false;
let speed = 100;
let score = 0;

let boxSize = 25;
let gridSize = canvas.width / boxSize;


class Snake{
  constructor(){
    this.body = [{x: 10, y: 10},{x: 9, y: 10},{x: 8, y: 10}];
    this.direction ={x: 1, y: 0};
  }
  
  move(){
    const head = {
      x: this.body[0].x + this.direction.x,
      y: this.body[0].y + this.direction.y
    };

    this.body.unshift(head);
    this.body.pop();
    if (enableBorders == false){
      if (head.x >= gridSize) head.x = 0;
      if (head.x < 0) head.x = gridSize - 1;
      if (head.y >= gridSize) head.y = 0;
      if (head.y < 0) head.y = gridSize - 1;
    }
    else{
      if (head.x >= gridSize || head.x < 0 || head.y >= gridSize || head.y < 0){
        reset()
      }
    }
    
    for (let i = 1; i < snake.body.length; i++){
      if (head.x === snake.body[i].x && head.y === snake.body[i].y){
        reset()
      }
    }
    for ( let i = 0; i < blockList.length; i++){
      if (head.x === blockList[i].x / boxSize && head.y === blockList[i].y / boxSize){
        reset()
      }
    }
  }

  draw(){
    ctx.fillStyle = "lightgreen";
    this.body.forEach(segment =>{
      ctx.fillRect(
        segment.x * boxSize,
        segment.y * boxSize,
        boxSize,
        boxSize
      );
    });
  }

  changeDirection(newDirection){
    if (this.direction.x === -newDirection.x && 
      this.direction.y === -newDirection.y) return;
    this.direction = newDirection;
  }

  reset(){
    this.body = [{x: 10, y: 10},{x: 9, y: 10},{x: 8, y: 10}];
    this.direction ={x: 1, y: 0};
  }
  
  eat(){
    if (foodList.length < 1) return;
    else{
      for (let i = 0; i < foodList.length; i++){
        if (this.body[0].x == foodList[i].x / boxSize && this.body[0].y == foodList[i].y / boxSize){
          this.body.push(this.body[this.body.length - 1]);
          score += 1;
          foodList.pop()
          if (score % 3 == 0){
            speed *= 0.9;
            clearInterval(time);
            time = setInterval(updateCanvas, speed);
          }
        }   
      }
    }  
  }
}

const snake = new Snake();

//hanterar olika key inputs
function inputHandler(event){
  switch(event.key){
    case "ArrowUp":
    case "w":
    case "W":
      snake.changeDirection({x: 0, y: -1});
      event.preventDefault()
      break;
    case "ArrowDown":
    case "s":
    case "S":
      snake.changeDirection({x: 0, y: 1});
      event.preventDefault()
      break;
    case "ArrowLeft":
    case "a":
    case "A":
      snake.changeDirection({x: -1, y: 0});
      event.preventDefault()
      break;
    case "ArrowRight":
    case "d":
    case "D":
      snake.changeDirection({x: 1, y: 0});
      event.preventDefault()
      break;
    case " ":
      timer()
      break;
    case "r":
    case "R":
      reset()
      break;
  }
}

//checkar levels och uppdateras varje gång en input clickas
function levelCheck(){
  var checked_speed = document.querySelector('input[name = "speed"]:checked');
  var checked_map = document.querySelector('input[name = "map"]:checked');
  var checked_borders = document.querySelector('input[name = "borders"]:checked')
  var checked_blocks = document.querySelector('input[name = "blocks"]:checked')		

  //slow, medium & fast speed
  if(checked_speed.value == "slow") speed = 200;
  else if (checked_speed.value == "medium") speed = 100;
  else if (checked_speed.value == "fast") speed = 50;

  //large & small map
  if(checked_map.value == "large"){
    boxSize = 10;
    gridSize = canvas.width / boxSize;
  }
  else if (checked_map.value == "small"){
    boxSize = 25;
    gridSize = canvas.width / boxSize;
  } 
  
  //borders
  if(checked_borders.value == "noBorderPassThrough") enableBorders = true;
  else if(checked_borders.value == "borderPassThrough") enableBorders = false;

  //blocks
  if(checked_blocks.value == "noBlocks") enableBlocks = false;
  else if(checked_blocks.value == "haveBlocks" || "movingBlocks") enableBlocks = true;

  clearInterval(time)
  time = setInterval(reset, speed);
}
var inputs = document.querySelectorAll(".level-list input");
check = function() {
  levelCheck();
};
[].map.call(inputs, function(elem) {
  elem.addEventListener("click", check, false);
});

function updateCanvas(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  snake.move();
  snake.draw();
  snake.eat();
  food()
  if (movingBlocks.checked) {
    moveBlocksTowardSnake();
  }
  block()
  document.getElementById("scoreCounter").innerText = score;
}
let time;
let foodTime;
      
function timer(){
  playing = !playing; 
  if (playing){
    time = setInterval(updateCanvas, speed);
    foodTime = setInterval(addFood, 2000);
    document.getElementById("start").textContent = "Stop (space)";
  } 
  else if(!playing){
    clearInterval(time);
    clearInterval(foodTime);
    document.getElementById("start").textContent = "Start (space)";
  }
}

let highScoreList = []
function updateScore(x){
  highScoreList.push(x)
  highScoreList.sort(function(a, b){return b-a});

  if (highScoreList.length > 5) highScoreList.pop(-1)

  for (i = 0; i < highScoreList.length; i++){
    scoreCounters[i].innerHTML = highScoreList[i];
    if(scoreCounters[i].classList.contains("active") == false) scoreCounters[i].classList.add("active")
  }
}

function reset(){
  updateScore(score)
  levelCheck()
  snake.reset();
  score = 0;
  playing = true;
  timer()
  foodList = [];
  blockList = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  snake.draw();
  for (i = 0; i < 10; i++){
    addBlock()
  }
}

let foodList = [];
function addFood(){
  if (foodList.length < 1){
    //bestämmer en slumpmässig position för matbiten
    let x = Math.floor(Math.random() * (gridSize)) * boxSize;
    let y = Math.floor(Math.random() * (gridSize)) * boxSize;
    let foodPlace = true;
    //om maten rör ormen kommer maten att käkas upp
    for (let i = 0; i < snake.body.length; i++){
      if (x == snake.body[i].x && y == snake.body[i].y){
        for (let i = 0; i < foodList.length; i++){
          if (x == foodList[i].x && y == foodList[i].y){
            foodPlace = false;
          }
        }
      }
    }
    //om en matbit ska spawnas på ett block kommer den raderas och en ny kommer att skapas
    for(i = 0; i < blockList.length; i++){
      if(blockList[i].x == x && blockList[i].y == y){
        foodPlace = false;
        foodList = [];
        addFood()
      }
    }
    if (foodPlace) foodList.push({x,y}) 
  }
}
function food(){
  for (let i = 0; i < foodList.length; i++){
    ctx.fillStyle = "tomato";
    ctx.fillRect(foodList[i].x, foodList[i].y, boxSize, boxSize);
  }
}

let occupiedSquares = []; //
let blockList = [];

function addBlock(){
  if (enableBlocks == true){
    if (blockList.length < 10){
      let x = Math.floor(Math.random() * (gridSize)) * boxSize;
      let y = Math.floor(Math.random() * (gridSize)) * boxSize;
      let blockPlace = true;
      for (let i = 0; i < snake.body.length; i++){
        if (x == snake.body[i].x && y == snake.body[i].y){
          for (let i = 0; i < blockList.length; i++){
            if (x == blockList[i].x && y == blockList[i].y) blockPlace = false;
          }
        }
      }
      if (blockList)blockList.push({x,y})
    }
  }
  else return;
}
function block(){
  if (enableBlocks == true){
    for (let i = 0; i < blockList.length; i++){
      ctx.fillStyle = "blue";
      ctx.fillRect(blockList[i].x, blockList[i].y, boxSize, boxSize);
    }
  }
  else return;
}

function bfs(startX, startY, targetX, targetY){
  let queue = [[startX, startY]];
  let visited = new Set();
  let cameFrom = {};
  visited.add(`${startX},${startY}`);

  const directions = [
    [0, -1], // up
    [0, 1],  // down
    [-1, 0], // left
    [1, 0],  // right
  ];

  while (queue.length > 0) {
    let [x, y] = queue.shift();

    if (x === targetX && y === targetY) {
      // Reconstruct path
      let path = [];
      while (`${x},${y}` !== `${startX},${startY}`) {
        path.unshift([x, y]);
        [x, y] = cameFrom[`${x},${y}`];
      }
      return path;
    }

    for (let [dx, dy] of directions) {
      let nx = x + dx;
      let ny = y + dy;
      let key = `${nx},${ny}`;

      if (nx >= 0 && nx < gridSize && ny >= 0 && ny < gridSize &&!visited.has(key) &&isCellFree(nx, ny))visited.add;
    }
  }
}

let blockMoveCounter = 0;
const blockMoveInterval = 1; // move every x updateCanvas() calls

function moveBlocksTowardSnake() {
  blockMoveCounter++;
  if (blockMoveCounter < blockMoveInterval) return;
  blockMoveCounter = 0;

  const head = snake.body[0];

  for (let block of blockList) {
    // Initialize individual cooldown if it doesn't exist
    if (block.moveCooldown === undefined) {
      block.moveCooldown = Math.floor(Math.random() * 5) + 3;
    }

    // Decrease cooldown and skip if not ready
    block.moveCooldown--;
    if (block.moveCooldown > 0) continue;

    // Reset cooldown randomly (controls how slow each block moves)
    block.moveCooldown = 4 + Math.floor(Math.random() * 5);

    // Calculate direction toward snake's head
    const dx = head.x - block.x / boxSize;
    const dy = head.y - block.y / boxSize;

    // Determine the next position in pixels
    let nextX = block.x;
    let nextY = block.y;
    if (Math.abs(dx) > Math.abs(dy)) {
      nextX += Math.sign(dx) * boxSize;
    } else {
      nextY += Math.sign(dy) * boxSize;
    }

    // Check collision with snake's body
    let collisionWithSnake = snake.body.some(segment => {
      return nextX === segment.x * boxSize && nextY === segment.y * boxSize;
    });

    // Check collision with other blocks
    let collisionWithBlock = blockList.some(otherBlock => {
      // Make sure we don't compare the block with itself
      if (otherBlock === block) return false;
      return nextX === otherBlock.x && nextY === otherBlock.y;
    });

    // Only move if both collisions are avoided
    if (!collisionWithSnake && !collisionWithBlock) {
      block.x = nextX;
      block.y = nextY;
    }
  }
}

levelCheck()