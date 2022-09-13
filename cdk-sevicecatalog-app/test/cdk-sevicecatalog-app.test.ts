import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as CdkSevicecatalogApp from '../lib/cdk-sevicecatalog-app-stack';
import { resolve } from 'path';
import { readFileSync } from 'fs';
import { env } from 'process';


// example test. To run these tests, uncomment this file along with the
// example resource in lib/cdk-sevicecatalog-app-stack.ts
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
