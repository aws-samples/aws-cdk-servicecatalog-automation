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
import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as CdkSevicecatalogApp from '../lib/cdk-sevicecatalog-app-stack';
import { resolve } from 'path';
import { readFileSync } from 'fs';

test('Service Catalog Portfolio', () => {
    const app = new cdk.App();
    const sourcePath = "../../config/config.json"
    const configLoc = resolve(__dirname, sourcePath);
    const config = JSON.parse(readFileSync(configLoc, 'utf-8'));
    // WHEN
    const stack = new CdkSevicecatalogApp.CdkSevicecatalogAppStack(app, 'MyTestStack',{
        portfolios: config.portfolios,
        products: config.products,
        tagOption: config.tagOption
    });
    // THEN
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ServiceCatalog::Portfolio', {
        DisplayName: "EC2 Product Profile"
    });
});
