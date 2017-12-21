var table = document.querySelector('.plantStatusTable');

var rowCount = 0;

var currentPref = document.querySelector('.currentPref');
var changeSetting = document.querySelector('.changeSetting');
var minHumid = document.querySelector('.minHumid');
var maxHumid = document.querySelector('.maxHumid');
var minTemp = document.querySelector('.minTemp');
var maxTemp = document.querySelector('.maxTemp');
var currentDP = -1;

changeSetting.addEventListener('click', setValues);
currentPref.addEventListener('click', showPref); 

function showPref(){
	var minH, maxH, minT, maxT;
	minH = localStorage.getItem('minHumid');
	maxH = localStorage.getItem('maxHumid');
	minT = localStorage.getItem('minTemp');
	maxT = localStorage.getItem('maxTemp');
	alert('Current preference is:\n' + 
		'Humidity: ' + minH + ' - ' + maxH + '\n' + 
		'Temperature: ' + minT + ' - ' + maxT);
}

function setValues() {
	var minH = Number(minHumid.value);
	var maxH = Number(maxHumid.value);
	var minT = Number(minTemp.value);
	var maxT = Number(maxTemp.value);
	
	if(minH < 0 || minH > 4095 || maxH < 0 || maxH > 4095 ||
		minT < 0 || minT > 100 || maxT < 0 || maxT > 100 ||
		maxH < minH || maxT < minT) {
		alert('Invalid Preference');
		return;
	}
	
	localStorage.setItem('minHumid', minH);
	localStorage.setItem('maxHumid', maxH);
	localStorage.setItem('minTemp', minT);
	localStorage.setItem('maxTemp', maxT);
	
	alert('Preference has been changed to:\n' + 
		'Humidity: ' + minH + ' - ' + maxH + '\n' + 
		'Temperature: ' + minT + ' - ' + maxT);
}

function appendPlantStatus(h, t, aH, ldp) {
	var minRec, maxRec, min, max;
	var row = table.insertRow(1);
	
	var hCell = row.insertCell(0);
	var tCell = row.insertCell(1);
	var aCell = row.insertCell(2);
	var dCell = row.insertCell(3);
	
	hCell.textContent = h;
	min = 0;	max = 2000;
	minRec = localStorage.getItem('minHumid');
	maxRec = localStorage.getItem('maxHumid');
	hCell.style.backgroundColor = backgroundColor(min, max, minRec, maxRec, h);
	
	tCell.textContent = t;
	min = 0;	max = 40;
	minRec = localStorage.getItem('minTemp');
	maxRec = localStorage.getItem('maxTemp');
	tCell.style.backgroundColor = backgroundColor(min, max, minRec, maxRec, t);
	
	aCell.textContent = aH;
	dCell.textContent = ldp;
	
	rowCount += 1;
}

function removeLastRow() {
	table.deleteRow(-1);
	rowCount -= 1;
}

function backgroundColor(low, high, recLow, recHigh, current) {
	if(current > high || current < low) {
		return 'red';
	}
	if(recLow == null || recHigh == null) {
		return 'white';
	}
	if(current >= recLow && current <= recHigh) {
		return 'green';
	}
	return 'white';
}

function getData(url) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	
	xhr.onreadystatechange = function() {
		if(xhr.readyState == 4 && xhr.status == 200) {
			var status = JSON.parse(xhr.responseText);
			//alert(xhr.responseText);
			
			if(status.feeds[0].field1 == null) {
			//|| status.feeds[0].field2 == null) {
				return;
			}
			
			var hValue = Number(status.feeds[0].field1);
			var date = new Date(status.feeds[0].created_at);
			//var tValue = Number(status.feeds[0].field2);
			var tValue = localStorage.getItem('temp');
			var airH = localStorage.getItem('humid');
			
			if(currentDP != -1 && currentDP.getTime() == date.getTime()) {
				return;
			}
				
			appendPlantStatus(hValue,tValue, airH, date);
			if(rowCount > 5) {
				removeLastRow();
			}
			currentDP = date;
			
			var out = '';
			var threshold = localStorage.getItem('minHumid');
			if(threshold != null && hValue < threshold) {
				sendWatered(1);
				out += 'Soil humidity is too low. Watering your plant.\n';
			} else {
				sendWatered(0);
			}
			var threshold = localStorage.getItem('maxHumid');
			if(threshold != null && hValue > threshold) {
				out += 'Soil humidity is too high. Please allow the soil to drain.\n';
			}
			var threshold = localStorage.getItem('minTemp');
			if(threshold != null && tValue < threshold) {
				out += 'Your plant is too cold.\n';
			}
			var threshold = localStorage.getItem('maxTemp');
			if(threshold != null && tValue > threshold) {
				out += 'Your plant is too hot.\n';
			}
			if(out != '') {
				alert(out);
			}
		}
	}
	
	xhr.send();
}

function sendWatered(value) {
	var url = 'https://api.thingspeak.com/update?api_key=WM173L1UK0AMQN9B'
	var xhr = new XMLHttpRequest();
	xhr.open('POST', url, true);
	
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.onreadystatechange = function() {
		if(xhr.readyState == 4 && xhr.status == 200) {
			if(value == 1 && xhr.responseText != 0) {
				alert('Your plant is watered.');
			}
			//alert(xhr.responseText);
		}
	}
	xhr.send('field1=' + value);
}

function updateTemp() {
	var url = 'http://api.openweathermap.org/data/2.5/weather?appid=18ba673a138ff53fd8d9035618f9e4a4&id=1609350&units=metric';
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	
	xhr.onreadystatechange = function() {
		if(xhr.readyState == 4 && xhr.status == 200) {
			var status = JSON.parse(xhr.responseText);
			//alert(xhr.responseText);
			
			localStorage.setItem('temp', status.main.temp);
			localStorage.setItem('humid', status.main.humidity);
		}
	}
	
	xhr.send();
}

updateTemp();
getData('https://api.thingspeak.com/channels/368328/feeds.json?api_key=KG5Q1Q7LHIIHIMF3&results=1');
setInterval(function() {
	getData('https://api.thingspeak.com/channels/368328/feeds.json?api_key=KG5Q1Q7LHIIHIMF3&results=1');
}, 15000);
setInterval(function() {
	updateTemp();
}, 600000);
