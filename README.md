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
      - uses: chrislennon/action-drone@v1
        with:
          version: '0.8.1'
      - run: drone info
        env:
          DRONE_SERVER: ${{ secrets.DRONE_SERVER }}
          DRONE_TOKEN: ${{ secrets.DRONE_TOKEN }}
````
