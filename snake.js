const board = document.querySelector('.board');
const blockheight = 30;
const blockwidth = 30;
const cols = Math.floor(board.clientWidth / blockwidth);
const rows = Math.floor(board.clientHeight / blockheight);
let food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) };
const startbutton = document.querySelector('.btn-start')
const modal = document.querySelector('.modal');
const startgamemodal = document.querySelector(".start-game");
const gameover = document.querySelector(".game-over");
const restartButton = document.querySelector(".btn-restart")
const highscoreElement = document.querySelector("#high-score");
const scoreElement = document.querySelector("#score");
const timeElement = document.querySelector("#Time");

let highscore = 0;
let score = 0;
let time = '00:00';

const blocks = [];
let snaks = [{
    x: 1, y: 3
}]

let direction = 'down'
for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        const block = document.createElement('div');
        block.classList.add('block');
        board.appendChild(block);
        blocks[`${row}-${col}`] = block;

    }
}

function render() {
    let head = null;
    blocks[`${food.x}-${food.y}`].classList.add('food')
    if (direction === 'left') {
        head = { x: snaks[0].x, y: snaks[0].y - 1 };
    }
    else if (direction === 'right') {
        head = { x: snaks[0].x, y: snaks[0].y + 1 };
    }
    else if (direction === 'down') {
        head = { x: snaks[0].x + 1, y: snaks[0].y };
    }
    else if (direction === 'up') {
        head = { x: snaks[0].x - 1, y: snaks[0].y };
    }
    // Check if head overlaps with any body segment
    const hitBody = snaks.some(seg => seg.x === head.x && seg.y === head.y);

    if (hitBody) {
        clearInterval(intervalId);
        clearInterval(timerid);

        modal.style.display = "flex";
        startgamemodal.style.display = "none";
        gameover.style.display = "flex";

        return;
    }

    if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
        clearInterval(intervalId);
        blocks[`${food.x}-${food.y}`].classList.remove('food');
        modal.style.display = "flex";
        startgamemodal.style.display = "none"
        gameover.style.display = "flex"
        score = 0;
        time = '00:00';
        timeElement.innerText = time
        scoreElement.innerText = score;
        return;
    }
    if (head.x == food.x && head.y == food.y) {
        blocks[`${food.x}-${food.y}`].classList.remove('food');
        food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) };
        blocks[`${food.x}-${food.y}`].classList.add('food');
        snaks.unshift(head);
        score += 1;
        scoreElement.innerText = score;
        if (score > highscore) {
            highscore = score;
            localStorage.setItem("highscore", highscore.toString());
            highscoreElement.innerText = highscore;
        }
    }
    snaks.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
    })
    snaks.unshift(head);
    snaks.pop();


    snaks.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.add("fill");
    })
}
let intervalId = null;
let timerid = null;

startbutton.addEventListener("click", () => {
    modal.style.display = "none";
    intervalId = setInterval(() => { render(); }, 100);
    timerid = setInterval(() => {
        let [min, sec] = time.split(":").map(Number);
        if (sec == 59) {
            min += 1;
            sec = 0
        }
        else {
            sec += 1;
        }
        time = `${min}:${sec}`
        timeElement.innerText = time

    }, 1000)
})

addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp" && direction !== "down") {
        direction = "up";
    }
    else if (event.key === "ArrowDown" && direction !== "up") {
        direction = "down";
    }
    else if (event.key === "ArrowLeft" && direction !== "right") {
        direction = "left";
    }
    else if (event.key === "ArrowRight" && direction !== "left") {
        direction = "right";
    }
});
restartButton.addEventListener("click", restartgame);
function restartgame() {
    modal.style.display = "none";
    direction = "down";
    blocks[`${food.x}-${food.y}`].classList.remove('food');
    snaks.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
    })
    snaks = [{ x: 1, y: 3 }]
    food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) };
    intervalId = setInterval(() => { render(); }, 100);
}

// Animation
var tl = gsap.timeline()
tl.from("modal", {
    opacity: 0,
    y: -30,
    duration: 1,
    delay: .5,
})

gsap.from(".modal .start-game h3", {
    opacity: 0,
    y: -400,
    duration: 2,
    delay: 1
})
