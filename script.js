const countries = {};

function addCountry() {
  const name = document.getElementById("countryName").value.trim();
  const flagUrl = document.getElementById("countryFlag").value.trim();

  if (!name || !flagUrl || countries[name]) return;

  countries[name] = [];

  const container = document.getElementById("countriesContainer");

  const column = document.createElement("div");
  column.className = "country-column";
  column.id = `col-${name}`;

  const header = document.createElement("div");
  header.className = "country-header";

  const img = document.createElement("img");
  img.src = flagUrl;
  img.alt = name;

  const title = document.createElement("strong");
  title.textContent = name;

  const addBtn = document.createElement("button");
  addBtn.textContent = "➕";
  addBtn.onclick = () => addPersonPrompt(name);

  header.appendChild(img);
  header.appendChild(title);
  header.appendChild(addBtn);
  column.appendChild(header);

  const list = document.createElement("div");
  list.className = "person-list";
  column.appendChild(list);

  container.appendChild(column);

  document.getElementById("countryName").value = "";
  document.getElementById("countryFlag").value = "";
}

function addPersonPrompt(country) {
  const name = prompt("Nombre completo:");
  if (!name) return;
  const img = prompt("URL de imagen de perfil:");
  if (!img) return;
  const isDonor = confirm("¿Es donador?");

  countries[country].push({ name, img, isDonor });
  countries[country].sort((a, b) => a.name.localeCompare(b.name));

  renderPeople(country);
}

function renderPeople(country) {
  const list = document.querySelector(`#col-${country} .person-list`);
  list.innerHTML = "";

  countries[country].forEach((person, index) => {
    const card = document.createElement("div");
    card.className = "person-card";

    const img = document.createElement("img");
    img.src = person.img;

    const name = document.createElement("span");
    name.className = "name";
    name.textContent = person.name;

    const donor = person.isDonor
      ? `<span class="donor">Donador</span>`
      : "";

    const controls = document.createElement("div");
    controls.className = "controls";

    const edit = document.createElement("button");
    edit.textContent = "✏️";
    edit.onclick = () => editPerson(country, index);

    const del = document.createElement("button");
    del.textContent = "🗑️";
    del.onclick = () => {
      countries[country].splice(index, 1);
      renderPeople(country);
    };

    controls.appendChild(edit);
    controls.appendChild(del);

    const wrapper = document.createElement("div");
    wrapper.appendChild(name);
    wrapper.innerHTML += donor;

    card.appendChild(img);
    card.appendChild(wrapper);
    card.appendChild(controls);

    list.appendChild(card);
  });
}

function editPerson(country, index) {
  const current = countries[country][index];
  const name = prompt("Nuevo nombre:", current.name);
  if (!name) return;
  const img = prompt("Nueva URL de imagen:", current.img);
  if (!img) return;
  const isDonor = confirm("¿Es donador?");
  countries[country][index] = { name, img, isDonor };
  countries[country].sort((a, b) => a.name.localeCompare(b.name));
  renderPeople(country);
}
