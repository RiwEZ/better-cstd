#!/bin/bash

IMAGE_NAME="better-cstd"

docker build -t $IMAGE_NAME .

# Check if the image build was successful
if [ $? -eq 0 ]; then
  echo "Docker image build successful."
else
  echo "Docker image build failed. Exiting."
  exit 1
fi

