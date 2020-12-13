// Globala konstanter och variabler
const roomPrice = [600,800,950];	// Pris för rumstyperna
const extraPrice = [40,80,100];		// Pris för extravalen
var formElem;		// Referens till elementet med hela formuläret
var totalCostElem;	// Referens till elementet för totalpris
// ------------------------------
// Initiera globala variabler och koppla funktion till knapp
function init() {
	formElem = document.getElementById("booking");
	totalCostElem = document.getElementById("totalCost");
	for (let i = 0; i < formElem.roomType.length; i++) {
		formElem.roomType[i].parentNode.lastChild.textContent += 
		"(" + roomPrice[i] + " kr)";
		formElem.roomType[i].addEventListener("click",checkIfFamilyRoom);
		formElem.roomType[i].addEventListener("click",calculateCost);
	}
	for (let i = 0; i < formElem.extra.length; i++) {
		formElem.extra[i].parentNode.lastChild.textContent += " ("+ extraPrice[i] + " kr)";
		formElem.extra[i].addEventListener("click",calculateCost);
	}
	formElem.nrOfNights.addEventListener("change", calculateCost);
	checkIfFamilyRoom();
	calculateCost();
	// Händelsehanterare för textfält som ska kontrolleras
	formElem.city.addEventListener("blur",checkCity);
	formElem.zipcode.addEventListener("blur",checkField);
	formElem.telephone.addEventListener("blur",checkField);
	
	// Händelsehanterare för kampanjkod
	formElem.campaigncode.addEventListener("focus",startCheckCampaign);
	formElem.campaigncode.addEventListener("keyup",checkCampaign);
	formElem.campaigncode.addEventListener("blur",endCheckCampaign);
	
} // End init
window.addEventListener("load",init);
// ------------------------------
// kontrollera om familjerum är valt och ändra tillgänglighet till andra val
function checkIfFamilyRoom() {  			// om familjerum är inbockad sker detta
	if (formElem.roomType[2].checked) {  
		formElem.persons.disabled = false;
		formElem.persons.parentNode.style.color = "#000"; 
		formElem.extra[2].disabled = true; // sjöutsikt
		formElem.extra[2].parentNode.style.color = "#999"; // gör sjöutsikt grå
		formElem.extra[2].checked = false;
	}
else { 										// om familjerum ej är inbockad sker detta
		formElem.persons.disabled = true;
		formElem.persons.parentNode.style.color = "#999"; //label grå
		formElem.extra[2].disabled = false; // sjöutsikt
		formElem.extra[2].parentNode.style.color = "000"; // färg svart
	}
}

// kalkulera kostnad för alternativ
function calculateCost() {
	let price = 0; 											// total kostnad, startar på 0
	for (let i = 0; i < formElem.roomType.length; i++) {
		if (formElem.roomType[i].checked) {
			price = roomPrice[i];
			break;
		}
	}
	for (i = 0; i < formElem.extra.length; i++) {
		if (formElem.extra[i].checked) {
			price += extraPrice[i];
		}
	}
	let nrOfNights = formElem.nrOfNights.value;
	totalCostElem.innerHTML = nrOfNights * price;
}
// kalkulerande slut
// kontrollera och ändra innehållet i ort textfält
function checkCity() {
	let city = this.value;
	city = city.toUpperCase();
	this.value = city; 
}
// slut på checkCity
// kontrollera innehåll i fieldElem, index används till reguljärt uttryck och felmeddelande
function checkField() {
	const fieldNames = ["zipcode","telephone"];
	const re = [  // array med reguljära uttryck för fälten, som skall fyllas i korrekt
		/^\d{3} ?\d{2}$/,
		/^\d{1,3}[-/ ]?\d{5.8}$/
	];
	const errMsg = [ //array med felmeddelanden
		"postnummret måste bestå av fem siffror.",
		"Telenr måste börja med en 0:a och följas av 6-11 siffror."
	];
	let ix = fieldNames.indexOf(this.name); // index till re och errMsg
	let errMsgElem = this.nextElementSibling; // Element för felmeddelande
	errMsgElem.innerHTML = "";
	if (!re[ix].test(this.value)) {
		errMsgElem.innerHTML = errMsg[ix];
		return false; // fel i fältet
	} 
	else return true; // fältet är godkänt
} // checkfield
//  start check campaign
function startCheckCampaign() {
	this.style.backgroundColor = "#F99";
	this.select();
}
// end check campaign
function endCheckCampaign() {
	this.style.backgroundColor = "";
    this.value = this.value.toUpperCase();
}
// check campaign - kolla om koden stämmer
function checkCampaign() {
	const re = 			// kampanj kod bokstäver och siffor
		/^[a-z]{3}-\d{2}-[a-z]\d$/i;
		if (re.test(this.value)) this.style.backgroundColor = "#6F9";  	// blir grön om kod stämmer överens
		else this.style.backgroundColor = "#F99"; 				// annars blir koden röd
}