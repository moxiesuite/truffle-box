var path = require("path");
var fs = require("fs-extra");
var assert = require("assert");

var Box = require("../");

var TRUFFLE_BOX_DEFAULT = "git@github.com:trufflesuite/truffle-init-default.git";

describe("Unbox", function() {
  var config = {
    logger: {
      log: function() {}
    },
    working_directory: path.join(__dirname, ".truffle_test_tmp")
  };
  var destination = config.working_directory;

  before("mkdir", function(done) {
    fs.ensureDir(config.working_directory, done);
  });

  before("remove tmp dir", function(done) {
    fs.remove(config.working_directory, done);
  });

  it("unboxes truffle box from github", function() {
    this.timeout(5000);

    return Box.unbox(config, TRUFFLE_BOX_DEFAULT, destination)
      .then(function (truffleConfig) {
        assert.ok(truffleConfig);

        assert(
          fs.existsSync(path.join(destination, "truffle.js")),
          "Unboxed project should have truffle config."
        );
      });
  });
});