#!/usr/bin/env node
/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
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

