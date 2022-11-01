#!/usr/bin/env bash
$(aws ecr get-login --region us-east-1)

echo "Building client docker image"
docker build -t rumineat-client .

echo "Tagging image as latest"
docker tag rumineat-client:latest 519227323843.dkr.ecr.us-east-1.amazonaws.com/rumineat-client:latest

echo "Push image to aws"
docker push 519227323843.dkr.ecr.us-east-1.amazonaws.com/rumineat-client:latest