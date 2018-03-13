.PHONY: docker-build docker-run docker-test docker-remove docker-push docker-login

NAME   := os-viewer
REPO   := openspending/${NAME}
TAG    := $(shell git log -1 --pretty=format:"%h")
IMG    := ${REPO}:${TAG}
LATEST := ${REPO}:latest

docker-build:
	docker build -t ${IMG} -t ${LATEST} .

docker-run:
	docker run ${RUN_ARGS} --name ${NAME} -d ${LATEST}

docker-test:
	docker ps | grep latest
	docker exec ${NAME} npm test

docker-remove:
	docker rm -f ${NAME}

docker-push:
	docker push ${IMG}
	if [ "$TRAVIS_PULL_REQUEST" == "false" ] && [ "$TRAVIS_BRANCH" == "master" ]; then
		docker push ${LATEST}
	fi

docker-login:
	docker login -u ${DOCKER_USERNAME} -p ${DOCKER_PASSWORD}
