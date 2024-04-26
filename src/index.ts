// Oppgave 1
function formatPhoneNumber(phoneNumber: string): string {
  return phoneNumber.replace(/(0047|\+47|47)?(\d{3})(\d{2})(\d{3})/, '+47 $2 $3 $4');
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('nb-NO').format(price).replace(/\s/g, '.') + ',-';
}

async function renderData(): Promise<void> {
  // Hadde problemer med å hente data fra serveren pga. CORS-policy, skrev mer om dette på readme :) Hadde brukt target variablen under dersom nettsiden var i produksjon
  // const target = 'https://fortress.no/data/data-2020-interview.json';
  const response = await fetch('/data/data-2020-interview.json', {
    method: 'GET',
  });

  if (!response.ok) {
    document.getElementById('title')!.innerHTML += `<h1>Kunne ikke hente data</h1>`; // Oppdaterer tittel ved feil
    throw new Error(`${response.status}`);
  }

  const data = await response.json();

  // Tittel
  if (data.title.length != 0) {
    data.title.forEach((Element: string) => {
      document.getElementById('title')!.innerHTML += `<h1>${Element}</h1>`;
    });
  } else {
    document.getElementById('title')!.innerHTML += `<h1>Fant ingen tittel</h1>`;
  }

  // Detaljer
  if (data.details.length != 0) {
    data.details.forEach((Element: { name: string; value: string }) => {
      if (Element.name && Element.value)
        // Tar høyde for ufullstendig data
        document.getElementById('details')!.innerHTML += `
      <div class="detail-container">
      <p>${Element.name.charAt(0).toUpperCase() + Element.name.slice(1)}</p> 
      <p class="data-value">${
        typeof Element.value === 'number'
          ? formatPrice(Element.value) // Formater tall med punktumskille og null øre (antar at tall er hele, uten øre)
          : Element.value.charAt(0).toUpperCase() + Element.value.slice(1) // Stor forborkstav
      }</p>
      </div>
    `;
    });
  } else {
    document.getElementById('details')!.innerHTML += `
    <p>Fant ingen detaljer</p>
  `;
  }

  // Adresse
  if (data.address.street && data.address.zipCode && data.address.city) {
    document.getElementById('address')!.innerHTML += `
    <p>Adresse<p>
    <p class="data-value">${data.address.street},<br>${data.address.zipCode} ${data.address.city}</p>
  `;
  } else {
    document.getElementById('address')!.innerHTML += `
    <p>Adresse<p>
    <p class="data-value">Fant ingen adresse</p>
  `;
  }

  // Kontaktinformasjon, tlf formateres med regex hentet fra stackoverflow
  if (data.contact.name && data.contact.phone) {
    document.getElementById('contact')!.innerHTML += `
      <p>Kontakt<p>
      <p class="data-value">${data.contact.name}<br>${formatPhoneNumber(data.contact.phone)}</p>
    `;
  } else {
    document.getElementById('contact')!.innerHTML += `
      <p>Kontakt<p>
      <p class="data-value">Fant ingen kontakt</p>
    `;
  }
}

renderData();

// Oppgave 2
function sortData(data: { name: string; value: string; description: string }[]): { name: string; value: string; description: string }[] {
  const validData = data.filter((element) => element.description.toLowerCase() === 'valid' || element.description.toLowerCase() === 'true');

  validData.sort((a, b) => {
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

  return validData;
}

fetch('/data/oppgave-2-2020.json')
  .then((response) => response.json())
  .then((data) => {
    console.log(sortData(data));
  });
