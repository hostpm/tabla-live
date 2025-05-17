const tableContainer = document.getElementById('table-container');
let data = JSON.parse(localStorage.getItem('liveTableData') || '{}');

function saveData() {
  localStorage.setItem('liveTableData', JSON.stringify(data));
  renderTable();
}

function renderTable() {
  tableContainer.innerHTML = '';
  const countries = Object.keys(data).sort();
  countries.forEach(country => {
    const section = document.createElement('div');
    section.className = 'country-section';

    const title = document.createElement('div');
    title.className = 'country-title';
    title.innerText = `🇺🇳 ${country}`;
    section.appendChild(title);

    data[country].sort((a, b) => a.name.localeCompare(b.name)).forEach((person, index) => {
      const personDiv = document.createElement('div');
      personDiv.className = 'person';

      const info = document.createElement('span');
      info.innerText = `${person.name} ${person.donor ? '💖' : ''}`;
      personDiv.appendChild(info);

      const delBtn = document.createElement('button');
      delBtn.innerText = 'Eliminar';
      delBtn.onclick = () => {
        data[country].splice(index, 1);
        if (data[country].length === 0) delete data[country];
        saveData();
      };
      personDiv.appendChild(delBtn);

      const editBtn = document.createElement('button');
      editBtn.innerText = 'Editar';
      editBtn.onclick = () => {
        const newName = prompt('Nuevo nombre:', person.name);
        const newDonor = confirm('¿Es donador?');
        if (newName) {
          person.name = newName;
          person.donor = newDonor;
          saveData();
        }
      };
      personDiv.appendChild(editBtn);

      section.appendChild(personDiv);
    });

    const form = document.createElement('form');
    form.onsubmit = (e) => {
      e.preventDefault();
      const name = form.elements.name.value.trim();
      const donor = form.elements.donor.checked;
      if (!name) return;
      if (!data[country]) data[country] = [];
      data[country].push({ name, donor });
      form.reset();
      saveData();
    };

    form.innerHTML = `
      <input name="name" placeholder="Nombre" required />
      <label><input type="checkbox" name="donor" /> Donador</label>
      <button type="submit">Agregar</button>
    `;

    section.appendChild(form);
    tableContainer.appendChild(section);
  });

  const newCountryDiv = document.createElement('div');
  newCountryDiv.className = 'country-section';
  newCountryDiv.innerHTML = `
    <div class="country-title">Agregar nuevo país</div>
    <form id="new-country-form">
      <input id="new-country-name" placeholder="Nombre del país" required />
      <button type="submit">Crear país</button>
    </form>
  `;
  newCountryDiv.querySelector('form').onsubmit = (e) => {
    e.preventDefault();
    const country = document.getElementById('new-country-name').value.trim();
    if (country && !data[country]) {
      data[country] = [];
      saveData();
    }
  };

  tableContainer.appendChild(newCountryDiv);
}

renderTable();