//Constantes y variables

const montoinicial = document.querySelector("#inputPesos")
const montofinal = document.querySelector("#resultado")
const monedas = document.querySelector("#selectMoneda")
const boton = document.querySelector("#btnConvertir")

let dataGlobal = {};
let grafico;

//Funciones auxiliares

function render(monedasRelevantes) {
    let template = '';
    for (const moneda of monedasRelevantes) {
      template += `<option value="${moneda.codigo}">${moneda.nombre}</option>`;
    }
    monedas.innerHTML = template;
}

async function getMonedas(monedaSeleccionada) {
  try {
      const endpoint = `https://mindicador.cl/api/${monedaSeleccionada}`;
      const respuestavalores = await fetch(endpoint);
      const valordiariomoneda = await respuestavalores.json();
      const ultimos10Dias = valordiariomoneda.serie.slice(0, 10);
      return ultimos10Dias;
  } catch (error) {
      console.error("Error al obtener los datos del gráfico:", error);
      alert("Hubo un error al cargar los datos del gráfico.");
      return [];
  }
};

//Funciones principales

async function conversormoneda() {
  try {
      const res = await fetch("https://mindicador.cl/api/");
      const data = await res.json();
      dataGlobal = data;

      const excluir = ["imacec", "ipc", "ivp", "tasa_desempleo", "tpm", "libra_cobre", "dolar_intercambio"];
      const monedasRelevantes = Object.keys(data)
        .filter(moneda => data[moneda].codigo && data[moneda].nombre && !excluir.includes(moneda))
        .map(moneda => ({
          codigo: data[moneda].codigo,
          nombre: data[moneda].nombre,
          valor: data[moneda].valor
        }));
      render(monedasRelevantes);
  } catch (error) {
      console.error("Error al obtener los datos:", error);
  }
}

function generarGrafico(data, monedaSeleccionada) {
    if (grafico) {
      grafico.destroy();
    }

    const ctx = document.getElementById('myChart').getContext('2d');
    const etiquetas = data.map(d => new Date(d.fecha).toLocaleDateString()).reverse();
    const valores = data.map(d => d.valor).reverse();
    
    grafico = new Chart(ctx, {
      type: 'line',
      data: {
          labels: etiquetas,
          datasets: [{
              label: `Valor diario de ${monedaSeleccionada}`,
              data: valores,
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 2,
              fill: false
          }]
      },
      options: {
          responsive: true,
          plugins: {
              legend: {
                  display: true
              }
          },
          scales: {
              x: {
                  title: {
                      display: true,
                      text: 'Fecha'
                  }
              },
              y: {
                  title: {
                      display: true,
                      text: 'Valor'
                  }
              }
          }
      }
  });
}

//Eventos

async function handleButtonClick() {
    const monto = parseFloat(montoinicial.value);
  
    if (isNaN(monto) || monto <= 0) {
      alert("Ingrese un monto válido mayor a 0");
      return;
    }

    const monedaSeleccionada = monedas.value;
    const valorMoneda = dataGlobal[monedaSeleccionada].valor;
    const resultado = monto / valorMoneda;
    const datosGrafico = await getMonedas(monedaSeleccionada);
    montofinal.innerHTML = resultado.toFixed(2);
    generarGrafico(datosGrafico, monedaSeleccionada);
  }

boton.addEventListener("click", handleButtonClick);

// Inicialización

async function init() {
  await conversormoneda();
}

init();