# R.I.C

> The personal Robot Interaction Companion

<!-- TOC depthFrom:2 -->

- [Architecture](#architecture)
  - [System overview](#system-overview)
  - [ROS interaction](#ros-interaction)
- [Usage](#usage)
- [✏️ authors](#-authors)
- [⚖️ License](#-license)

<!-- /TOC -->

## Architecture

### System overview

![Deployment View](http://www.plantuml.com/plantuml/proxy?cache=no&src=https://raw.github.com/anoff/ric/master/assets/deployment.iuml)

|Component|Description|
|----|---|
|Robot Server|Runs the ROS system of the Cobot.|
|Motion Terminal|Fest VTEM module for transforming ROS commands into pneumatic pressure at the robot joints|
|Bionic Cobot|Festo humanoid robot arm|
|Control Server|Runs Node.js to control the game flow via state machine and interact with the robot server via ROS bridge messages|
|Referee Server/LiDAR|Creates a virtual wall using the LiDAR to make sure players do not enter the game area before the game starts|
|Amazon Alexa|Natural speech interface to start the R.I.C. via `Alexa start RIC [ric]` and get results of the last game|
|Amazon Web Services|The backend running the Alexa program and sotring the game scores|

### ROS interaction

For developing the `Control Server` Festo provided a Virtual Machine with a Cobot simulator. This allows to run the `Control Server` offline without access to the real hardware.

![Development](http://www.plantuml.com/plantuml/proxy?cache=no&src=https://raw.github.com/anoff/ric/master/assets/system.iuml)

## Usage

`$ node rosjs/index.js --ros_master <ros_master_ip>`

## ✏️ authors

* Tim Großmann
  * [Github](http://github.com/timgrossmann)
  * [Twitter](https://twitter.com/timigrossmann)
* Andreas Offenhaeuser
  * [Website](http://anoff.io)
  * [Twitter](https://twitter.com/an0xff)

## ⚖️ License

The code is licensed under [GPLv3](LICENSE), the ROS message and service definitions are (C) by Festo and all images are published under [CC-by-4.0](http://creativecommons.org/licenses/by/4.0/)
