const montoinicial = document.querySelector("#inputPesos")
const montofinal = document.querySelector("#resultado")
const monedas = document.querySelector("#selectMoneda")
const boton = document.querySelector("#btnConvertir")

let dataGlobal = {};

function render(monedasRelevantes) {
  let template = '';
  for (const moneda of monedasRelevantes) {
      template += `<option value="${moneda.codigo}">${moneda.nombre}</option>`;
}
monedas.innerHTML = template;
}

async function conversormoneda() {
  try {
      const res = await fetch("https://mindicador.cl/api/");
      const data = await res.json();
      dataGlobal = data;

      const monedasRelevantes = Object.keys(data)
      .filter(moneda => data[moneda].codigo && data[moneda].nombre)
      .map(moneda => ({
          codigo: data[moneda].codigo,
          nombre: data[moneda].nombre,
          valor: data[moneda].valor
      }));;

      console.log(data); 
      render(monedasRelevantes);

  } catch (error) {
      console.error("Error al obtener los datos:", error);
  }
}

conversormoneda()

boton.addEventListener("click", () => {
  const monto = parseFloat(montoinicial.value);
  
  if (isNaN(monto) || monto <= 0) {
    alert("Ingrese un monto válido mayor a 0");
    return;
}

  const monedaSeleccionada = monedas.value;
  const valorMoneda = dataGlobal[monedaSeleccionada].valor;
  const resultado = monto / valorMoneda;

  montofinal.innerHTML = resultado.toFixed(2);
});

