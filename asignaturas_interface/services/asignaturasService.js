let fs = require("fs");
let path = require("path");
const { json } = require("express");

const wsdlService = fs.readFileSync(
  path.join(path.join(__dirname, "wsdl"), "asignaturasService.wsdl"),
  "utf8"
);

const fakeInfo = () => {
  return {
    asignatura: {
      codigo_asignatura: 50,
      creditos: 6,
      nombre_asignatura: "Ingles",
      descripcion: "Ingles basico",
      tipo: {
        id_tipologia: 1,
        nombre_tipologia: "Libre elección",
      },
      programa: {
        id_programa: 2,
        nombre_programa: "Lingüistica",
        facultad: {
          id_facultad: 4,
          nombre_facultad: "Lingüistica",
          sede: {
            id_sede: 1,
            nombre_sede: "Bogotá",
          },
        },
      },
    },
  };
};

const queryAsignature = (args) => `{
  asignatura(codigo_asignatura: ${args}){
    codigo_asignatura
    nombre_asignatura
    creditos
    descripcion
    tipo {
      id_tipologia
      nombre_tipologia
    }
    programa {
      id_programa
      nombre_programa
      facultad {
        id_facultad
        nombre_facultad
        sede {
          id_sede
          nombre_sede
        }
      }
    }
  }
}`;
const url = `http://host.docker.internal:4010/fetch_buscador_cursos`;

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

async function auxGetAsignatures(args) {
  const query = queryAsignature(args);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query,
      }),
    });
    const data = await response.json();
    return data.data;
  } catch (error) {
    return null;
  }
}

const AsignaturasService = {
  AsignaturasService: {
    AsignaturasSoap: {
      async GetAsignaturas({ codigo_asignatura }, res) {
        res({
          asignatura: await auxGetAsignatures(codigo_asignatura).then(
            (data) => {
              if (data == null) {
                return [fakeInfo().asignatura];
              }
              return [data.asignatura];
            }
          ),
        });
      },
    },
  },
  //archivo wsdl
  wsdl: wsdlService, // or xml (both options are valid)
};

module.exports = { service: AsignaturasService, xml: wsdlService };
