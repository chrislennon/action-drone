# action-drone

Action to install drone-cli and make it available to further steps

## Usage

Example
````yaml
name: Test

on:
  push

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v1
      - uses: chrislennon/action-drone@v1
        with:
          version: '1.1.4'
````
