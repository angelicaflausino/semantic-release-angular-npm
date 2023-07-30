import path from "path";
import { move } from "fs-extra";
import { execa } from "execa";

export default async function (
  npmrc,
  { tarballDir, pkgRoot, ngPackageFilePath },
  { cwd, env, stdout, stderr, nextRelease: { version }, logger }
) {
  const basePath = pkgRoot ? path.resolve(cwd, pkgRoot) : cwd;

  logger.log("Write version %s to package.json in %s", version, basePath);

  const versionResult = execa(
    "npm",
    ["version", version, "--userconfig", npmrc, "--no-git-tag-version", "--allow-same-version"],
    {
      cwd: basePath,
      env,
      preferLocal: true,
    }
  );
  versionResult.stdout.pipe(stdout, { end: false });
  versionResult.stderr.pipe(stderr, { end: false });

  await versionResult;

  if(ngPackageFilePath) {
    logger.log("Executing ng-packagr from %s", ngPackageFilePath);

    const ngPkr = execa("ng-packagr", ["-p", ngPackageFilePath]);
    ngPkr.stdout.pipe(stdout, { end: false });
    ngPkr.stderr.pipe(stderr, { end: false });
    
    await ngPkr;
  }
  
  if (tarballDir) {
    logger.log("Creating npm package version %s", version);
    const packResult = execa("npm", ["pack", basePath, "--userconfig", npmrc], { cwd, env, preferLocal: true });
    packResult.stdout.pipe(stdout, { end: false });
    packResult.stderr.pipe(stderr, { end: false });

    const tarball = (await packResult).stdout.split("\n").pop();
    const tarballSource = path.resolve(cwd, tarball);
    const tarballDestination = path.resolve(cwd, tarballDir.trim(), tarball);

    // Only move the tarball if we need to
    // Fixes: https://github.com/semantic-release/npm/issues/169
    if (tarballSource !== tarballDestination) {
      await move(tarballSource, tarballDestination);
    }
  }
}
