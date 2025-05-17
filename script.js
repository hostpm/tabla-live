const paises = {};

function agregarPais() {
  const nombre = document.getElementById("pais").value.trim();
  const url = document.getElementById("bandera").value.trim();

  if (!nombre || !url || paises[nombre]) return;

  paises[nombre] = [];

  const contenedor = document.createElement("div");
  contenedor.className = "pais";
  contenedor.id = `pais-${nombre}`;

  const encabezado = document.createElement("div");
  encabezado.className = "pais-header";
  encabezado.innerHTML = `
    <img src="${url}" alt="${nombre}">
    <strong>${nombre}</strong>
    <span class="contador-personas">(0)</span>
  `;
  
  const personas = document.createElement("div");
  personas.className = "personas";

  const form = document.querySelector("#form-persona").content.cloneNode(true);
  const inputNombre = form.querySelector(".nombre");
  const inputFoto = form.querySelector(".foto");
  const inputDonador = form.querySelector(".donador");
  const btnAgregar = form.querySelector(".agregar");

  btnAgregar.onclick = () => {
    const nombrePersona = inputNombre.value.trim();
    const fotoPersona = inputFoto.value.trim();
    const esDonador = inputDonador.checked;

    if (!nombrePersona || !fotoPersona) return;

    const persona = {
      nombre: nombrePersona,
      foto: fotoPersona,
      donador: esDonador
    };

    paises[nombre].push(persona);
    paises[nombre].sort((a, b) => a.nombre.localeCompare(b.nombre));
    renderPersonas(nombre, personas);
    
    inputNombre.value = "";
    inputFoto.value = "";
    inputDonador.checked = false;
  };

  contenedor.appendChild(encabezado);
  contenedor.appendChild(personas);
  contenedor.appendChild(form);
  document.getElementById("paises-container").appendChild(contenedor);

  document.getElementById("pais").value = "";
  document.getElementById("bandera").value = "";
}

function renderPersonas(nombrePais, contenedor) {
  contenedor.innerHTML = "";
  paises[nombrePais].forEach(persona => {
    const div = document.createElement("div");
    div.className = "persona" + (persona.donador ? " donador" : "");
    div.innerHTML = `
      <img src="${persona.foto}" alt="${persona.nombre}" />
      <span>${persona.nombre} ${persona.donador ? '❤️' : ''}</span>
    `;
    contenedor.appendChild(div);
  });

  // Actualizar contador
  const paisDiv = document.getElementById(`pais-${nombrePais}`);
  const contador = paisDiv.querySelector(".contador-personas");
  contador.textContent = `(${paises[nombrePais].length})`;
}

