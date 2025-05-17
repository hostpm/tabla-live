// Estructura de datos en localStorage: { countries: [{name, flagDataUrl, persons: [{name, photoDataUrl, donor}]}] }

const countriesContainer = document.getElementById("countries-container");
const addCountryBtn = document.getElementById("add-country-btn");
const countryNameInput = document.getElementById("country-name");
const countryFlagInput = document.getElementById("country-flag");

let data = { countries: [] };

function saveData() {
  localStorage.setItem("liveTableData", JSON.stringify(data));
}

function loadData() {
  const saved = localStorage.getItem("liveTableData");
  if (saved) {
    data = JSON.parse(saved);
  }
}

// Helpers para crear elementos
function createElement(tag, options = {}, ...children) {
  const el = document.createElement(tag);
  for (const [key, val] of Object.entries(options)) {
    if (key === "className") el.className = val;
    else if (key === "innerHTML") el.innerHTML = val;
    else if (key === "src") el.src = val;
    else if (key === "onclick") el.onclick = val;
    else if (key === "type") el.type = val;
    else if (key === "checked") el.checked = val;
    else el.setAttribute(key, val);
  }
  for (const child of children) {
    if (child) el.appendChild(child);
  }
  return el;
}

// Ordena personas alfabeticamente por nombre
function sortPersons(persons) {
  return persons.sort((a,b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
}

function render() {
  countriesContainer.innerHTML = "";

  data.countries.forEach((country, countryIndex) => {
    // Crear columna país
    const col = createElement("div", {className: "country-column"});

    // Header con bandera y nombre
    const flagImg = createElement("img", {src: country.flagDataUrl || "", alt: country.name + " bandera"});
    const header = createElement("div", {className: "country-header"}, flagImg, createElement("div", {innerHTML: country.name}));

    col.appendChild(header);

    // Lista personas
    const personList = createElement("div", {className: "person-list"});
    const sortedPersons = sortPersons(country.persons);

    sortedPersons.forEach((person, personIndex) => {
      const photo = createElement("img", {className:"person-photo", src: person.photoDataUrl || "", alt: person.name});
      const nameDiv = createElement("div", {className: "person-name", innerHTML: person.name});
      const donorMark = person.donor ? createElement("span", {className: "donor-heart", innerHTML: "❤️"}) : null;

      // Botones editar y eliminar
      const editBtn = createElement("button", {innerHTML: "Editar"});
      const deleteBtn = createElement("button", {innerHTML: "Eliminar", className: "delete-btn"});

      // Contenedor acciones
      const actions = createElement("div", {className: "person-actions"}, editBtn, deleteBtn);

      const personItem = createElement("div", {className: "person-item"}, photo, nameDiv);
      if (donorMark) personItem.appendChild(donorMark);
      personItem.appendChild(actions);

      // Eliminar persona
      deleteBtn.onclick = () => {
        if (confirm(`Eliminar persona "${person.name}" de ${country.name}?`)) {
          data.countries[countryIndex].persons.splice(personIndex, 1);
          saveData();
          render();
        }
      };

      // Editar persona
      editBtn.onclick = () => {
        const newName = prompt("Editar nombre:", person.name);
        if (!newName) return alert("El nombre no puede estar vacío");
        const donorConfirm = confirm("¿Es donador? (Aceptar = Sí, Cancelar = No)");
        data.countries[countryIndex].persons[personIndex].name = newName.trim();
        data.countries[countryIndex].persons[personIndex].donor = donorConfirm;
        saveData();
        render();
      };

      personList.appendChild(personItem);
    });

    col.appendChild(personList);

    // Formulario para agregar persona
    const addPersonForm = createElement("form", {className: "add-person-form"});

    const inputName = createElement("input", {type: "text", placeholder: "Nombre persona", required: true});
    const inputPhoto = createElement("input", {type: "file", accept: "image/*", required: true});
    const inputDonor = createElement("label");
    const inputDonorCheckbox = createElement("input", {type: "checkbox"});
    inputDonor.appendChild(inputDonorCheckbox);
    inputDonor.appendChild(document.createTextNode(" Donador"));

    const submitBtn = createElement("button", {type: "submit", innerHTML: "Agregar"});

    addPersonForm.appendChild(inputName);
    addPersonForm.appendChild(inputPhoto);
    addPersonForm.appendChild(inputDonor);
    addPersonForm.appendChild(submitBtn);

    addPersonForm.onsubmit = (e) => {
      e.preventDefault();
      const name = inputName.value.trim();
      const donor = inputDonorCheckbox.checked;
      const file = inputPhoto.files[0];
      if (!name || !file) return alert("Por favor completa todos los campos");

      // Leer imagen y guardar
      const reader = new FileReader();
      reader.onload = function(evt) {
        data.countries[countryIndex].persons.push({
          name,
          photoDataUrl: evt.target.result,
          donor
        });
        saveData();
        render();
      };
      reader.readAsDataURL(file);
    };

    col.appendChild(addPersonForm);

    countriesContainer.appendChild(col);
  });
}

// Agregar país
addCountryBtn.onclick = () => {
  const name = countryNameInput.value.trim();
  if (!name) return alert("Escribe el nombre del país");
  const file = countryFlagInput.files[0];
  if (!file) return alert("Selecciona una imagen para la bandera");

  // Leer imagen bandera
  const reader = new FileReader();
  reader.onload = function(evt) {
    data.countries.push({
      name,
      flagDataUrl: evt.target.result,
      persons: []
    });
    saveData();
    render();
    countryNameInput.value = "";
    countryFlagInput.value = "";
  };
  reader.readAsDataURL(file);
};

// Cargar datos y renderizar al inicio
loadData();
render();
