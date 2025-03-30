const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const scoreCounter = document.getElementById("scoreCounter");
const canvasSize = canvas.width;

//storleken på varje box i spelet (mappen, mat, spelaren, väggar, etc)
let boxSize = 25;

//när man klickar 'space' startas/stoppas spelet
let start = document.getElementById("start");
start.addEventListener("click", timer);
document.addEventListener("keydown", (event)=>{
  if (event.key === " ") timer()
})

let snake = [{ x: 250, y: 250 }];
let direction = "RIGHT";
let food = foodPlacement();
let score = 0;
let gameRunning = false;
let speed = 100

//responsiv canvas
var heightRatio = 1;
canvas.height = canvas.width * heightRatio;

//checkar levels och uppdateras varje gång en input clickas
function levelCheck(){
  var checked_speed = document.querySelector('input[name = "speed"]:checked');
  var checked_map = document.querySelector('input[name = "map"]:checked');		

  if(checked_speed.value == "slow") speed = 200
  else if (checked_speed.value == "medium") speed = 100
  else if (checked_speed.value == "fast") speed = 50

  if(checked_map.value == "large") boxSize = 25
  else if (checked_map.value == "small") boxSize = 50
  
  clearInterval(gameUpdate)
  gameUpdate = setInterval(draw, speed);
}
var inputs = document.querySelectorAll(".level-list input"), 
check = function(){
  levelCheck();
};
[].map.call(inputs, function(elem){
  elem.addEventListener("click", check, false);
});


//bestämmer vart maten ska placeras
function foodPlacement(){
  return {
    x: Math.floor(Math.random() * (canvasSize / boxSize)) * boxSize,
    y: Math.floor(Math.random() * (canvasSize / boxSize)) * boxSize,
  };
}

//själva spelet som ritas ut
function draw(){
  console.log(speed)
  //checkar vilka levels som är aktiva

  //ritar ut svarta canvas
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvasSize, canvasSize);

  //ritar ut matbitar med slumpmässiga koordinater
  ctx.fillStyle = "tomato";
  ctx.fillRect(food.x, food.y, boxSize, boxSize);

  //ritar ormen
  ctx.fillStyle = "lightgreen";
  snake.forEach((segment, index) => {
    ctx.fillRect(segment.x, segment.y, boxSize, boxSize);
  });

  if (!gameRunning) return;

  moveSnake();
}

//bestämmer spelarens rörelse
function moveSnake(){
  let head = { ...snake[0] };

  switch (direction) {
    case "UP": head.y -= boxSize; break;
    case "DOWN": head.y += boxSize; break;
    case "LEFT": head.x -= boxSize; break;
    case "RIGHT": head.x += boxSize; break;
  }

  //checka kollision med väggar
  if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize) {
    gameOver();
    reset()
    gameRunning = false;
    return;
  }

  //checkar om den äter upp matbiten
  if (head.x === food.x && head.y === food.y){
    score++;
    scoreCounter.textContent = score;
    food = foodPlacement();
  }
  else{
    snake.pop(); // Remove tail if no food eaten
  }

  snake.unshift(head); // Add new head
}

//uppdaterar och checkar när spelet ska startas och stoppas
let time;
function timer() {
  gameRunning = !gameRunning; 
  if (gameRunning){
    document.getElementById("start").textContent = "Stop (space)";
  }
  else if(!gameRunning){
    document.getElementById("start").textContent = "Start (space)";
  }
}

function gameOver() {
  gameRunning = false;
}

//startar om spelet
function reset(){
  gameRunning = true
  snake = [{ x: 250, y: 250 }];
  direction = "RIGHT";
  food = foodPlacement();
  score = 0;
  scoreCounter.textContent = score;
  gameRunning = true;
  document.getElementById("start").textContent = "start (space)";
}

//låter spelaren styra ormen
function changeDirection(event) {
  const key = event.key;
  if (key === "ArrowUp" && direction !== "DOWN" || key === "w" && direction !== "DOWN") direction = "UP";
  if (key === "ArrowDown" && direction !== "UP" || key === "s" && direction !== "UP") direction = "DOWN";
  if (key === "ArrowLeft" && direction !== "RIGHT" || key === "a" && direction !== "RIGHT") direction = "LEFT";
  if (key === "ArrowRight" && direction !== "LEFT" || key === "d" && direction !== "LEFT") direction = "RIGHT";
}
document.addEventListener("keydown", changeDirection);
let gameUpdate = setInterval(draw, speed);