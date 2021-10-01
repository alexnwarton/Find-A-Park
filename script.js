const baseUrl = "https://developer.nps.gov/api/v1/parks";
const apiKey = "6XXFeplxHFNsohc79vCep4HHyd10N4ARh557F2ep"

let btn = document.querySelector("button");
btn.addEventListener("click", () => {
	let userInput = document.querySelector("input").value;

	// fetching data from API based on park postal code
	fetch(`${baseUrl}?limit=500&q="postalCode"&&api_key=${apiKey}`)
		
		.then((response) => {
			return response.json();
		})
		.then((jsonResponse) => {
			
			let parkList = findParks(jsonResponse);
			console.log(nearbyParks(parkList, userInput));
			
		})

})

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

const nearbyParks = (parkList, input) => {
 const natParksNear = [];
 for(let i = 0; i < parkList.length; i++){
 	let postalCodes = parkList[i].addresses[0].postalCode;
 	if(input[0] === postalCodes[0]){
 		natParksNear.push(parkList[i]);		
 	}
 }
 	return natParksNear;
}
