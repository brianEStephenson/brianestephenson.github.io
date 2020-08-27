// this will be the JS file for the morse code page
//
// basic unit: dot
// dash-length: 3xdot
// char-space: 3xdot
// word-space: 7xdot

// check if the device has touch capability
var hasTouch = 'ontouchstart' in window || 'onmsgesturechange' in window;

var word;
var morseWord;
var bArry;
var pos = 0;

var lvlSlider = document.getElementById('lvl-slider');
var hintDisplay = document.getElementById('msg-hint');
var inBox = document.getElementById('text-in');
var blinker = document.getElementById('blinker');

var level = 0;
var wpm = 1;
var farnsworth = 1;
var baseT = 1200;	// [milliseconds]
var rxIntID = 0;

// a text to morse dictionary object.
var morseDict = {
	a: ".-", b: "-...", c: "-.-.", d: "-..", e: ".", f: "..-.",
	g: "--.", h: "....", i: "..", j: ".---", k: "-.-", l: ".-..",
	m: "--", n: "-.", o: "---", p: ".--.", q: "--.-", r: ".-.",
	s: '...', t: '-', u: '..-', v: '...-', w: '.--', x: '-..-',
	y: '-.--', z: '--..',
	1: '.----', 2: '..---', 3: '...--', 4: '....-', 5: '.....',
	6: '-....', 7: '--...', 8: '---..', 9: '----.', 0: '-----'
};

var wordList0 = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
var wordList4 = ['apple', 'banana', 'closet', 'example', 'mango', 'python', 'river'];
var bWords = ['beats', 'bistro', "bombs", "boxes", "break", "brick", "flick", "halls", "leaks", "shell", "slick", "strobe", "steak", "sting", "trick", "vector"]; 


function textToMorse(text){
	var morseText = morseDict[text[0]];
	for(i = 1; i < text.length; i++){
		morseText += ' ' + morseDict[text[i]];
	}
	return morseText;
}

let morseToOnOff = mWord => {
	onOff = [];
	for(let i = 0; i < mWord.length; i++){
		if(mWord[i] == '.'){ onOff.push(1,0) }	// if a .: 10
		else if(mWord[i] == '-'){ onOff.push(1,1,1,0) } // if a -: 1110
		else if(mWord[i] == ' '){ onOff.push(0,0)}	// if a ' ': 00
	}
	onOff.push(0,0,0,0,0,0);
	return onOff
}

function setWord(){
	switch(Number(level)){
		case 5:
			word = bWords[Math.floor(Math.random()*bWords.length)];
			break;
		case 4:
			word = wordList4[Math.floor(Math.random()*wordList4.length)];
			break;
		default:
			word = wordList0[Math.floor(Math.random()*wordList0.length)];
	}
	if(hasTouch){
		setOptions();
		var buttons = document.getElementsByClassName('button');
		buttons[Math.floor(Math.random()*buttons.length)].innerHTML = word;
	}
	morseWord = textToMorse(word);
	hintDisplay.innerText = morseWord;
	document.getElementById('answer').innerHTML = '';	
	inBox.value = '';
	document.getElementById('prompt').innerHTML = '';
	bArry = morseToOnOff(morseWord);
}

function setOptions(){
	var wordDict = [];
	switch(Number(level)){
		case 5:
			wordDict = bWords;
			break;
		case 4:
			wordDict = wordList4;
			break;
		default:
			wordDict = wordList0;
	}
	var buttons = document.getElementsByClassName('button');
	for (var i=0; i < buttons.length; i++){
		buttons[i].innerHTML = wordDict[Math.floor(Math.random()*wordDict.length)];
		// need to remove the used 'word' so that it doesnt appear twice.
	}
}

function toggleAudio(){
	if(document.getElementById('toggle-audio').checked){
		document.getElementById('audio-sym').classList.add('audio-on');
	}else{
		document.getElementById('audio-sym').classList.remove('audio-on');
	}		
}

function toggleHint(){
	var hintTog = document.getElementById('toggle-text');
	hintDisplay.style.display = (hintTog.checked) ? "inline" : "none";
	console.log('toggle Hint display');
}

function checkAnswer(){
	inBox.value = inBox.value.slice(0,-1).toLowerCase();
	document.getElementById('prompt').innerHTML = (inBox.value === word) ? 'Correct!! :)' : 'No... Try again.';
}
function checkWord(it){
	document.getElementById('prompt').innerHTML = (it.innerHTML === word) ? 'Correct!! :)' : 'No... Try again.';
}
function updateLvl(){
	level = lvlSlider.value;
	document.getElementById('lvl-disp').innerHTML = level;
	console.log('level now: '+level);
}

function updateWPM(){
	wpm = document.getElementById('wpm-slider').value;
	document.getElementById('wpm-disp').innerHTML = wpm;
	baseT = 1200/Number(wpm);
	clearInterval(rxIntID);
	rxIntID = setInterval(rxMorse, baseT);
	console.log('speed now: '+wpm);
}

function updateFwth(){
	farnsworth = document.getElementById('Farnsworth-slider').value;
	document.getElementById('fwth-disp').innerHTML = farnsworth;
	console.log('Farnsworth now: '+farnsworth);
}

function showAnswer(){
	document.getElementById('answer').innerHTML = word;	
}

function rxMorse(){
	if(bArry[pos]){	
		//beep();
		blinker.style.background = 'red'
	}	else {			blinker.style.background = 'black';	}
	pos = (pos >= bArry.length) ? 0 : pos + 1;
}

inBox.addEventListener('keyup', function(event){
	if(event.keyCode === 13){
		event.preventDefault();
		checkAnswer();
	}
});

if(hasTouch){ // if the device has touch, swap keyboard/textarea for buttons
	var elsNoTouch = document.getElementsByClassName('ntouch');
	for(var i=0; i<elsNoTouch.length; i++){
		elsNoTouch[i].style.display = 'none';
	}
	var elsTouch = document.getElementsByClassName('touch');
	for(var i=0; i< elsTouch.length; i++){
		elsTouch[i].style.display = 'block';
	}
	setOptions();
}

updateLvl();
updateWPM();
updateFwth();
setWord();

var uagent = navigator.userAgent;
document.getElementById('uagent-info').innerHTML = uagent;
document.getElementById('touch-info').innerHTML = hasTouch;

