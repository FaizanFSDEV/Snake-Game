let snakeSpeed = 4, //how many time snake move per second
    lastRenderTime = 0;

const snakeBody = [{ x: 10, y: 11}]

let inputDirection = { x: 0, y: 0}
let lastInputDirection = { x: 0, y: 0}

const gridSize = 21

let food = getRandomFoodPosition()
let newSegment = 0

const expansionRate = 1

let gameOver = false


const foodSound = new Audio('music/food.mp3'),
      gameOverSound = new Audio('music/gameover.mp3'),
      moveSound = new Audio('music/move.mp3'),
      musicSound = new Audio('music/music.mp3');

const gameBoard = document.querySelector('#game-board')

// Main Game Function

function main(currentTime){

    if(gameOver){
      gameOverSound.play()
      if(confirm('You Lost. Press OK to restart')){
        location.reload()
      }
      return
    }

    window.requestAnimationFrame(main);
    const secSinceLastRender = (currentTime - lastRenderTime) / 1000;
    if(secSinceLastRender < 1/snakeSpeed) return
    lastRenderTime = currentTime

    update()
    updateFood()
    checkDeath()
    draw()
    drawFood()
}

// main logic

window.requestAnimationFrame(main);


// FUNCTION RELATED TO UPDATE SNAKE FOOD

function addSegment(){
  for(let i = 0; i < newSegment; i++){
    snakeBody.push({...snakeBody[snakeBody.length - 1]})
  }
  newSegment = 0
}

function equalPosition(post1,post2){
 return post1.x === post2.x && post1.y === post2.y
}

function expandSnake(rate){
 newSegment += rate
}

function onSnake(position, {ignoreHead = false} = {}){
  return snakeBody.some((segment, index) => {
    if(ignoreHead && index === 0) return false
    return equalPosition(segment, position)
  })
}

function updateFood(){
 if(onSnake(food)){
   expandSnake(expansionRate)
   food = getRandomFoodPosition()
 }
}

// FUNCTION RELATED TO DRAW SNAKE FOOD

function randomGridPosition(){
  return {
    x: Math.floor(Math.random() * gridSize) + 1,
    y: Math.floor(Math.random() * gridSize) + 1,
  }
}

function getRandomFoodPosition(){
  let newFoodPosition
  while (newFoodPosition == null || onSnake(newFoodPosition)){
    newFoodPosition = randomGridPosition()
  }
  return newFoodPosition
}

function drawFood(){
    const foodElement = document.createElement('div')
    foodElement.style.gridRowStart = food.y
    foodElement.style.gridColumnStart = food.x
    foodElement.classList.add('food')
    gameBoard.appendChild(foodElement)
}

// FUNCTION RELATED TO GIVE DIRECTION 

window.addEventListener('keydown', (e) => {
  moveSound.play()
  switch (e.key){
    case 'ArrowUp':
      if(lastInputDirection.y !== 0) break
      inputDirection = { x: 0, y: -1 }
      break
    case 'ArrowDown':
      if(lastInputDirection.y !== 0) break
      inputDirection = { x: 0, y: 1 }
      break
    case 'ArrowLeft':
      if(lastInputDirection.x !== 0) break
      inputDirection = { x: -1, y: 0 }
      break
    case 'ArrowRight':
      if(lastInputDirection.x !== 0) break
      inputDirection = { x: 1, y: 0 }
      break
  }
})

function getInputDirection(){
  lastInputDirection = inputDirection
  return inputDirection
}

// FUNCTION UPDATE SNAKE

function update(){

    addSegment()

    const inputDirection = getInputDirection()
    for(let i = snakeBody.length - 2; i >= 0; i--){
      snakeBody[i + 1] = { ...snakeBody[i]}
    }

    snakeBody[0].x += inputDirection.x
    snakeBody[0].y += inputDirection.y
}

// FUNCTION DRAW DISPLAY SNAKE

function draw(){

  gameBoard.textContent = ''

  snakeBody.forEach((segment) => {
    const snakeElement = document.createElement('div')
    snakeElement.style.gridRowStart = segment.y
    snakeElement.style.gridColumnStart = segment.x
    snakeElement.classList.add('snake')
    gameBoard.appendChild(snakeElement)
    
  })
}

// CHECK DEATH

function outsideGrid(position){
  return (
    position.x < 1 || position.x > gridSize ||
    position.y < 1 || position.y > gridSize
  )
}

function getSnakeHead(){
  return snakeBody[0]
}

function snakeIntersection(){
  return onSnake(snakeBody[0], {ignoreHead: true})
}

function checkDeath(){
  gameOver = outsideGrid(getSnakeHead()) || snakeIntersection()
}
