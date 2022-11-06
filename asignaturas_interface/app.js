var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
let soap = require("express-soap");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

app.use(
  "/soap/calculation",
  soap.soap({
    services: {
      CalculatorService: {
        Calculator: {
          Add({ a, b }, res) {
            res({
              result: a + b,
            });
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
    wsdl: `
    
    <definitions name="CalculatorService" targetNamespace="http://tempuri.org/" xmlns="http://schemas.xmlsoap.org/wsdl/" xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" xmlns:tns="http://tempuri.org/" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
      <types>
        <xsd:schema elementFormDefault="qualified" targetNamespace="http://tempuri.org/">
          <xsd:element name="Add">
            <xsd:complexType>
              <xsd:sequence>
                <xsd:element minOccurs="0" name="a" nillable="true" type="xsd:int" />
                <xsd:element minOccurs="0" name="b" nillable="true" type="xsd:int" /> 
              </xsd:sequence>
            </xsd:complexType>
          </xsd:element>
          <xsd:element name="AddResponse">
            <xsd:complexType>
              <xsd:sequence>
                <xsd:element minOccurs="0" name="AddResult" nillable="true" type="xsd:int" />
              </xsd:sequence> 
            </xsd:complexType>
          </xsd:element>
          <xsd:element name="Subtract">
            <xsd:complexType>
              <xsd:sequence>
                <xsd:element minOccurs="0" name="a" nillable="true" type="xsd:int" />
                <xsd:element minOccurs="0" name="b" nillable="true" type="xsd:int" /> 
              </xsd:sequence>
            </xsd:complexType>
          </xsd:element>
          <xsd:element name="SubtractResponse">
            <xsd:complexType>
              <xsd:sequence>
                <xsd:element minOccurs="0" name="SubtractResult" nillable="true" type="xsd:int" />
              </xsd:sequence>
            </xsd:complexType>
          </xsd:element>
        </xsd:schema>
      </types>
      <message name="AddSoapIn">
        <part name="parameters" element="tns:Add" />
      </message>
      <message name="AddSoapOut">
        <part name="parameters" element="tns:AddResponse" />
      </message>
      <message name="SubtractSoapIn">
        <part name="parameters" element="tns:Subtract" />
      </message>
      <message name="SubtractSoapOut">
        <part name="parameters" element="tns:SubtractResponse" />
      </message>
      <portType name="CalculatorSoap">
        <operation name="Add">
          <input message="tns:AddSoapIn" />
          <output message="tns:AddSoapOut" />
        </operation>
        <operation name="Subtract">
          <input message="tns:SubtractSoapIn" />
          <output message="tns:SubtractSoapOut" />
        </operation>
      </portType>
      <binding name="CalculatorSoap" type="tns:CalculatorSoap">
        <soap:binding style="document" transport="http://schemas.xmlsoap.org/soap/http" />
        <operation name="Add">
          <soap:operation soapAction="Add" style="document" />
          <input>
            <soap:body use="literal" />
          </input>
          <output>
            <soap:body use="literal" />
          </output>
        </operation>
        <operation name="Subtract">
          <soap:operation soapAction="Subtract" style="document" />
          <input>
            <soap:body use="literal" />
          </input>
          <output>
            <soap:body use="literal" />
          </output>
        </operation>
      </binding>
      <service name="CalculatorService">
        <port name="CalculatorSoap" binding="tns:CalculatorSoap">
          <soap:address location="http://localhost:3000/soap/calculation" />
        </port>
      </service>
    </definitions>


    `, // or xml (both options are valid)
  })
);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
