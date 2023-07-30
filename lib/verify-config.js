import { isBoolean, isNil, isString } from "lodash-es";
import getError from "./get-error.js";

const isNonEmptyString = (value) => isString(value) && value.trim();

const VALIDATORS = {
  npmPublish: isBoolean,
  tarballDir: isNonEmptyString,
  pkgRoot: isNonEmptyString,
  ngPackageFilePath: isNonEmptyString
};

export default function ({ npmPublish, tarballDir, pkgRoot, ngPackageFilePath  }) {
  const errors = Object.entries({ npmPublish, tarballDir, pkgRoot, ngPackageFilePath }).reduce(
    (errors, [option, value]) =>
      !isNil(value) && !VALIDATORS[option](value)
        ? [...errors, getError(`EINVALID${option.toUpperCase()}`, { [option]: value })]
        : errors,
    []
  );

  return errors;
}
