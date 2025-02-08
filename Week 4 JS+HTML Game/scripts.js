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
