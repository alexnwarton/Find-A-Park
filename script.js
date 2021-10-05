const baseUrl = "https://developer.nps.gov/api/v1/parks";
const apiKey = "6XXFeplxHFNsohc79vCep4HHyd10N4ARh557F2ep"


let inputBar = document.querySelector("input");
let btn = document.querySelector("button");
let mainHeader = document.querySelector("header");
// document.addEventListener('DOMContentLoaded', () => {
	

// })



btn.addEventListener("click", () => {
	let userInput = document.querySelector("input").value;
	let zipToLatLong = [];

	// Converts the zipcode input by user to latitude and longitude values using mapquest API
	fetch(`http://www.mapquestapi.com/geocoding/v1/address?key=7eswptpG7eFsKM6dEKesj010foCEAYFQ&location=${userInput}`)
		.then((convertResponse) => {
			return convertResponse.json();
		})
		.then((jsonResponse) => {
			
			zipToLatLong.push(jsonResponse.results[0].locations[0].latLng.lat);
			zipToLatLong.push(jsonResponse.results[0].locations[0].latLng.lng);
			userInput = zipToLatLong;	

			// fetching data from national parks API based on park postal code
			fetch(`${baseUrl}?limit=500&q="postalCode"&&api_key=${apiKey}`)
		
				.then((response) => {
				return response.json();
				})
				.then((jsonResponse) => {
			
					let parkList = findParks(jsonResponse);
			
					let closestPark = nearbyParks(parkList, userInput);

					//const parkImages = closestPark.images

					// closestPark.forEach((image, i) => {
					// 	parkImages.push(image[i].url);
					// })
					// console.log(parkImages);

					document.querySelector("#descriptionH2").append(closestPark.fullName);
					document.querySelector("#descriptionP").append(closestPark.description);
					document.querySelector("#parkImage").setAttribute("src", closestPark.images[0].url);
					//document.querySelector("#parkImage").style.height = "500px";

					document.querySelector("#activitiesH2").innerText = "Available Park Activities";
					const activities = closestPark.activities;
					activities.forEach((item, i) => {
						let activity = document.createElement("li");
						activity.innerText = item.name;
						document.querySelector("ul").append(activity);
					})

					document.querySelector("#weatherH2").innerText = "Weather Information";
					document.querySelector("#weatherP").append(closestPark.weatherInfo);

					document.querySelector("a").setAttribute("href", closestPark.url);
					document.querySelector("a").innerText = "Learn more about this park";
			
				})

				.catch((error) => {
					console.log(`Error:  {error}`);
				})
				
		})
		.catch((error) => {
					console.log(`Error:  {error}`);
				})
			
	

	
	

})

// Searching through the list of all national sites to return national parks
const findParks = (siteInfo) => {
	const natParks = [];
			//const natMonuments = [];
			//const histParks = [];
	for(let i = 0; i < siteInfo.data.length; i++) {
		if(siteInfo.data[i].designation.includes("National Park")){
			natParks.push(siteInfo.data[i]);						
		}						
	}
	return natParks;
}


// calcDistance function referenced from https://www.movable-type.co.uk/scripts/latlong.html to calculate the distance between two points based on given latitude and longitute values
const calcDistance = (park1, park2) => {
	const radius = 6371; // radius of the earth in kilometers
	let latDiffDegrees = (park2[0] - park1[0]) * (Math.PI / 180);
	let longDiffDegrees = (park2[1] - park1[1]) * (Math.PI / 180);
	
	let a = Math.sin(latDiffDegrees / 2) * Math.sin(latDiffDegrees / 2) +
    Math.cos((park1[0]) * (Math.PI / 180)) * Math.cos((park2[0]) * (Math.PI / 180)) * 
    Math.sin(longDiffDegrees / 2) * Math.sin(longDiffDegrees / 2); 


    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	let distance = radius * c;
	//convert distance from meters to miles
	distance = distance * 0.621371;
	return distance;

}

//Finds the closest park based on the user input
const nearbyParks = (parkList, input) => {
 
 document.querySelector("input").value = "";
 document.querySelector("#descriptionP").innerHTML = "";
 document.querySelector("#descriptionH2").innerHTML = "";
 document.querySelector("#activitiesH2").innerHTML = "";
 document.querySelector("ul").innerHTML = "";
 document.querySelector("#weatherH2").innerHTML = "";
 document.querySelector("#weatherP").innerHTML = "";
 document.querySelector("a").innerHTML = "";

 let natParksNear = parkList[0];
 let minDistance = calcDistance(input, [parseFloat(parkList[0].latitude), parseFloat(parkList[0].longitude)]);
 let parkLat;
 let parkLong;
 let distance;
 
 parkList.forEach((park, i) => {
 	parkLat = parseFloat(park.latitude);
 	parkLong = parseFloat(park.longitude);
 	distance = calcDistance(input, [parkLat, parkLong]);
 
 	if(distance < minDistance) {
 		minDistance = distance;
 		natParksNear = park;
 	}
 })
 	
 	return natParksNear;
}


// Styles the search bar after a search is made
const searchStyling = () => {

	mainHeader.style.height = "100px";
	mainHeader.style.width = "300px";
	mainHeader.style.flexDirection = "column";
	mainHeader.style.justifyContent = "flex-start";
	document.querySelector("h1").style.fontSize = "20px";
	document.querySelector("h1").style.textAlign = "right";
	inputBar.style.height = "15px";
	inputBar.style.width = "100px";
	inputBar.style.fontSize = "10px";
	btn.style.height = "20px";
	btn.style.width = "50px";
	btn.style.fontSize = "10px";

}