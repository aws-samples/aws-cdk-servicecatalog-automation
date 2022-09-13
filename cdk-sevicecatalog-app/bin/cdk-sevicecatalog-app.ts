#!/usr/bin/env node
import 'source-map-support/register';
import {App} from 'aws-cdk-lib';
import { CdkSevicecatalogAppStack } from '../lib/cdk-sevicecatalog-app-stack';
import { resolve } from 'path';
import { readFileSync } from 'fs';
import { env } from 'process';
const app = new App();
const sourcePath = app.node.tryGetContext("source")
const configLoc = resolve(__dirname, sourcePath);
const config = JSON.parse(readFileSync(configLoc, 'utf-8'));


new CdkSevicecatalogAppStack(app, 'CdkSevicecatalogAppStack', {
  portfolios: config.portfolios,
  products: config.products,
  tagOption: config.tagOption,
  env:{
    account:process.env.CDK_DEPLOY_ACCOUNT||env.CDK_DEFAULT_ACCOUNT,
    region:process.env.CDK_DEPLOY_REGION||env.CDK_DEFAULT_REGION
  }
});

