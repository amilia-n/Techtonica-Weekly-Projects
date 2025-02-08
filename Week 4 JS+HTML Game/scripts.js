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

/****************************
 * Game Initialization and State Management
 ****************************/
function initGame() {
    // Reset game state
    score = 0;
    currentScore.textContent = score;
    posX = leftGap;
    posY = gamedisplayHeight - ratHeight;
    velocityX = 0;
    velocityY = 0;
    onGround = false;
    
    // Reset rat position
    rat.style.left = `${posX}px`;
    rat.style.top = `${posY}px`;
    
    // Reset stairs to original positions
    const stairs = document.querySelectorAll('.stair');
    stairs.forEach((stair) => {
        stair.style.top = '';
    });
    
    repositionCoin();
}

function startGame() {
    if (!gameStarted) {
        gameStarted = true;
        startScreen.classList.add('hidden');
        initGame();
        requestAnimationFrame(updateRat);
    }
}

/****************************
 * Main Game Loop
 ****************************/
function updateRat() {
    if (!gameStarted) return;

    // Apply Physics
    let prevPosY = posY;
    velocityY += gravity;
    posX += velocityX;
    posY += velocityY;

    // Boundary Checks
    if (posX < leftGap) posX = leftGap;
    if (posX + ratWidth > gamedisplayWidth) posX = gamedisplayWidth - ratWidth;
    if (posY < 0) posY = 0;
    if (posY + ratHeight > gamedisplayHeight) {
        posY = gamedisplayHeight - ratHeight;
        velocityY = 0;
        onGround = true;
    } else {
        onGround = false;
    }

    // Collision Detection with Stairs
    const stairs = document.querySelectorAll('.stair');
    for (let i = 0; i < stairs.length; i++) {
        let stair = stairs[i];
        let stairTop = stair.offsetTop;
        let stairLeft = stair.offsetLeft + leftGap;
        let stairRight = stairLeft + stair.offsetWidth;

        // Check if rat is landing on stair
        if (prevPosY + ratHeight <= stairTop &&
            posY + ratHeight >= stairTop &&
            posX + ratWidth > stairLeft &&
            posX < stairRight &&
            velocityY > 0) {
            
            // Edge detection for stairs
            let edgeMargin = 5;
            if (posX + ratWidth - stairLeft < edgeMargin ||
                stairRight - posX < edgeMargin) {
                velocityY = gravity;
                onGround = false;
            } else {
                posY = stairTop - ratHeight;
                velocityY = 0;
                onGround = true;
            }
        }
    }

    // Coin Collection Logic
    const coinRect = coin.getBoundingClientRect();
    const ratRect = rat.getBoundingClientRect();

    if (ratRect.left < coinRect.right &&
        ratRect.right > coinRect.left &&
        ratRect.top < coinRect.bottom &&
        ratRect.bottom > coinRect.top) {
        
        // Update scores
        score++;
        totalScore++;
        currentScore.textContent = score;
        totalScoreElement.textContent = totalScore;
        localStorage.setItem('totalScore', totalScore);
        updateBuyButton();
        
        // Hide coin and set respawn timer
        coin.style.display = 'none';
        setTimeout(() => {
            if (Math.random() > 0.5) {  // 50% chance to spawn
                coin.style.display = 'block';
                repositionCoin();
            }
        }, Math.random() * 3000 + 2000);
    }

    // Camera Scroll Logic
    if (posY < scrollThreshold) {
        let scrollAmount = (scrollThreshold - posY) * scrollSpeed;
        posY += scrollAmount;

        // Update stair positions
        stairs.forEach((stair, index) => {
            stair.style.top = `${stair.offsetTop + scrollAmount}px`;

            // Recycle stairs that go off screen
            if (index === 1 && stair.offsetTop >= stairs[23].offsetTop) {
                let stair25 = stairs[24];
                let stair1 = stairs[0];
                stairs[24] = stairs[0];
                stair25.style.top = stair1.style.top;
                stair25.style.right = stair1.style.right;
            }

            if (stair.offsetTop > gamedisplayHeight) {
                stair.style.top = `-${stair.offsetHeight}px`;
            }
        });

        // Update coin position with scroll
        if (coin.style.display !== 'none') {
            coin.style.top = `${parseFloat(coin.style.top) + scrollAmount}px`;
        }
    }

    // Update Rat Position
    rat.style.left = `${posX}px`;
    rat.style.top = `${posY}px`;

    requestAnimationFrame(updateRat);
}
