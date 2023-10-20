#!/bin/sh -e
LAMBDAS=$1

npx webpack --env lambdas=${LAMBDAS}

bundle_dir="build/bundle/"
artefact_dir="artefacts/"
version_num=$(jq -r '.version' < package.json | cut -d . -f 1,2).$(date +%s)
git_rev=$(git rev-parse --short HEAD)
ignore_func_prefix="local"

mkdir -p ${artefact_dir}
functions=$(npx yaml2json serverless.yml | jq -r '.functions | keys | .[]')
for func_name in ${functions}; do
  if [[ $func_name == *"$ignore_func_prefix"* ]]; then
  continue
  fi
  if [ -z ${LAMBDAS} ] || echo ${LAMBDAS} | grep ${func_name}; then
    bundle_path="${bundle_dir}${func_name}.js"
    zip_filename="${func_name}-${version_num}-${git_rev}.zip"
    zip_path="${artefact_dir}${zip_filename}"
    zip -Xj ${zip_path} ${bundle_path}
    echo "LAMBDA ARTIFACT: ${bundle_path} => ${zip_path}"
  fi
done

if [ -d coverage ]; then
  coverage_filename="driver-coverage-${version_num}-${git_rev}.zip"
  coverage_path="${artefact_dir}${coverage_filename}"
  zip ${coverage_path} coverage
  echo "COVERAGE ARTIFACT: coverage => ${coverage_path}"
else
  echo "No coverage report found"
fi
