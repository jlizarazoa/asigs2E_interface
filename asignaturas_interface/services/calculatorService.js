let soap = require("express-soap");
let fs = require("fs");
let path = require("path");

const wsdlService = fs.readFileSync(
  path.join(path.join(__dirname, "wsdl"), "calculatorService.wsdl"),
  "utf8"
);
const Add = (args) => {
  return {
    test: "This is a test request",
    addResult: [args.intA + args.intB, args.intA + args.intB],
  };
};

const CalculatorService = soap.soap({
  services: {
    CalculatorService: {
      CalculatorSoap: {
        Add({ a, b }, res) {
          res(Add({ intA: a, intB: b }));
        },
        Subtract({ a, b }, res) {
          res({
            result: a - b,
          });
        },
      },
    },
  },
  //archivo wsdl
  wsdl: wsdlService, // or xml (both options are valid)
});

module.exports = CalculatorService;
