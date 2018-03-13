.PHONY: docker-build docker-run docker-test docker-remove push login

NAME   := os-viewer
REPO   := openspending/${NAME}
TAG    := $(shell git log -1 --pretty=format:"%h")
IMG    := ${NAME}:${TAG}
LATEST := ${NAME}:latest

docker-build:
	docker build -t ${IMG} -t ${LATEST} .

docker-run:
	docker run ${RUN_ARGS} --name ${NAME} -d ${LATEST}

docker-test:
	docker ps | grep latest
	docker exec ${NAME} npm test

docker-remove:
	docker rm -f ${NAME}

push:
	docker push ${REPO}

login:
	docker log -u ${DOCKER_USER} -p ${DOCKER_PASS}
