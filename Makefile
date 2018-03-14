.PHONY: build run test remove push login

NAME   := os-viewer
REPO   := openspending/${NAME}
TAG    := $(shell git log -1 --pretty=format:"%h")
IMG    := ${REPO}:${TAG}
LATEST := ${REPO}:latest

build:
	docker build -t ${IMG} -t ${LATEST} .

run:
	docker run ${RUN_ARGS} --name ${NAME} -d ${LATEST}

test:
	docker ps | grep latest
	docker exec ${NAME} npm test

remove:
	docker rm -f ${NAME}

push:
	docker push ${IMG}
	if [ "$TRAVIS_PULL_REQUEST" == "false" ] && [ "$TRAVIS_BRANCH" == "master" ]; then
		docker push ${LATEST}
	fi

login:
	docker login -u ${DOCKER_USERNAME} -p ${DOCKER_PASSWORD}
