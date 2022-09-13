#!/bin/bash
echo "Changing Folder to CDK Application"
echo "Deploying the solution in "$CDK_DEFAULT_ACCOUNT" account in "$CDK_DEFAULT_REGION" region"
export CDK_DEPLOY_ACCOUNT=$CDK_DEFAULT_ACCOUNT
export CDK_DEPLOY_REGION=$CDK_DEFAULT_REGION
echo $CDK_DEPLOY_REGION
echo $CDK_DEPLOY_ACCOUNT
cdk bootstrap aws://$CDK_DEPLOY_ACCOUNT/$CDK_DEPLOY_REGION
cd cdk-sevicecatalog-app
echo "bootstrap the Account"
npm install
echo "Running NPM Install"

echo "Running CDK Deploy"
cdk deploy -c source=../../config/config.json 
echo "cdk Deploy execution Completed"
