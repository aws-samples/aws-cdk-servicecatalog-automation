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
import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Portfolio, Product, CloudFormationProduct, CloudFormationTemplate, TagOptions } from 'aws-cdk-lib/aws-servicecatalog';
import { Role, AccountRootPrincipal, User,Group } from 'aws-cdk-lib/aws-iam';
import { join } from 'path'


export interface ProtfolioCDKProps {
  portfolioName: string;
  providerName: string;
  description?: string;
  roles?: string[];
  users?: string[];
  groups?: string[];
}

export interface TagOption {
  key: string;
  value: string[];

}

export interface DeployWithStackSetProps {
  accounts: string[];
  regions: string[];
  stackSetAdministrationRoleName:string;
  stackSetExecutionRoleName: string;

}

export interface ProductProps {
  portfolioName: string
  productName: string;
  productVersionName: string;
  owner: string;
  templatePath: string;
  deployWithStackSets?: DeployWithStackSetProps;

}

export interface CdkSevicecatalogAppStackProps extends StackProps {
  portfolios: ProtfolioCDKProps[],
  tagOption?: TagOption[],
  products: ProductProps[]
}

/**
 * This is Stack class for the cloud formation Stack . 
 */
export class CdkSevicecatalogAppStack extends Stack {
  readonly portfolioDictionary: { [name: string]: Portfolio } = {}
  constructor(scope: Construct, id: string, props: CdkSevicecatalogAppStackProps) {
    super(scope, id, props);
    const { portfolios, products, tagOption } = props
    let allowedTagOptions: any
    if (tagOption) {
      allowedTagOptions = this.createTagOptions(id, tagOption)
    }

    for (let i = 0; i < portfolios.length; i++) {
      const portfolioObj = portfolios[i]
      const portfolio = this.createProtfolio("portfolio_" + i, portfolioObj, allowedTagOptions);

      if (this.portfolioDictionary.hasOwnProperty(portfolioObj.portfolioName)) {
        throw new Error(`${portfolioObj.portfolioName} portfolio is already exists in config`);
      } else {
        this.portfolioDictionary[portfolioObj.portfolioName] = portfolio
      }

    }
    for (let i = 0; i < products.length; i++) {
      const product = products[i]
      this.createProduct("product_" + i, product);
    }
 
  }
  /**
   * This method is to create Service catalog portfolio
   * @param id 
   * @param protfolio 
   * @param tagOption 
   * @returns 
   */
  createProtfolio(id: string, protfolio: ProtfolioCDKProps, tagOption?: TagOptions) {
    const { portfolioName, providerName, description, roles,users,groups } = protfolio

    const port = new Portfolio(this, id, {
      displayName: portfolioName,
      providerName,
      description
    });
    if (roles != undefined) {
      for (let i = 0; i < roles.length; i++) {
        let roleIns = Role.fromRoleName(this, id + "_role_" + i, roles[i])
        port.giveAccessToRole(roleIns)

      }
    } 
    if(users!=undefined){
      for(let i=0; i< users.length;i++){
        let userIns= User.fromUserName(this,id+"_user_"+i,users[i])
        port.giveAccessToUser(userIns)
      }
    }
    if(groups!=undefined){
      for(let i=0; i< groups.length;i++){
        let groupIns= Group.fromGroupName(this,id+"_group_"+i,groups[i])
        port.giveAccessToGroup(groupIns)
      }
    }

    if (tagOption) {
      port.associateTagOptions(tagOption);
    }
    return port
  }

  createTagOptions(id: string, tagOptions: TagOption[]) {
    let allowedValuesForTags: { [name: string]: string[] } = {};
    for (let i = 0; i < tagOptions.length; i++) {
      const tag = tagOptions[i]
      allowedValuesForTags[tag.key] = tag.value;
    }
    return new TagOptions(this, id + '_tagOption', {
      allowedValuesForTags
    })
  }

  /**
   * 
   * @param id This method used to create the Service Catalog Products
   * @param product 
   * @returns 
   */
  createProduct(id: string, product: ProductProps) {
    const { productName, owner, productVersionName, templatePath, portfolioName, deployWithStackSets } = product
    const pro = new CloudFormationProduct(this, id, {
      productName,
      owner,
      productVersions: [
        {
          productVersionName: productVersionName,
          cloudFormationTemplate: CloudFormationTemplate.fromAsset(join(__dirname, templatePath)),
        },
      ]
    })
    if (this.portfolioDictionary[portfolioName] == undefined) {
      throw new Error(`${portfolioName} protfolio is not exists in config.Make sure config with name is exists`);

    } else {
      const prof = this.portfolioDictionary[product.portfolioName]
      prof.addProduct(pro);
      this.deploywithStackset(prof, pro, deployWithStackSets);
    }
    return pro;


  }
  /**
   * This method is used to ad constriants to enable service catalog product. 
   * @param prof 
   * @param product 
   * @param deployWithStackSets 
   */
  deploywithStackset(prof: Portfolio, product: Product, deployWithStackSets?: DeployWithStackSetProps) {
    if (deployWithStackSets) {
      const { accounts, stackSetAdministrationRoleName,stackSetExecutionRoleName, regions } = deployWithStackSets;

       const adminRole=Role.fromRoleName(this,product.productId+"_deployWithStackset",stackSetAdministrationRoleName)

      prof.deployWithStackSets(product, {
        accounts,
        regions,
        adminRole,
        executionRoleName:stackSetExecutionRoleName,
        allowStackSetInstanceOperations: true,
      });
    }
  }
}
