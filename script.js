var humidity = document.querySelector('.humidity');
var temperature = document.querySelector('.temperature');
var dataFrom = document.querySelector('.dataFrom');

var changeSetting = document.querySelector('.changeSetting');
var minHumid = document.querySelector('.minHumid');
var maxHumid = document.querySelector('.maxHumid');
var minTemp = document.querySelector('.minTemp');
var maxTemp = document.querySelector('.maxTemp');

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

function setPlantStatus(h, t, ldp) {
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
	
	dataFrom.textContent = ldp;
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

function getData(url) {
	var xhr= new XMLHttpRequest();
	xhr.open('GET', url, true);
	
	xhr.onreadystatechange = function() {
		if(xhr.readyState == 4) {
			var status = JSON.parse(xhr.responseText);
			//alert(xhr.responseText);
			
			var hValue = status.feeds[0].field1;
			var date = new Date(status.feeds[0].created_at);
			
			setPlantStatus(hValue,temp2,date);
		}
	}
	
	xhr.send();
}

var temp2 = Math.floor(Math.random() * 100) + 1;

getData('https://api.thingspeak.com/channels/368328/feeds.json?api_key=KG5Q1Q7LHIIHIMF3&results=1');
