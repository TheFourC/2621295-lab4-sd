document.addEventListener("DOMContentLoaded", () => {

    const input = document.querySelector("input");
    const button = document.querySelector("button");

    button.addEventListener("click", () => {
            const countryN = input.value.trim();

            if (typeof countryN !== "string" || countryN === "") {
                displayError("Invalid Input");
            }

            fetch(`https://restcountries.com/v3.1/name/${countryN}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Country not found!");
                }
                return response.json();
            })
            .then(data => {
                const countryDetails = data[0];
                handleInfo(countryDetails);
                console.log(data[0]); 
                if (countryDetails.borders) {
                    fetchBorders(countryDetails.borders);
                } else {
                    updateBorders([]);
                }  
            })
            .then(c =>
                console.log(c)   
            );
    })


})
   
const handleInfo = (countryDetails) => {
    document.getElementById("capital").innerText = `Capital: ${countryDetails.capital}`;
    document.getElementById("population").innerText = `Population: ${countryDetails.population}`;
    document.getElementById("region").innerText = `Region: ${countryDetails.region}`;
    document.querySelector("#flag img").src = countryDetails.flags.png;
};

const fetchBorders = (borderCodes) => {
    fetch(`https://restcountries.com/v3.1/alpha?codes=${borderCodes.join(",")}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Error fetching neighboring countries.");
            }
            return response.json();
        })
        .then(bordersData => {
            updateBorders(bordersData);
        })
        .catch(error => {
            console.error("Error fetching borders:", error);
            updateBorders([]);
        });
};

const updateBorders = (bordersData) => {
    const bordersList = document.querySelector("#bordering-countries ul");
    bordersList.innerHTML = "";

    if (bordersData.length === 0) {
        bordersList.innerHTML = "<li>No neighboring countries</li>";
        return;
    }

    bordersData.forEach(country => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <img src="${country.flags.png}" alt="Flag of ${country.name.common}" width="30"> 
            ${country.name.common}
        `;
        bordersList.appendChild(listItem);
    });
};
function displayError(message) {
    const errorElement = document.getElementById("error-message");
    errorElement.textContent = message;
    errorElement.style.display = "block";
}
