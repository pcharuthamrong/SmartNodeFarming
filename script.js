var humidity = document.querySelector('.humidity');
var temperature = document.querySelector('.temperature');
var light = document.querySelector('.light');
var lastWatered = document.querySelector('.lastWatered');

function setPlantStatus(h, t, l, lw) {
	humidity.textContent = h;
	temperature.textContent = t;
	temperature.style.backgroundColor = backgroundColor(10, 40, 20, 30, t);
	light.textContent = l;
	lastWatered.textContent = lw;
}

function backgroundColor(low, high, recLow, recHigh, current) {
	if(current > high || current < low) {
		return 'red';
	}
	if(current > recLow && current < recHigh) {
		return 'green';
	}
	return 'white';
}

var temp1 = Math.floor(Math.random() * 10) + 1;
var temp2 = Math.floor(Math.random() * 100) + 1;
var temp3 = Math.floor(Math.random() * 10) + 1;
var d = new Date();

setPlantStatus(temp1,temp2,temp3,d);