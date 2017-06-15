var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var faker = require("faker");
var _ = require("lodash");
var dateFormat = require('dateformat');
var CPF = require("cpf_cnpj").CPF;
var CNPJ = require("cpf_cnpj").CNPJ;

function getDados(recurso, pSize) {

  switch (recurso) {

    case 'contas':
      return _.times(pSize, function(n) {
        return {
          numeroLayout: 1,
          numeroLinhaArquivo: 1,
          dataAlteracaoRegistro: dateFormat(faker.date.between('2015-01-01', '2017-12-31'), "dd/MM/yyyy HH:mm"),
          excluido: 0,
          codigoEntidade: 1,
          codigoRegional: 7,
          nomeSistema: "CRM",
          cnpj: CNPJ.generate(true),
          dataCriacaoConta: dateFormat(faker.date.between('2015-01-01', '2017-12-31'), "dd/MM/yyyy HH:mm"),
          razaoSocial: faker.company.companyName()
        }
      });

    case 'contatos':
      return _.times(pSize, function(n) {
        return {
          numeroLayout: 2,
          numeroLinhaArquivo: 1,
          dataAlteracaoRegistro: dateFormat(faker.date.between('2015-01-01', '2017-12-31'), "dd/MM/yyyy HH:mm"),
          excluido: 0,
          codigoEntidade: 1,
          codigoRegional: 7,
          nomeSistema: 'CRM',
          cnpj: CNPJ.generate(true),
          dataContato: dateFormat(faker.date.between('2015-01-01', '2017-12-31'), "dd/MM/yyyy HH:mm"),
          nomePessoaFisica: faker.name.findName(),
          cargoPessoaFisica: faker.name.jobType(),
          telefonePessoaFisica: faker.helpers.replaceSymbolWithNumber("(##) 9####-#### "),
          emailPessoaFisica: faker.internet.email()
        }
      });


    default:
      return 'Not found data'


  }


}

//enable CORS for request verbs
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
  next();
});

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

app.get('/:recurso/', function(req, res) {

  //console.log(JSON.stringify(req.headers));


  faker.locale = "pt_BR";

  console.log(req.params.recurso)
  console.log(req.headers.authorization);
  console.log(req.query.pageSize);
  console.log(req.query.pageNumber);
  console.log(req.query.dataModificacao);


  var pNumber = new Number(req.query.pageNumber);
  var pSize = new Number(req.query.pageSize);
  var recurso = req.params.recurso;

  if (req.headers.authorization !== 'token') {
    res.status(401);
    res.end("authentication is required and has failed or has not yet been provided");
  } else {

    var dados = getDados(recurso, pSize);

    var retorno = new Object();

    retorno.content = dados;
    retorno.numberOfElements = pSize;
    retorno.number = pNumber;
    retorno.size = pSize;
    retorno.totalPages = 2;
    retorno.totalElements;
    retorno.last = pNumber == retorno.totalPages ? true : false;
    retorno.firt = pNumber == 1 ? true : false;

    res.type('json');
    res.end(
      JSON.stringify(
        retorno
      )
    );
  }


});

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "0.0.0.0";
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;

var server = app.listen(port, ipaddress, function() {
  console.log("Listening on " + ipaddress + ", server_port " + port)

})