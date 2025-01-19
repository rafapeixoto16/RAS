#!/bin/bash
set -e

# Usage:
# ./scripts/build-docker
# ./scripts/build-docker true localhost:5000 tag

TAG=${3:-latest}

docker build -t web:$TAG -f scripts/web.Dockerfile .

if [[ "$1" == "true" ]]; then
  docker tag web:$TAG $2/web:$TAG
  docker push $2/web:$TAG
fi

SUBPROJECTS=(
  "api-gateway"
  "auto-adjust-filter"
#  "binarization-filter"
#  "borders-add-filter"
#  "brightness-filter"
#  "contrast-filter"
#  "cropping-filter"
#  "grayscale-filter"
#  "object-identification-filter"
#  "ocr-filter"
#  "person-count-filter"
  "projects-ms"
#  "remove-bg-filter"
#  "resize-filter"
#  "rotate-filter"
#  "saturation-filter"
#  "smart-crop-filter"
  "subscriptions-ms"
  "users-ms"
  "watermark-filter"
  "ws-gateway"
)

for PROJECT in "${SUBPROJECTS[@]}"; do
  IMAGE_NAME="$PROJECT:$TAG"
  docker build --build-arg SUBPROJECT=$PROJECT -t $IMAGE_NAME -f scripts/picturas.Dockerfile .

  if [[ "$1" == "true" ]]; then
    docker tag $IMAGE_NAME $2/$IMAGE_NAME
    docker push $2/$IMAGE_NAME
  fi
done
