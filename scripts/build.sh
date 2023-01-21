#!/bin/bash

rm -rf dist/*; microbundle build --entry src/index.ts --name ts-audio --tsconfig tsconfig.json
