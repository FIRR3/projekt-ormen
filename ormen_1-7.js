document.addEventListener("keydown", inputHandler);
let start = document.getElementById("start");
let reset_game = document.getElementById("reset");
start.addEventListener("click", timer);
reset_game.addEventListener("click", reset);
let borderPassTrough = document.getElementById("borderPassTrough");

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let playing = false;
let speed = 100;
let scoreCounter = 0;

let boxSize = 25;
let gridSize = canvas.width / boxSize;

//responsiv canvas
var heightRatio = 1;
canvas.height = canvas.width * heightRatio;

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
    if (borderPassTrough.checked){
      if (head.x >= gridSize) head.x = 0
      if (head.x < 0) head.x = gridSize - 1
      if (head.y >= gridSize) head.y = 0
      if (head.y < 0) head.y = gridSize - 1 
    }
    else{
      if (head.x >= gridSize || head.x < 0 || head.y >= gridSize || head.y < 0){
        reset();
      }
    }
    
    for (let i = 1; i < snake.body.length; i++){
      if (head.x === snake.body[i].x && head.y === snake.body[i].y){
        reset();
      }
    }
    for ( let i = 0; i < block_list.length; i++){
      if (head.x === block_list[i].x / boxSize && head.y === block_list[i].y / boxSize){
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
    scoreCounter = 0;
  }
  
  eat(){
    if (foodList.length < 1) return;
    else{
      for (let i = 0; i < foodList.length; i++){
        if (this.body[0].x == foodList[i].x / boxSize && this.body[0].y == foodList[i].y / boxSize){
          this.body.push(this.body[this.body.length - 1]);
          scoreCounter += 1;
          foodList.pop()
          if (scoreCounter % 3 == 0){
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
      break;
    case "ArrowDown":
    case "s":
    case "S":
      snake.changeDirection({x: 0, y: 1});
      break;
    case "ArrowLeft":
    case "a":
    case "A":
      snake.changeDirection({x: -1, y: 0});
      break;
    case "ArrowRight":
    case "d":
    case "D":
      snake.changeDirection({x: 1, y: 0});
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

    if(checked_speed.value == "slow") speed = 200;
    else if (checked_speed.value == "medium") speed = 100;
    else if (checked_speed.value == "fast") speed = 50;

    if(checked_map.value == "large"){
      boxSize = 10;
      gridSize = canvas.width / boxSize;
    }
    else if (checked_map.value == "small"){
      boxSize = 25;
      gridSize = canvas.width / boxSize;
    } 
    
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
  block()
  document.getElementById("scoreCounter").innerText = scoreCounter;
}
let time;
let food_time;
      
function timer(){
  playing = !playing; 
  if (playing){
    time = setInterval(updateCanvas, speed);
    food_time = setInterval(addFood, 2000);
    document.getElementById("start").textContent = "Stop (space)";
  } 
  else if(!playing){
    clearInterval(time);
    clearInterval(food_time);
    document.getElementById("start").textContent = "Start (space)";
  }
}
function reset(){
  snake.reset();
  playing = true;
  timer()
  foodList = [];
  block_list = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  snake.draw();
  for (i = 0; i < 10; i++){
    addBlock()
  }
}
let foodList = [];
function addFood(){
  if (foodList.length < 1){
    let x = Math.floor(Math.random() * (gridSize)) * boxSize;
    let y = Math.floor(Math.random() * (gridSize)) * boxSize;
    let food_place = true;
    for (let i = 0; i < snake.body.length; i++){
      if (x == snake.body[i].x && y == snake.body[i].y){
        for (let i = 0; i < foodList.length; i++){
          if (x == foodList[i].x && y == foodList[i].y){
            food_place = false
          }
        }
      }
    }   
    if (food_place) foodList.push({x,y}) 
  }
}
function food(){
  for (let i = 0; i < foodList.length; i++){
    ctx.fillStyle = "tomato";
    ctx.fillRect(foodList[i].x, foodList[i].y, boxSize, boxSize);
  }
}

let block_list = [];
function addBlock(){
  if (block_list.length < 10){
    let x = Math.floor(Math.random() * (gridSize)) * boxSize;
    let y = Math.floor(Math.random() * (gridSize)) * boxSize;
    let block_place = true
    for (let i = 0; i < snake.body.length; i++){
      if (x == snake.body[i].x && y == snake.body[i].y){
        for (let i = 0; i < block_list.length; i++){
          if (x == block_list[i].x && y == block_list[i].y) block_place = false
        }
      }
    }   
    if (block_list)block_list.push({x,y})
  }
}
function block(){
  for (let i = 0; i < block_list.length; i++){
    ctx.fillStyle = "white";
    ctx.fillRect(block_list[i].x, block_list[i].y, boxSize, boxSize);
  }
}
for (i = 0; i < 10; i++){
  addBlock()
}