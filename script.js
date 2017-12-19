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
			
			if(status.feeds[0].field1 == null ||
			status.feeds[0].field2 == null) {
				return;
			}
			
			var hValue = Number(status.feeds[0].field1);
			var date = new Date(status.feeds[0].created_at);
			var tValue = Number(status.feeds[0].field2);
			
			if(currentDP != -1 && currentDP.getTime() == date.getTime()) {
				return;
			}
				
			appendPlantStatus(hValue,tValue,date);
			if(rowCount > 5) {
				removeLastRow();
			}
			currentDP = date;
			
			var threshold = localStorage.getItem('minHumid')
			if(threshold != null && hValue < threshold) {
				sendWatered(1, hValue, tValue);
			}
		}
	}
	
	xhr.send();
}

function sendWatered(value, f1, f2) {
	var url = 'https://api.thingspeak.com/update?api_key=I4FUQAC7QSAXN7UR'
	var xhr = new XMLHttpRequest();
	xhr.open('POST', url, true);
	
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.onreadystatechange = function() {
		if(xhr.readyState == 4 && xhr.status == 200) {
			if(value == 1) {
				alert('Your plant is watered.');
			}
		}
	}
	xhr.send('field3=' + value + '&field1=' + f1 + '&field2=' + f2);
}

getData('https://api.thingspeak.com/channels/368328/feeds.json?api_key=KG5Q1Q7LHIIHIMF3&results=1');
setInterval(function() {
	getData('https://api.thingspeak.com/channels/368328/feeds.json?api_key=KG5Q1Q7LHIIHIMF3&results=1');
}, 10000);
