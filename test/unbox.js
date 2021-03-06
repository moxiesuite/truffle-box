var path = require("path");
var fs = require("fs-extra");
var assert = require("assert");

var Box = require("../");

var MOXIE_BOX_DEFAULT = "git@github.com:moxiesuite/moxie-init-default.git";

describe("Unbox", function() {
  var destination = path.join(__dirname, ".moxie_test_tmp");

  before("mkdir", function(done) {
    fs.ensureDir(destination, done);
  });

  after("remove tmp dir", function(done) {
    fs.remove(destination, done);
  });

  it("unboxes moxie box from github", function() {
    this.timeout(5000);

    return Box.unbox(MOXIE_BOX_DEFAULT, destination)
      .then(function (moxieConfig) {
        assert.ok(moxieConfig);

        assert(
          fs.existsSync(path.join(destination, "moxie.js")),
          "Unboxed project should have moxie config."
        );
      });
  });

  it("ignores files listed in the moxie-init.json file, and removes the moxie-init.json file", function() {
    // Assert the file is not there first.
    assert(fs.existsSync(path.join(destination, "moxie-init.json")) == false, "moxie-init.json shouldn't be available to the user!");

    // Now assert the README.md and the .gitignore file were removed.
    assert(fs.existsSync(path.join(destination, "README.md")) == false, "README.md didn't get removed!");
    assert(fs.existsSync(path.join(destination, ".gitignore")) == false, ".gitignore didn't get removed!");
  });

  it("won't re-init if anything exists in the destination folder", function(done) {
    this.timeout(5000);

    var contracts_directory = path.join(destination, "contracts");

    // Assert our precondition
    assert(fs.existsSync(contracts_directory), "contracts directory should exist for this test to be meaningful");

    fs.remove(contracts_directory, function(err) {
      if (err) return done(err);

      Box.unbox(MOXIE_BOX_DEFAULT, destination)
        .then(function(boxConfig) {
          assert(
            fs.existsSync(contracts_directory) == false,
            "Contracts directory got recreated when it shouldn't have"
          );
          done();
        })
        .catch(function(e) {
          if (e.message.indexOf("Something already exists at the destination.") >= 0) {
            done();
          } else {
            done(new Error("Unknown error received: " + e.stack));
          }
        });
    });
  });
});
