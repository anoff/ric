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
