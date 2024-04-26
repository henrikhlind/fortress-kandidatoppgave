"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function renderData() {
    return __awaiter(this, void 0, void 0, function* () {
        const target = 'https://fortress.no/data/data-2020-interview.json';
        const response = yield fetch('https://cors-anywhere.herokuapp.com/' + target, {
            method: 'GET',
        });
        if (!response.ok) {
            document.getElementById('title').innerHTML += `<h1>Kunne ikke hente data</h1>`;
            throw new Error(`${response.status}`);
        }
        const data = yield response.json();
        if (data.title.length != 0) {
            data.title.forEach((Element) => {
                document.getElementById('title').innerHTML += `<h1>${Element}</h1>`;
            });
        }
        else {
            document.getElementById('title').innerHTML += `<h1>Fant ingen tittel</h1>`;
        }
        if (data.details.length != 0) {
            data.details.forEach((Element) => {
                if (Element.name && Element.value)
                    document.getElementById('details').innerHTML += `
      <div class="detail-container">
      <p>${Element.name.charAt(0).toUpperCase() + Element.name.slice(1)}</p> 
      <p class="data-value">${typeof Element.value === 'number'
                        ? new Intl.NumberFormat('nb-NO').format(Element.value).replace(/\s/g, '.') + ',-'
                        : Element.value.charAt(0).toUpperCase() + Element.value.slice(1)}</p>
      </div>
    `;
            });
        }
        else {
            document.getElementById('details').innerHTML += `
    <p>Fant ingen detaljer</p>
  `;
        }
        if (data.address.street && data.address.zipCode && data.address.city) {
            document.getElementById('address').innerHTML += `
    <p>Adresse<p>
    <p class="data-value">${data.address.street},<br>${data.address.zipCode} ${data.address.city}</p>
  `;
        }
        else {
            document.getElementById('address').innerHTML += `
    <p>Adresse<p>
    <p class="data-value">Fant ingen adresse</p>
  `;
        }
        if (data.contact.name && data.contact.phone) {
            document.getElementById('contact').innerHTML += `
      <p>Kontakt<p>
      <p class="data-value">${data.contact.name}<br>${data.contact.phone.replace(/(0047|\+47|47)?(\d{3})(\d{2})(\d{3})/, '+47 $2 $3 $4')}</p>
    `;
        }
        else {
            document.getElementById('contact').innerHTML += `
      <p>Kontakt<p>
      <p class="data-value">Fant ingen kontakt</p>
    `;
        }
    });
}
renderData();
function sortData(data) {
    const sortedData = [];
    data.forEach((element) => {
        if (element.description.toLowerCase() === 'valid' || element.description.toLowerCase() === 'true')
            sortedData.push(element);
    });
    sortedData.sort((a, b) => {
        const valueA = Number(a.value);
        const valueB = Number(b.value);
        if (valueA < valueB) {
            return -1;
        }
        if (valueA > valueB) {
            return 1;
        }
        return 0;
    });
    return sortedData;
}
fetch('https://cors-anywhere.herokuapp.com/' + 'https://fortress.no/data/oppgave-2-2020.json')
    .then((response) => response.json())
    .then((data) => {
    console.log(sortData(data));
});
