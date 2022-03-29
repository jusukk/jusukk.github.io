// FIREBASE
// -------------------------------------------------------------------------------------------------------
// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDtb30gX0-lWXuvRK463IFrsN2IkiSW86Q",
    authDomain: "gamescores-270d4.firebaseapp.com",
    databaseURL: "https://gamescores-270d4-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "gamescores-270d4",
    storageBucket: "gamescores-270d4.appspot.com",
    messagingSenderId: "573708873442",
    appId: "1:573708873442:web:da32ddc684d6e45cb538bb"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const dbRef = db.ref("scores");

let dataScores = [];
let dataTop5 = [];
let dataValues = [];
let dataCounts = [];
let dataMovingAverage = [];

// Check for data
dbRef.on("value", (snapshot) => {
    if (snapshot.exists()) {
        // Clear old data
        dataScores = [];
        dataTop5 = [];
        dataValues = [];
        dataCounts = [];
        dataMovingAverage = [];

        // Push new data
        dataScores = dataToArray(snapshot);

        // Remove dublicates, sort by highest, cut to 5 elements
        dataTop5 = [...new Set(dataScores)].sort((a, b) => b - a);
        dataTop5 = dataTop5.slice(0,5);

        // Count same elements
        dataScores.forEach(function (x) { dataValues[x] = (dataValues[x] || 0) + 1; });
        // Set empty elements to zero
        dataValues = Array.from(dataValues, item => item || 0);
        
        // Count data amount
        dataCounts = Array.from(Array(dataValues.length).keys())

        // Averages
        dataMovingAverage = movingAverage(dataValues);
        
        createCharts();
    }
    else console.log("No data");
});

// Push data values to array
function dataToArray(snapshot) {
    var array = [];
    snapshot.forEach((childSnapshot) => {
        var data = childSnapshot.val();
        array.push(data);
    });
    return array;
}

// Calculate moving averages points from array
function movingAverage(arr) {
    var window = 5;
    var averages = [];
    // If array exist & and has enough elements
    if (!arr || arr.length < window) return [];

    for (let i = 0; i < arr.length; i++) {
        var windowSlice = arr.slice(i, window + i);
        averages.push(windowSlice.reduce((total, num) => total + num) / windowSlice.length)
    }
    return averages;
}

// Calculate average from array
function average(arr) {
    var total = 0;
    for(let value of arr) total += value;
    return Math.round((total / arr.length)*10)/10;
}

// CHARTS
// -------------------------------------------------------------------------------------------------------
const canvasChartTop5 = document.getElementById("chart1");
const ctxChartTop5 = canvasChartTop5.getContext("2d");
let chartTop5 = null;

const canvasChartAvarage = document.getElementById("chart2");
const ctxChartAvarage = canvasChartAvarage.getContext("2d");
let chartAvarage = null;

Chart.register(ChartDataLabels);
Chart.defaults.font.size = 16;
Chart.defaults.color = "#b7b7b7";

function createChartTop5() {
    chartTop5 = new Chart(ctxChartTop5, {
        type: "bar",
        data: {
            labels: [1,2,3,4,5],
            datasets: [{
                label: "Top 5",
                data: dataTop5,
                backgroundColor: [
                    "rgba(240, 219, 65, 0.9)",
                ],
                borderColor: [
                    "rgba(240, 219, 65, 0.9)",
                ],
                datalabels: {
                    align: "end",
                    anchor: "end"
                }
            }]
        },
        options: {
            plugins: {
                tooltip: {
                    enabled: false,
                },
                legend: {
                    labels: {
                        boxWidth: 0,
                        padding: 15, 
                        color: "white",
                        font: {
                            size: 18,
                        }
                    }
                },
                datalabels: {
                    color: "white",
                    font: {
                        weight: "bold"
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    grid: {
                        display:false,
                    },
                    ticks: {
                        color: "rgb(180,180,180)"
                    },
                    beginAtZero: true
                },
                y: {
                    grid: {
                        color: "rgb(80,80,80)",
                        drawBorder:false
                    },
                    ticks: {
                        color: "rgb(180,180,180)",
                        padding: 5
                    },
                    beginAtZero: true
                }
            },
            hover: {
                mode: null
            }
        }
    });
}

function createChartAverage() {
    chartAvarage = new Chart(ctxChartAvarage, {
        type: "bar",
        data: {
            labels: dataCounts,
            datasets: [
                {
                    label: "Score Distribution: " + dataScores.length,
                    data: dataValues,
                    backgroundColor: "#4156f0",
                    borderColor: "#4156f0",
                    datalabels: {
                        display: false,
                        align: "end",
                        anchor: "end"
                    },
                    order: 1
                },
                {
                    label: "Average: " + average(dataScores),
                    data: dataMovingAverage,
                    backgroundColor: "#F04156",
                    borderColor: "#F04156",
                    datalabels: {
                        display: false,
                        align: "end",
                        anchor: "end"
                    },
                    type: 'line',
                    tension: 0.3,
                    pointRadius: 0,
                    order: 0
                }
            ]
        },
        options: {
            plugins: {
                legend: {
                    labels: {
                        boxWidth: 20,
                        padding: 15, 
                        color: "white",
                        font: {
                            size: 18,
                        }
                    }
                },
                datalabels: {
                    color: "white",
                    font: {
                        weight: "bold"
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    grid: {
                        display:false,
                    },
                    ticks: {
                        color: "rgb(180,180,180)"
                    },
                    beginAtZero: true
                },
                y: {
                    grid: {
                        color: "rgb(80,80,80)",
                        drawBorder:false
                    },
                    ticks: {
                        color: "rgb(180,180,180)",
                        padding: 5
                    },
                    beginAtZero: true
                }
            },
        }
    });
}

// Create charts. If chart already exist, reset it
function createCharts() {
    if (chartTop5 != null || chartAvarage != null) {
        chartTop5.destroy();
        chartAvarage.destroy();
        createChartTop5();
        createChartAverage();
    }
    else {
        createChartTop5();
        createChartAverage();
    } 
}
// If resize, reset charts
window.addEventListener("resize", createCharts);

// GAME
// -------------------------------------------------------------------------------------------------------
const canvasGame = document.getElementById("game");
const ctx = canvasGame.getContext("2d");
let H = canvasGame.height = canvasGame.clientHeight;
let W = canvasGame.width = canvasGame.clientWidth;

const gameColor = "white";
const playerColor = "#F0DB41";

// 0=Start menu, 1=Game, 2=Game over
let gameState = 0;

// Send score to database trigger
let writeScoreTrigger = false;

let keySpace = false;
let keyR = false;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    event.preventDefault();
    // Space
    if(e.keyCode == 32) {
        keySpace = true;    
    }
    // R
    if(e.keyCode == 82) {
        keyR = true;    
    }
} 
function keyUpHandler(e) {
    event.preventDefault();
    // Space
    if(e.keyCode == 32) {
        keySpace = false;
    }
    // R
    if(e.keyCode == 82) {
        keyR = false;
    }
}

function startMenu() {
    draw();
    ctx.font = "20px Arial";
    ctx.fillStyle = gameColor;
    ctx.textAlign = "center"; 
    ctx.fillText("Press SPACE to start", W/2, H/2);
}

function gameOverMenu() {
    draw();
    ctx.font = "30px Arial";
    ctx.fillStyle = gameColor;
    ctx.textAlign = "center"; 
    ctx.fillText("Game Over", W/2, H/2 - 40);
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, W/2, H/2 );
    ctx.fillText("Press R to restart", W/2, H/2 + 40);
}

var score = 0;
function updateScore() {
    ctx.font = "18px Arial";
    ctx.fillStyle = gameColor;
    ctx.fillText("Score: " + score, W * 0.02, 30);
}
// Reset canvas & values
function restart() {
    player.y = H - player.radius - 1;
    obstacleDown.x = W + obstacleDown.width*2;
    obstacleDown.dx = W / 165;
    particles = [];
    score = 0;
    gameState = 1;
    // Reset trigger
    writeScoreTrigger = false;
}

// If resize, restart canvas and values
window.addEventListener("resize", resize);
function resize() {
    ctx.clearRect(0, 0, W, H);
    restart();
    score = 0;
    gameState = 0;
    // Reset trigger
    writeScoreTrigger = false;
}

// Draw static objects 
function draw() {
    // Top line 
    ctx.lineWidth = 4; 
    ctx.strokeStyle = gameColor;
    ctx.moveTo(0, 0);
    ctx.lineTo(W, 0);
    ctx.stroke();
    // Bottom line
    ctx.lineWidth = 4;
    ctx.strokeStyle = gameColor;
    ctx.moveTo(0, H);
    ctx.lineTo(W, H);
    ctx.stroke();
} 

class Player {
    constructor() {
        this.radius = 12.5;
        this.x = W * 0.2;
        this.y = H - this.radius - 1;
        this.dy = 0;
        this.gravity = 0.2;
        this.gravitySpeed = 0;
        this.isGrounded = false;                                                                
    }
    draw() {
        ctx.shadowColor = playerColor;
        ctx.shadowBlur = 16;
        ctx.fillStyle = playerColor;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
    }
    move() {
        this.gravitySpeed += this.gravity;
        this.y += this.dy + this.gravitySpeed;
        this.borders();
        // Jump
        if (keySpace) this.gravity = -0.6;
        else this.gravity = 0.2;
    }
    borders() {                                       
        var ground = H-this.radius;
        var roof = this.radius;
        if (this.y > ground) {
            this.y = ground;
            this.gravitySpeed = 0;
        }
        if (this.y < roof) {
            this.y = roof;
            this.gravitySpeed = 0;
        }
    }
    // Check for collisions. If position borders are same with collision object -> hit
    collision (col) {
        var offset = -1
        var myleft = this.x + offset;
        var myright = this.x + this.radius + offset;
        var mytop = this.y + offset;
        var mybottom = this.y + this.radius + offset;
        var colleft = col.x;
        var colright = col.x + col.width;
        var coltop = col.y;
        var colbottom = col.y + col.height;
        
        var hit = true;
        if (mybottom < coltop || mytop > colbottom || myright < colleft || myleft > colright) hit = false;
        return hit;
    }   
}

class Obstacle {
    constructor (bool, height, y) {
        this.isBottom = bool;
        this.width = 15;
        this.gap = 140;
        this.height = height;
        this.x = W + this.width * 2;
        this.y = y;
        // Speed based on canvas width
        this.dx = W / 165

        this.draw = function () {
            ctx.shadowBlur = 0;
            ctx.fillStyle = gameColor;
            // Bottom
            if(bool) ctx.fillRect(this.x ,this.y, this.width, this.height);
            // Top
            else ctx.fillRect(this.x ,0, this.width, this.height);
        };
    }
}

var particles = [];
class Particle {
    constructor () {
        this.life = true;
        this.radius = player.radius;
        this.vRadius = 0;
        this.x = player.x;
        this.y = player.y;
        this.vy = getRandom(-1, 1);
        this.vx = getRandom(-3, -2.5);
        this.color = playerColor;
    }
    move() { 
        this.x += this.vx;
        this.vRadius = 1;
        if (this.radius > 1) this.radius -= this.vRadius;
        if (this.radius <= 1) this.life = false;       
    }
    draw() {
        ctx.shadowColor = playerColor;
        ctx.shadowBlur = 8;
        ctx.beginPath();    
        ctx.arc( this.x, this.y, this.radius, 0, 2 * Math.PI );
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

let player = new Player();
let startHeight = getRandom(40,140);
let obstacleDown = new Obstacle(true, startHeight, H - startHeight);
let obstacleTop = new Obstacle(false, H - startHeight - obstacleDown.gap, 0);

// Move top and down obstacles
function updateObstacles(down, top) { 
    down.x -= down.dx;
    top.x = down.x;
    // If is over left border
    if (down.x < -down.width*2) {
        down.dx += 0.2;
        var randomHeight = getRandom(40,140);
        down.height = randomHeight;
        down.y = H - randomHeight; 
        top.height = H - randomHeight - top.gap;
        score ++;
        down.x = W + down.width*2;
    }    
    // Draw obstacles
    top.draw();
    down.draw();
}

function updateParticles() {
    // Move
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].move();
        // If particle is dead, remove it        
        if( !particles[i].life) particles.splice( i, 1 );
    }
    if (particles.length < 20) particles.push(new Particle());
    // Draw 
    for (let i = particles.length - 1; i >= 0; i--) {   
        particles[i].draw();
    }     
}

// Render canvas loop
function render() {
    ctx.clearRect(0, 0, W, H);
    H = canvasGame.height = canvasGame.clientHeight;
    W = canvasGame.width = canvasGame.clientWidth;
    // Start menu
    if (gameState == 0) {
        startMenu();
        if (keySpace) gameState = 1;
    }
    // Game
    else if (gameState == 1) {
        if (player.collision(obstacleDown) || player.collision(obstacleTop)) {
            gameState = 2;
        }     
        draw();     
        player.move();
        player.draw();
        updateParticles();
        updateObstacles(obstacleDown, obstacleTop);
        updateScore();
    } 
    // Game over
    else if (gameState == 2) { 
        gameOverMenu();
        // Send score to database only once
        if (!writeScoreTrigger) {
            dbRef.push(score);
            writeScoreTrigger = true;
        }
        if (!keySpace && keyR) restart();
    }
    window.requestAnimationFrame(render);      
}    
window.requestAnimationFrame(render);
  
// Return random float between min & max
function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}