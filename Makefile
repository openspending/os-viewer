.PHONY: ci-build ci-run ci-test ci-remove ci-push-tag ci-push-latest ci-login

NAME   := os-viewer
REPO   := openspending/${NAME}
TAG    := $(shell git log -1 --pretty=format:"%h")
IMG    := ${REPO}:${TAG}
LATEST := ${REPO}:latest

ci-build:
	docker build -t ${IMG} -t ${LATEST} .

ci-run:
	docker run ${RUN_ARGS} --name ${NAME} -d ${LATEST}

ci-test:
	docker ps | grep latest
	docker exec ${NAME} npm test

ci-remove:
	docker rm -f ${NAME}

ci-push-tag: login
	docker push ${IMG}

ci-push-latest: login
	docker push ${LATEST}

ci-login:
	docker login -u ${DOCKER_USERNAME} -p ${DOCKER_PASSWORD}
