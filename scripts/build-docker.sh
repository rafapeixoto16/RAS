#!/bin/bash
set -e

#docker build -t web:latest -f scripts/web.Dockerfile .

if [[ "$1" == "true" ]]; then
  docker tag web:latest localhost:5000/web:latest
  docker push localhost:5000/web:latest
fi

SUBPROJECTS=(
  "api-gateway"
#  "auto-adjust-filter"
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
  "smart-crop-filter"
  "subscriptions-ms"
  "users-ms"
#  "watermark-filter"
  "ws-gateway"
)

for PROJECT in "${SUBPROJECTS[@]}"; do
  IMAGE_NAME="${PROJECT}:latest"
  docker build --build-arg SUBPROJECT=${PROJECT} -t ${IMAGE_NAME} -f scripts/picturas.Dockerfile .

  if [[ "$1" == "true" ]]; then
    docker tag ${IMAGE_NAME} localhost:5000/${IMAGE_NAME}
    docker push localhost:5000/${IMAGE_NAME}
  fi
done
