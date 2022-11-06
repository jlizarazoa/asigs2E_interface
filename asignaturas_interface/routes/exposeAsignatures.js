const { json } = require('express');
var express = require('express');
var router = express.Router();

const query = `{
  asignatura(codigo_asignatura: 2){
    codigo_asignatura
    nombre_asignatura
    creditos
  
    descripcion
    tipo {
      nombre_tipologia
    }
    programa {
      nombre_programa
      facultad {
        nombre_facultad
        sede {
          nombre_sede
        }
      }
    }
    
  }
}`
const url = `http://host.docker.internal:4010/fetch_buscador_cursos`;
const options = {
  method: 'POST',
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
  body: JSON.stringify({
    query
  })
}

const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

/* GET users listing. */
router.get('/', function(req, res, next) {
  //res.send('respond with a resource');
  fetch(url, options)
    .then(res => res.json())
    .then(json => res.send(json.data))
    .catch(err => console.log('error:' + err))

});

module.exports = router;
