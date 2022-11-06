let soap = require("express-soap");
let fs = require("fs");
let path = require("path");

const wsdlService = fs.readFileSync(
  path.join(path.join(__dirname, "wsdl"), "asignaturasService.wsdl"),
  "utf8"
);
const AsignaturasTotales = (args) => {
  return {
    asignatura: [
      {
        codigo_asignatura: 10,
        creditos: 6,
        nombre_asignatura: "Matematicas",
        descripcion: "Matematicas basicas",
      },
      {
        codigo_asignatura: 20,
        creditos: 6,
        nombre_asignatura: "Fisica",
        descripcion: "Fisica basica",
      },
      {
        codigo_asignatura: 30,
        creditos: 6,
        nombre_asignatura: "Quimica",
        descripcion: "Quimica basica",
      },
      {
        codigo_asignatura: 40,
        creditos: 6,
        nombre_asignatura: "Programacion",
        descripcion: "Programacion basica",
      },
      {
        codigo_asignatura: 50,
        creditos: 6,
        nombre_asignatura: "Ingles",
        descripcion: "Ingles basico",
      },
    ],
  };
};

const AsignaturasService = soap.soap({
  services: {
    AsignaturasService: {
      AsignaturasSoap: {
        GetAsignaturas({ a, b }, res) {
          res(AsignaturasTotales({ intA: a, intB: b }));
        },
      },
    },
  },
  //archivo wsdl
  wsdl: wsdlService, // or xml (both options are valid)
});

module.exports = AsignaturasService;
