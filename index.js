var log = require('logger')('service-pages');
var bodyParser = require('body-parser');

var auth = require('auth');
var throttle = require('throttle');
var serandi = require('serandi');
var model = require('model');
var Pages = require('model-pages');

module.exports = function (router, done) {
    router.use(serandi.many);
    router.use(serandi.ctx);
    router.use(auth({
        GET: [
            '^\/$',
            '^\/.*'
        ]
    }));
    router.use(throttle.apis('pages'));
    router.use(bodyParser.json());

    router.post('/',
      serandi.json,
      serandi.create(Pages),
      function (req, res, next) {
        model.create(req.ctx, function (err, location) {
            if (err) {
                return next(err);
            }
            res.locate(location.id).status(201).send(location);
        });
    });

    router.post('/:id',
      serandi.json,
      serandi.transit({
          workflow: 'model',
          model: Pages
      }));

    router.get('/:id',
      serandi.findOne(Pages),
      function (req, res, next) {
        model.findOne(req.ctx, function (err, location) {
            if (err) {
              return next(err);
            }
            res.send(location);
        });
    });

    router.put('/:id',
      serandi.json,
      serandi.update(Pages),
      function (req, res, next) {
        model.update(req.ctx, function (err, location) {
          if (err) {
            return next(err);
          }
          res.locate(location.id).status(200).send(location);
        });
    });

    router.get('/',
      serandi.find(Pages),
      function (req, res, next) {
        model.find(req.ctx, function (err, pages, paging) {
            if (err) {
                return next(err);
            }
            res.many(pages, paging);
        });
    });

    router.delete('/:id',
      serandi.remove(Pages),
      function (req, res, next) {
        model.remove(req.ctx, function (err) {
        if (err) {
          return next(err);
        }
        res.status(204).end();
      });
    });

    done();
};

