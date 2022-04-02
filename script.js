/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */
     
// global constants
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence
const guessTime = 30;
//const myInterval = setInterval(updateTime, 1000);

//Global Variables
var clueHoldTime = 1000; //how long to hold each clue's light/sound
var pattern = new Array(9);//[2, 5, 9, 3, 6, 8, 1, 7, 4];
var progress = 0; 
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5;  //must be between 0.0 and 1.0
var guessCounter = 0;
var strikes = 0;
var time = guessTime;
var myInterval;

function startGame(){
  // randomize pattern
  for(let i = 0; i < pattern.length; i++)
    pattern[i] = Math.floor((Math.random() * 9) + 1);
  
  //initialize game variables
  progress = 0;
  clueHoldTime = 1000;
  strikes = 0;
  updateTries(3);
  gamePlaying = true;
  time = guessTime;
  
  // start timer
  myInterval = setInterval(updateTime, 1000);
  
  // swap the Start and Stop buttons
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");   
  playClueSequence();
}

function stopGame(){
  //initialize game variables
  gamePlaying = false;
  clearInterval(myInterval);
  // swap the Start and Stop buttons
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");    
}

function loseGame(){
  stopGame();
  alert("Game Over. You lost.");
}

function winGame(){
  stopGame();
  alert("Game Over. You win!");
}

function guess(btn){
  console.log("user guessed: " + btn);
  if(!gamePlaying){
    return;
  }
  
  // add game logic here
  if(btn == pattern[guessCounter])
  {
    if(progress == guessCounter)
    {
      if(progress == pattern.length - 1)
        winGame();
      else
      {
        progress++;
        time = guessTime;
        playClueSequence();
      }
    }
    else
      guessCounter++;
  }
  else
  {
    strikes++;
    updateTries(3-strikes);
    if(strikes >= 3)
      loseGame();
    else
      playClueSequence();
  }
}

function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit")
}

function clearButton(btn){
  document.getElementById("button"+btn).classList.remove("lit")
}

function updateTries(num){
  document.getElementById("tries").innerHTML = num;
}

function updateTime(){
  if(time <= 0)
    loseGame();
  else
    time--;
  document.getElementById("time").innerHTML = time;
}

function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}

function playClueSequence(){
  // decreases hold time with min of 100
  if(clueHoldTime > 100)
    clueHoldTime -= 100;
  
  guessCounter = 0;
  context.resume()
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    delay += clueHoldTime 
    delay += cluePauseTime;
  }
}

// Sound Synthesis Functions
const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2,
  5: 488.3,
  6: 500,
  7: 513.4,
  8: 525.1,
  9: 545.6
}
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  context.resume()
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    context.resume()
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    context.resume()
    tonePlaying = true
  }
}
function stopTone(){
  g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
  tonePlaying = false
}

// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext 
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)
