var humidity = document.querySelector('.humidity');
var temperature = document.querySelector('.temperature');
var light = document.querySelector('.light');
var lastWatered = document.querySelector('.lastWatered');

var changeSetting = document.querySelector('.changeSetting');
var minHumid = document.querySelector('.minHumid');
var maxHumid = document.querySelector('.maxHumid');
var minTemp = document.querySelector('.minTemp');
var maxTemp = document.querySelector('.maxTemp');
var minLight = document.querySelector('.minLight');
var maxLight = document.querySelector('.maxLight');

changeSetting.addEventListener('click', setValues);

function setValues() {
	var minH = minHumid.value;
	var maxH = maxHumid.value;
	var minT = minTemp.value;
	var maxT = maxTemp.value;
	var minL = minLight.value;
	var maxL = maxLight.value;
	
	localStorage.setItem('minHumid', minH);
	localStorage.setItem('maxHumid', maxH);
	localStorage.setItem('minTemp', minT);
	localStorage.setItem('maxTemp', maxT);
	localStorage.setItem('minLight', minL);
	localStorage.setItem('maxLight', maxL);
	
	alert('Preference has been changed to:\n' + 
		'Humidity: ' + minH + ' - ' + maxH + '\n' + 
		'Temperature: ' + minT + ' - ' + maxT + '\n' + 
		'Light: ' + minL + ' - ' + maxL);
}

function setPlantStatus(h, t, l, lw) {
	var minRec, maxRec, min, max;
	
	humidity.textContent = h;
	min = 0;	max = 10;
	minRec = localStorage.getItem('minHumid');
	maxRec = localStorage.getItem('maxHumid');
	humidity.style.backgroundColor = backgroundColor(min, max, minRec, maxRec, h);
	
	temperature.textContent = t;
	min = 0;	max = 40;
	minRec = localStorage.getItem('minTemp');
	maxRec = localStorage.getItem('maxTemp');
	temperature.style.backgroundColor = backgroundColor(min, max, minRec, maxRec, t);
	
	light.textContent = l;
	min = 0;	max = 10;
	minRec = localStorage.getItem('minLight');
	maxRec = localStorage.getItem('maxLight');
	light.style.backgroundColor = backgroundColor(min, max, minRec, maxRec, l);
	
	lastWatered.textContent = lw;
}

function backgroundColor(low, high, recLow, recHigh, current) {
	if(current > high || current < low) {
		return 'red';
	}
	if(recLow == null || recHigh == null) {
		return 'white';
	}
	if(current > recLow && current < recHigh) {
		return 'green';
	}
	return 'white';
}

var temp1 = Math.floor(Math.random() * 12) + 1;
var temp2 = Math.floor(Math.random() * 100) + 1;
var temp3 = Math.floor(Math.random() * 12) + 1;
var d = new Date();

setPlantStatus(temp1,temp2,temp3,d);
