#!/bin/bash
echo "Change directory"
cd cdk-sevicecatalog-app
echo "Running cdk destroy"
cdk destroy -c source=../../config/config.json