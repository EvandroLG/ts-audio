#!/bin/bash
rm -rf dist/*; bunx microbundle build --entry src/index.ts --name ts-audio --tsconfig tsconfig.json
