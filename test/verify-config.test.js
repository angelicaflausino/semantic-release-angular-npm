import test from "ava";
import { stub } from "sinon";
import verify from "../lib/verify-config.js";

test.beforeEach((t) => {
  // Stub the logger functions
  t.context.log = stub();
  t.context.logger = { log: t.context.log };
});

test('Verify "npmPublish", "tarballDir", "pkgRoot" and "ngPackageFilePath" options', async (t) => {
  t.deepEqual(await verify({ npmPublish: true, tarballDir: "release", pkgRoot: "dist", ngPackageFilePath: "./ng-package.json" }, {}, t.context.logger), []);
});

test('Return SemanticReleaseError if "npmPublish" option is not a Boolean', async (t) => {
  const npmPublish = 42;
  const [error, ...errors] = await verify({ npmPublish }, {}, t.context.logger);

  t.is(errors.length, 0);
  t.is(error.name, "SemanticReleaseError");
  t.is(error.code, "EINVALIDNPMPUBLISH");
});

test('Return SemanticReleaseError if "tarballDir" option is not a String', async (t) => {
  const tarballDir = 42;
  const [error, ...errors] = await verify({ tarballDir }, {}, t.context.logger);

  t.is(errors.length, 0);
  t.is(error.name, "SemanticReleaseError");
  t.is(error.code, "EINVALIDTARBALLDIR");
});

test('Return SemanticReleaseError if "pkgRoot" option is not a String', async (t) => {
  const pkgRoot = 42;
  const [error, ...errors] = await verify({ pkgRoot }, {}, t.context.logger);

  t.is(errors.length, 0);
  t.is(error.name, "SemanticReleaseError");
  t.is(error.code, "EINVALIDPKGROOT");
});

test('Return SemanticReleaseError if "ngPackageFilePath" option is not a String', async (t) => {
  const ngPackageFilePath = 42;
  const [error, ...errors] = await verify({ ngPackageFilePath }, {}, t.context.logger);

  t.is(errors.length, 0);
  t.is(error.name, "SemanticReleaseError");
  t.is(error.code, "EINVALIDNGPACKAGEFILEPATH");
});

test("Return SemanticReleaseError Array if multiple config are invalid", async (t) => {
  const npmPublish = 42;
  const tarballDir = 42;
  const pkgRoot = 42;
  const ngPackageFilePath = 42;
  const [error1, error2, error3, error4] = await verify({ npmPublish, tarballDir, pkgRoot, ngPackageFilePath }, {}, t.context.logger);

  t.is(error1.name, "SemanticReleaseError");
  t.is(error1.code, "EINVALIDNPMPUBLISH");

  t.is(error2.name, "SemanticReleaseError");
  t.is(error2.code, "EINVALIDTARBALLDIR");

  t.is(error3.name, "SemanticReleaseError");
  t.is(error3.code, "EINVALIDPKGROOT");

  t.is(error4.name, "SemanticReleaseError");
  t.is(error4.code, "EINVALIDNGPACKAGEFILEPATH");
});
