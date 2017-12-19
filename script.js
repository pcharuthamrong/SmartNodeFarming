var table = document.querySelector('.plantStatusTable');

var rowCount = 0;

var changeSetting = document.querySelector('.changeSetting');
var minHumid = document.querySelector('.minHumid');
var maxHumid = document.querySelector('.maxHumid');
var minTemp = document.querySelector('.minTemp');
var maxTemp = document.querySelector('.maxTemp');
var currentDP = -1;

changeSetting.addEventListener('click', setValues);

function setValues() {
	var minH = minHumid.value;
	var maxH = maxHumid.value;
	var minT = minTemp.value;
	var maxT = maxTemp.value;
	
	localStorage.setItem('minHumid', minH);
	localStorage.setItem('maxHumid', maxH);
	localStorage.setItem('minTemp', minT);
	localStorage.setItem('maxTemp', maxT);
	
	alert('Preference has been changed to:\n' + 
		'Humidity: ' + minH + ' - ' + maxH + '\n' + 
		'Temperature: ' + minT + ' - ' + maxT);
}

function appendPlantStatus(h, t, ldp) {
	var minRec, maxRec, min, max;
	var row = table.insertRow(1);
	
	var hCell = row.insertCell(0);
	var tCell = row.insertCell(1);
	var dCell = row.insertCell(2);
	
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
			var temp2 = Math.floor(Math.random() * 100) + 1;
			
			if(currentDP === -1 || currentDP.getTime() !== date.getTime()) {
				appendPlantStatus(hValue,temp2,date);
				if(rowCount >= 5) {
					removeLastRow();
				}
			}
			currentDP = date;
		}
	}
	
	xhr.send();
}

getData('https://api.thingspeak.com/channels/368328/feeds.json?api_key=KG5Q1Q7LHIIHIMF3&results=1');
setInterval(function() {
	getData('https://api.thingspeak.com/channels/368328/feeds.json?api_key=KG5Q1Q7LHIIHIMF3&results=1');
}, 10000);
