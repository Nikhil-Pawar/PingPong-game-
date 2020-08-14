// select canvas element
const canvas = document.getElementById("pong");

// getContext of canvas = methods and properties to draw and do a lot of thing to the canvas
const ctx = canvas.getContext('2d');



// Ball object
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speedX: 2,
    speedY: 2,
    speed: 5,
    color: "WHITE"
}

// User Paddle
const user = {
    x: 0, // left side of canvas
    y: (canvas.height - 100) / 2, // -100 the height of paddle
    width: 10,
    height: 100,
    score: 0,
    color: "#fcf72a"
}

// user2 Paddle
const user2 = {
    x: canvas.width - 10, // - width of paddle
    y: (canvas.height - 100) / 2, // -100 the height of paddle
    width: 10,
    height: 100,
    score: 0,
    color: "#85843f"
}

// NET
const net = {
    x: (canvas.width - 2) / 2,
    y: 0,
    height: 10,
    width: 2,
    color: "#e0dfbc"
}

// draw a rectangle, will be used to draw paddles
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

// draw circle, will be used to draw the ball
function drawArc(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
}

// listening to the keys for user1 movement
document.addEventListener("keypress", () => {
    
    let rect = canvas.getBoundingClientRect();
    let base = user.y + user.height / 2
    
    if (event.key == 's' && base <= 350) {
        user.y += 100;
    }
    if (event.key == 'w' && base >= 50) {
        user.y -= 100;
    }

})

//listening to the keys for user2 movement
document.addEventListener("keypress", () => {
    
    let rect = canvas.getBoundingClientRect();
    let base = user2.y + user2.height / 2
    
    if (event.key == '2' && base <= 350) {
        user2.y += 100;
    }
    if (event.key == '5' && base >= 50) {
        user2.y -= 100;
    }


})

function getMousePos(event) {
    let rect = canvas.getBoundingClientRect();
    user.y = event.clientY - rect.top - user.height / 2;
}

// when user2 or USER scores, we reset the ball
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;

    if (ball.speed > 17 || ball.speed < -17) {
        ball.speed = ball.speed < 0 ? -7 : 7;
    } else {
        ball.speed = ball.speed < 0 ? ball.speed - 2 : ball.speed + 2;
    }
    ball.speedX = -ball.speedX;

}

// draw the net
function drawNet() {
    for (let i = 0; i <= canvas.height; i += 15) {
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

// draw text
function drawText(text, x, y) {
    ctx.fillStyle = "#FFF";
    ctx.font = "75px fantasy";
    ctx.fillText(text, x, y);
}

// collision detection
function collision(b, p) {
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}

// update function, the function that does all calculations
function update() {

    // change the score of players, if the ball goes to the left "ball.x<0" user2puter win, else if "ball.x > canvas.width" the user win
    if (ball.x - ball.radius < 0) {
        user2.score++;

        resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
        user.score++;

        resetBall();
    }

    // the ball has a velocity
    ball.x += ball.speedX;
    ball.y += ball.speedY;


    // user2.y += ((ball.y - (user2.y + user2.height/2)))*0.1;

    // when the ball collides with bottom and top walls we inverse the y velocity.
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.speedY
            = -ball.speedY
            ;

    }

    // we check if the paddle hit the user or the user2 paddle
    let player = (ball.x + ball.radius < canvas.width / 2) ? user : user2;

    // if the ball hits a paddle
    if (collision(ball, player)) {

        // we check where the ball hits the paddle
        let collidePoint = (ball.y - (player.y + player.height / 2));
        // normalize the value of collidePoint, we need to get numbers between -1 and 1.
        // -player.height/2 < collide Point < player.height/2
        collidePoint = collidePoint / (player.height / 2);

        // when the ball hits the top of a paddle we want the ball, to take a -45degees angle
        // when the ball hits the center of the paddle we want the ball to take a 0degrees angle
        // when the ball hits the bottom of the paddle we want the ball to take a 45degrees
        // Math.PI/4 = 45degrees
        let angleRad = (Math.PI / 4) * collidePoint;

        // change the X and Y velocity direction
        let direction = (ball.x + ball.radius < canvas.width / 2) ? 1 : -1;
        ball.speedX
            = direction * ball.speed * Math.cos(angleRad);
        ball.speedY
            = ball.speed * Math.sin(angleRad);

        // speed up the ball everytime a paddle hits it.
        ball.speed += 0.1;
    }
}

// render function, the function that does al the drawing
function render() {

    // clear the canvas
    drawRect(0, 0, canvas.width, canvas.height, "#282713");

    // draw the user score to the left
    drawText(user.score, canvas.width / 4, canvas.height / 5);

    // draw the user2 score to the right
    drawText(user2.score, 3 * canvas.width / 4, canvas.height / 5);

    // draw the net
    drawNet();

    // draw the user's paddle
    drawRect(user.x, user.y, user.width, user.height, user.color);

    // draw the user2's paddle
    drawRect(user2.x, user2.y, user2.width, user2.height, user2.color);

    // draw the ball
    drawArc(ball.x, ball.y, ball.radius, ball.color);
}
function game() {
    update();
    render();
    if (user.score > 10 || user2.score > 10) {
        ball.speed = 0;
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        document.getElementById('head').style.display = "inline-block";
        var result = user.score > 10 ? 'Left User' : 'Right User';
        result = result.concat(" Wins")
        document.getElementById('head').innerHTML = result;
    }

}

// number of frames per second
let framePerSecond = 50;

//call the game function 50 times every 1 Sec
let loop = setInterval(game, 1000 / framePerSecond);

document.getElementById("stop").addEventListener("click", () => {
    clearInterval(loop)
})

document.getElementById("start").addEventListener("click", () => {
    user.score = 0;
    user2.score = 0;
    ball.speed=7;
    user.y=canvas.height/2-50;
    user2.y=canvas.height/2-50;
    loop = setInterval(game, 1000 / framePerSecond);

})


