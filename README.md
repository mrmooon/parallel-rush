## Parallel rush

This is a JavaScript game developed with Phaser (game framework) as an university project with [gomupo](https://github.com/gomupo).
I wanted to make it easier to try it  out so I dockerized it. Have fun with it!

## Build

To get the game started you've got two options, either running it directly with Node.js or deploying it in a Docker container

### Deploying it on docker
The first time you want to try it out you need to build the docker image and create the container with it.

#### Prerequisites

In order to run this container you'll need docker installed.

* [Windows](https://docs.docker.com/windows/started)
* [OS X](https://docs.docker.com/mac/started/)
* [Linux](https://docs.docker.com/linux/started/)

#### Build the images
To build the image run:

`docker build -t parallel-rush .`

#### Run it
To start the container run:

`docker run --name parallel-rush -p 3000:3000 -d parallel-rush`

This will start the container in detached mode.

#### Stop it
To stop the container run:

`docker stop parallel-rush`

#### Restart it
The next time you want to restart the container you can run:

`docker start parallel-rush `

### Running it with nodejs

If you already have Node.js configured in your machine you may want run it with:
 `node app.js` 

## Playing

There's an extensive guide covering the game's basics in the project report appendix, which can be found [here](../blob/master/Memoria_GuiaDeJuego.pdf)

## Authors
Gonzalo Muelas Pozo aka [gomupo](https://github.com/gomupo) for the game assets and your part of the coding, m8 you are the mos talented guy!
Iñigo Alvaro Saenz [mrmooon](https://github.com/mrmooon)

# Aknowledgements

[PurpleBooth](https://gist.github.com/PurpleBooth) for the [README.md gist](https://gist.github.com/PurpleBooth/ea518ae68a49029bae95#file-template-readme-for-containers-md) for containers.
