const jsonServer = require('json-server');
const argv = require('yargs').argv;

const server = jsonServer.create();
const router = jsonServer.router({
  countries: require('./db/countries')(),
  optionsYesNo: require('./db/optionsYesNo')(),
  optionsSelect: require('./db/optionsSelect')(),
  example: require('./db/example.json')
});

const middlewares = [
  jsonServer.defaults(),
  (req, res, next) => {
    // VALIDATION EXAMPLE
    // res.status(422).json([
    //   {
    //     questionId: 180,
    //     validationMessage: 'błąd 1'
    //   },
    //   { questionId: 181, validationMessage: 'błąd 2' },
    //   { questionId: 8302, validationMessage: 'błąd na masterze' },
    //   { questionId: 3000, validationMessage: 'błąd na dependent' }
    // ])

    // request delay
    setTimeout(next, 500);

    // if POST request payload is in different format, we need to prevent update data,
    // because we break the mock data and we will have to restart json-server
    if (req.method === 'POST') {
      req.method = 'GET';
      next()
    }
  }
];

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser);

server.use(
  jsonServer.rewriter({
    '/optionsSelect/*': '/optionsSelect',
    '/optionsYesNo/*': '/optionsYesNo',
  })
);

// Use default router
server.use(router);
server.listen(argv.port || 8181, () => {
  console.log('JSON Server is running')
});
