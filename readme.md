# R.I.C

> The personal Robot Interaction Companion

<!-- TOC depthFrom:2 -->

- [Demo](#demo)
- [Architecture](#architecture)
  - [System overview](#system-overview)
  - [ROS interaction](#ros-interaction)
  - [Game Design](#game-design)
- [Installation](#installation)
  - [Referee Server](#referee-server)
  - [Control Server](#control-server)
  - [Alexa](#alexa)
- [Usage](#usage)
  - [Referee Server](#referee-server-1)
  - [Control Server](#control-server-1)
  - [Cobot](#cobot)
- [✏️ authors](#-authors)
- [⚖️ License](#-license)

<!-- /TOC -->

## Demo

See R.I.C. in action:

[![R.I.C. Demo](https://img.youtube.com/vi/lkPGenAMyrg/0.jpg)](https://www.youtube.com/watch?v=lkPGenAMyrg)

## Architecture

### System overview

![Deployment View](http://www.plantuml.com/plantuml/proxy?cache=no&src=https://raw.github.com/anoff/ric/master/assets/deployment.iuml)

|Component|Description|
|----|---|
|Robot Server|Runs the ROS system of the Cobot.|
|Motion Terminal|Fest VTEM module for transforming ROS commands into pneumatic pressure at the robot joints|
|Bionic Cobot|Festo humanoid robot arm|
|Control Server|Runs Node.js to control the game flow via state machine and interact with the robot server via ROS bridge messages|
|Referee Server/LiDAR|Placed Vertically in front of our R.I.C. System, the referee measures the reaction time and also makes sure that the next iteration of the game will only be started once the players hand is completely removed from the game area.|
|Amazon Alexa|Natural speech interface to start the R.I.C. via `Alexa start RIC [ric]` and get results of the last game|
|Amazon Web Services|The backend running the Alexa program and sotring the game scores|

### ROS interaction

For developing the `Control Server` Festo provided a Virtual Machine with a Cobot simulator. This allows to run the `Control Server` offline without access to the real hardware.

![Development](http://www.plantuml.com/plantuml/proxy?cache=no&src=https://raw.github.com/anoff/ric/master/assets/system.iuml)

### Game Design

The following shows the games state machine. The implementation can be found under [rosjs/lib/game.js](rosjs/lib/game.js).

![Game Statemachine](http://www.plantuml.com/plantuml/proxy?cache=no&src=https://raw.github.com/anoff/ric/master/assets/statemachine.iuml)

## Installation

### Referee Server
> Note: In order to discover the RPLIDAR sensor on your COM ports, you need to install the driver.   
[Download the driver from here](https://www.silabs.com/products/development-tools/software/usb-to-uart-bridge-vcp-drivers)

Install dependencies using:

```
pip install rplidar requests numpy
```

### Control Server

Install the NPM dependencies using

```sh
cd control-server
npm install
```

### Alexa

Publish the Skill available in `/alexa` to a development account connected with our local Alexa device.

## Usage

### Referee Server

Start the referee server using

`$ python referee-server/lidar_referee.py`


### Control Server

Start the control server using

`$ node control-server/index.js --ros_master <ros_master_ip>`

### Cobot

The Cobot is running V1.1 and a modified pressure regulation on the VTEM which allows R.I.C. to detect collissions earlier on without going into failure mode.

## ✏️ authors

* Simone Spiegler
  * [Twitter](https://twitter.com/simone_spiegler)
* Frederik Held
  * [Github](http://github.com/frederikheld)
  * [Twitter](https://twitter.com/frederikheld)
  * [Website](https://frederikheld.de)
* Tim Großmann
  * [Github](http://github.com/timgrossmann)
  * [Twitter](https://twitter.com/timigrossmann)
* Andreas Offenhaeuser
  * [Github](http://github.com/anoff)
  * [Website](https://anoff.io)
  * [Twitter](https://twitter.com/an0xff)
* Patrick Bunda
  * [Github](http://github.com/paddybun)

## ⚖️ License

The code is licensed under [GPLv3](LICENSE), the ROS message and service definitions are (C) by Festo and all images are published under [CC-by-4.0](http://creativecommons.org/licenses/by/4.0/)
