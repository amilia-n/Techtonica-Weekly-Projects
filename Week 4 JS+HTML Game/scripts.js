/****************************
 * DOM Element References
 ****************************/
const rat = document.getElementById('rat');
const gamedisplay = document.querySelector('.gamedisplay');
const currentScore = document.getElementById('current');
const totalScoreElement = document.getElementById('total');
const restartBtn = document.getElementById('restart');
const menuBtn = document.getElementById('menu');
const startScreen = document.getElementById('start-screen');
const menuPopup = document.getElementById('menu-popup');
const buyFreedomBtn = document.getElementById('buy-freedom');
const closePopupBtn = document.getElementById('close-popup');
const coin = document.getElementById('coin');

/****************************
 * Game Constants
 ****************************/
const leftGap = 17;                                     // Left margin for rat movement
const gravity = 0.8;                                    // Gravity force applied to rat
const jumpStrength = -7;                               // Upward force when jumping
const scrollThreshold = gamedisplay.offsetHeight / 2;   // Point at which camera starts scrolling
const scrollSpeed = 0.3;                               // Speed of camera scroll
const FREEDOM_COST = 1000000;                          // Cost to win the game

/****************************
 * Game State Variables
 ****************************/
let posX = leftGap;                                    // Rat's horizontal position
let posY = gamedisplay.offsetHeight - rat.offsetHeight;// Rat's vertical position
let velocityX = 0;                                     // Rat's horizontal speed
let velocityY = 0;                                     // Rat's vertical speed
let onGround = false;                                  // Whether rat is on a platform
let gameStarted = false;                               // Game state flag
let totalScore = parseInt(localStorage.getItem('totalScore')) || 0;  // Persistent total score
totalScoreElement.textContent = totalScore;
let score = 0;                                         // Current game score
let canSpawnCoin = true;                              // Coin spawn cooldown flag

/****************************
 * Element Dimensions
 ****************************/
const ratWidth = rat.offsetWidth;
const ratHeight = rat.offsetHeight;
const gamedisplayWidth = gamedisplay.offsetWidth;
const gamedisplayHeight = gamedisplay.offsetHeight;

/****************************
 * Menu and Shop Functions
 ****************************/
function updateBuyButton() {
    // Disable freedom button if player can't afford it
    buyFreedomBtn.disabled = totalScore < FREEDOM_COST;
}

/****************************
 * Coin Spawn Functions
 ****************************/
function getRandomStair() {
    // Select a random stair for coin placement
    const stairs = document.querySelectorAll('.stair');
    const randomIndex = Math.floor(Math.random() * stairs.length);
    return stairs[randomIndex];
}

function repositionCoin() {
    if (!canSpawnCoin) return;
    
    // Get random stair and position coin above it
    const randomStair = getRandomStair();
    const stairTop = randomStair.offsetTop;
    const stairLeft = randomStair.offsetLeft;
    
    // Center coin above stair
    coin.style.top = `${stairTop - coin.offsetHeight}px`;
    coin.style.left = `${stairLeft + (randomStair.offsetWidth - coin.offsetWidth) / 2}px`;
    coin.style.bottom = 'auto';
    coin.style.right = 'auto';
    
    // Implement coin spawn cooldown
    canSpawnCoin = false;
    setTimeout(() => {
        canSpawnCoin = true;
    }, Math.random() * 3000 + 2000);  // Random cooldown between 2-5 seconds
}
