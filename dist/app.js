"use strict";

require("@babel/runtime/regenerator");

var _express = _interopRequireDefault(require("express"));

var _mongodb = require("mongodb");

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _expressJsonValidatorMiddleware = require("express-json-validator-middleware");

var _validate_schema = _interopRequireDefault(require("./validate_schema"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var mongo_url = 'mongodb://39.106.73.59:443/';
var mongo_dbname = 'NEUP_fix';
var app = (0, _express["default"])();
var validator = new _expressJsonValidatorMiddleware.Validator({
  allErrors: true
});
var validate = validator.validate;
app.use(_bodyParser["default"].json());
app.use("/", _express["default"]["static"]("client-example"));
var client = new _mongodb.MongoClient(mongo_url, {
  useNewUrlParser: true
});
client.connect().then(function (Client) {
  var NEUP_fix = Client.db(mongo_dbname);
  var announcement = NEUP_fix.collection("announcement");
  var user_info = NEUP_fix.collection("user_info");
  app.get('/announcement', function (req, res) {
    announcement.find({}).toArray(function (error, result) {
      var pass_result = result.map(function (single_ann) {
        return {
          "annid": single_ann._id,
          "text": single_ann.text,
          "image": single_ann.image
        };
      });
      res.json(pass_result);
    });
  });
  app.post('/announcement', validate({
    body: _validate_schema["default"].announcement_post_body
  }), function (req, res) {
    announcement.insertOne(req.body)["catch"](function (reason) {
      throw reason;
    }); // TODO: add result judgement.加一个萌萌哒夹击妹抖

    res.status(200).end();
  });
  app["delete"]('/announcement/:annid', function (req, res) {
    announcement.deleteOne({
      "_id": (0, _mongodb.ObjectID)(req.params.annid)
    }).then(function (delete_result) {
      if (delete_result.deletedCount === 1) {
        res.status(200).end("delete successful.");
      } else {
        res.status(410).end("no such announcement.");
      }
    })["catch"](function (reason) {
      throw reason;
    });
  });
  app.patch('/announcement/:annid', validate({
    body: _validate_schema["default"].announcement_update_body
  }), function (req, res) {
    announcement.updateOne({
      "_id": (0, _mongodb.ObjectID)(req.params.annid)
    }, {
      $set: req.body
    }).then(function (result) {
      if (result.result.nModified === 1) {
        res.status(200).end("update successful");
      } else {
        res.status(410).end("target not found");
      }
    });
  });
  app.get('/user', validate({
    query: _validate_schema["default"].userId_get_query
  }), function (req, res) {
    user_info.find({
      userid: req.query.userid
    }).toArray(function (error, result) {
      if (result.length === 0) {
        res.status(410).end('no such user.');
      } else {
        var data_wait_for_send = [];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = result[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var item = _step.value;
            data_wait_for_send.push({
              userid: item.userid,
              name: item.name,
              avatar: item.avatar,
              signature: item.signature
            });
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator["return"] != null) {
              _iterator["return"]();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        res.json(data_wait_for_send);
      }
    });
  });
  app.put('/user', validate({
    query: _validate_schema["default"].userId_get_query,
    body: _validate_schema["default"].userId_put_body
  }), function (req, res) {
    user_info.updateOne({
      userid: req.query.userid
    }, {
      $set: req.body
    }).then(function (result) {
      if (result.result.nModified === 1) {
        res.status(200).end("update successful.");
      } else {
        res.status(410).end('no such user');
      }
    });
  }); // app.get()

  app.use(function (err, req, res, next) {
    if (err instanceof _expressJsonValidatorMiddleware.ValidationError) {
      // At this point you can execute your error handling code
      res.status(400).send('invalid request data.');
      next();
    } else next(err); // pass error on if not a validation error

  });
});
app.listen(8080);
//# sourceMappingURL=app.js.map