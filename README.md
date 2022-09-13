# aws-cdk-servicecatalog-automation

This Pattern demonstrates the approach for provisioning AWS Service Catalog Portfolio & Products using CDK Application. This solution play major role for complex multi region/account Infrastructure deployment where single account can have AWS service catalog product defined under portfolio which deploy IAC to all other accounts defined in constraint.This will Ready to Use Solution to Provisioned Service catalog Products with having options to Deploy with Stack Set and Managed Tag Library .

# Prerequisites 
- An Active AWS Account.
- AWS Identity and Access Management Roles and permissions with Access to AWS Service Catalog, AWS CloudFormation 

# Product Versions
- AWS CDK v2 2.27.0


# Target Technology Stack
- AWS Service Catalog
- AWS CDK 
- TypeScript
- Shell Script


# Target Architecture 

This CDK application read configuration file and and provisioned the Service catalog portfolio and Product. This Template show case how we can provision multiple service catalog product in current account and region.  

- Service Catalog Admin will clone the repository
- This repository contains the CDK project binary and Cloud Formation Template for Service Catalog Products.
- User will update the config file with Portfolio, Product and IAM details.
- Once all changes are done then user will perform CDK deploy.
- This will create Service Catalog Portfolio defined in config files in account 1.
- Service Catalog Product will created under mentioned portfolio in config file in account 1.
- Portfolio has the constraint which has account 2 added, User will add the StackSet administrator and StackSet execution role in config.
- This will create products for all portfolio in account 2.


# Automation and Scale
Use CDK Application to automate the AWS resource creation of the Multiple service catalog portfolio and product. This CDK Application can integrated with AWS Code Pipeline.

# Tools
- AWS Service catalog - AWS Service Catalog allows organizations to create and manage catalogs of IT services that are approved for use on AWS. These IT services can include everything from virtual machine images, servers, software, and databases to complete multi-tier application architectures. AWS Service Catalog allows you to centrally manage deployed IT services and your applications, resources, and metadata. This helps you achieve consistent governance and meet your compliance requirements, while enabling users to quickly deploy only the approved IT services they need. With AWS Service Catalog App-Registry, organizations can understand the application context of their AWS resources. You can define and manage your applications and their metadata, to keep track of cost, performance, security, compliance and operational status at the application level.
- AWS CDK - The AWS CDK lets you build reliable, scalable, cost-effective applications in the cloud with the considerable expressive power of a programming language.


# Code
The code for this pattern is available on github, in the aws-cdk-servicecatalog-automation repository. The code repository contains the following files and folders:

- cdk-sevicecatalog-app folder - Contains Sample CDK Application for Service Catalog portfolio and Product Creation. 
- config folder - contains config.json file & the CloudFormation Template for service catalog product.
- config/config.json - contains all the configuration. You can update to add Profile. 
- config/templates - contains cloud formation template used by the product. 
- setup.sh - This script will deploy the service catalog portfolio & product.
- uninstall.sh - This script will clean up stack and AWS resources created. 

# Prerequisites
Make sure you have AWS CDK Toolkit  installed on your Terminal . To check execute below 
```
cdk --version
```
If AWS CDK Toolkit  is not installed then execute 
```
npm install -g aws-cdk@2.27.0
```
It AWS CDK Toolkit  version is lower than 2.27.0 then update to 2.27.0 
```
npm install -g aws-cdk@2.27.0 --force
```



# Setup your environment
To pull down the repo 
```
git clone https://github.com/aws-samples/aws-cdk-servicecatalog-automation.git
```
This creates a folder named `aws-cdk-servicecatalog-automation`
Run
``` 
cd aws-cdk-servicecatalog-automation
```

## Set up AWS credentials in Terminal
Export the following variables which refer to the AWS Account and region where the stack will be deployed:

export CDK_DEFAULT_ACCOUNT=<12 Digit AWS Account Number>

export CDK_DEFAULT_REGION=<AWS Region>
AWS Credentials for CDK can be provided through environment variables.


## Parameters Setup 
These are parameter for config.json file. 

- **portfolios:** List of Portfolio
    - **portfolioName:** The name of the portfolio.
    - **providerName:** The provider name.
    - **description:** Description for portfolio.
    - **roles:** [Optional] List of Role Name . It will Associate portfolio with an IAM Role.This Role must have permission to assumedBy 'servicecatalog.amazonaws.com'. Service catalog Product will be accessible to User of this Role.  
    - **users:** [Optional] List of IAM User Name . Associate portfolio with an IAM User.This Portfolio will accessible IAM user of the account. for more details
    - **groups:** [Optional] List of IAM Group Name. Associate portfolio with an IAM Group.This Portfolio will accessible   IAM user of the account. 
- **tagOption:** [Optional] Defines a set of TagOptions, which are a list of key-value pairs managed in AWS Service Catalog.This will  apply tags on the provisioned products . For more details 
    - **key:** Name of the Tag Key
    - **value:** Allowed String values for the Tags
- **products**
    - **portfolioName:** The name of the portfolio.
    - **productName:** The name of the product.
    - **owner:** The owner of the product.
    - **productVersionName** The name of the product version in string value.
    - **templatePath:** File Path of the cloudFormationTemplate for the Product.
    - **deployWithStackSets:** [Optional]A StackSets deployment constraint allows you to configure product deployment options using AWS CloudFormation StackSets. You can specify one or more accounts and regions into which stack instances will launch when the product is provisioned. For more details on  StackSets concepts
        - **accounts:** List of accounts to deploy stacks to target accounts.
        - **regions:** List of regions to deploy stacks to target accounts .
        - **stackSetAdministrationRoleName:** IAM role name used to administer the StackSets configuration in the source account. These should assume stackSetExecutionRole from target account .For  Example:AWSCloudFormationStackSetAdministrationRole  
        - **stackSetExecutionRoleName:** IAM role name from the target account which have trust policy with `stacksetAdministrationRoleName` role from source account . This IAM role is used to deploy the AWS resource in target account through stack set .This role should have permission to execute cloud formation and permission to create resources defined in CloudFormation template provided in templatePath field of the product config. For Example : AWSCloudFormationStackSetExecutionRole . 

Note if you are using the deployWithStackSets follow instruction to create stackSetAdministrationRoleName & stackSetExecutionRoleName in target account https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacksets-prereqs-self-managed.html#prereqs-self-managed-permissions





## Configure and Deploy the Service Catalog Portfolio & Product

In config.json user need to replace the IAM role name with role present in the account where you want to provision the Service Catalog Portfolio & Product. Sample available in config requires  stackSetAdministrationRoleName  as  "AWSCloudFormationStackSetAdministrationRole" Check if role is available in your source account .If its not present then follow instruction to create IAM role named  "AWSCloudFormationStackSetAdministrationRole" .The role must have this exact name. You can do this by creating a stack from the following AWS CloudFormation template, available online at https://s3.amazonaws.com/cloudformation-stackset-sample-templates-us-east-1/AWSCloudFormationStackSetAdministrationRole.yml.  For more details about the role refer: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacksets-prereqs-self-managed.html#prereqs-self-managed-permissions

```
{
    "portfolios": [
        {
            "displayName": "EC2 Product Portfolio",
            "providerName": "User1",
            "description": "Test1",
            "roles":[ "<Replace IAM RoleName who can access the Product>"],
            "users":["<Replace IAM User Name who can access the product>"],
            "groups":["<Replace IAM Group which can access the Product>"]

        },
        {
            "displayName": "Autoscaling Product Portfolio",
            "providerName": "User2",
            "description": "Test2",
            "roles": ["<Replace RoleName>"]
        }
    ],
    "tagOption": [
        {
            "key": "Group",
            "value": [
                "finance",
                "engineering",
                "marketing",
                "research"
            ]
        },
        {
            "key": "CostCenter",
            "value": [
                "01",
                "02",
                "03",
                "04"
            ]
        },
        {
            "key": "Environment",
            "value": [
                "dev",
                "prod",
                "stage"
            ]
        }
    ],
    "products": [
        {

            "portfolioName": "EC2 Product Profile"
            "productName": "Ec2",
            "owner": "owner1",
            "productVersionName": "v1",
            "templatePath": "../../config/templates/template1.json"
        },

            "portfolioName": "Autoscaling Product Profile"
            "productName": "autoscaling",
            "owner": "owner1",
            "productVersionName": "v1",
            "templatePath": "../../config/templates/template2.json",
             "deployWithStackSets": {
                "accounts": [
                    "012345678901",
                ],
                "regions": [
                    "us-west-2"
                ],
                "stackSetAdministrationRoleName":"AWSCloudFormationStackSetAdministrationRole",
                "stackSetExecutionRoleName": "AWSCloudFormationStackSetExecutionRole"
            }

        }
    ]
}

```

## Deploy the Solution 
Execute 
```
sh setup.sh 
```

This will install AWS CDK version mentioned in package.json of cdk-sevicecatalog-app folder and run cdk deploy. This will provisioned the Service catalog portfolio & Product.

## Review Service Catalog Product
Once CDK deploy executed successfully . 

Go to AWS Service Catalog Console . 

Under Provisioning Section you will see products you have mapped in the config file . For the sample we have used Cloud Formation Template for the EC2 & autoscaling. For walk through purpose we are referencing EC2 Product. This will create EC2 Instance with security group

Select any of the Product and click Launch Product. 

Here you can see following Sections
**Provisioned product name:**  There is check box selected Generate Name . If you want to give custom name You can uncheck and provide name as per your choice.

**Product Versions:** In this section you see product version name you given in the config file.

**Parameters:** In this section you can see the Parameter for cloud formation template. 

**Manage tags:** In this section you can see  the tagOption you provided in the config file as mandatory tags which enforce to apply the tags on the resources deployed by product.

Once CDK deploy executed successfully . 


## Deploy with Stack Set Execution
This solution is config driven If you want to provision product in Multiple target account . Then you need to add following configuration  in product config object in config.json file. 
```
"deployWithStackSets": {
                "accounts": [
                    "012345678901",
                ],
                "regions": [
                    "us-west-2"
                ],
  "stackSetAdministrationRoleName":"AWSCloudFormationStackSetAdministrationRole",
"stackSetExecutionRoleName": "AWSCloudFormationStackSetExecutionRole"
            }
```
You need to set the accounts where you want to deploy the resources from the service catalog product .
There is prerequisite to perform StackSet operation we need two IAM roles . One administrator(AWSCloudFormationStackSetAdministrationRole) IAM role in source account  and Execution Role (AWSCloudFormationStackSetExecutionRole) in Target Account . Follow the instruction to create these roles in respective accounts mode details https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacksets-prereqs-self-managed.html#prereqs-self-managed-permissions

## Add new Portfolio & Product
In  portfolios array in config/config.json file add below json with replacing values.
```
   {
      "portfolioName": "<portfolio Name>",
      "providerName": "<Provider Name>",
      "description": "<Description Optional>",
      "role": "<Replace RoleName >"
     }
```
In products array in config/config.json file add below json with replacing values. You can use existing Portfolio Name in below configuration .
```
   {
            "portfolioName": "<portfolio Name>"  
            "productName": "<Product Name>",
            "owner": "<Owner>",
            "productVersionName": "v1",
            "templatePath": "../../config/templates/<Name of the Template file.json or.yaml>",
            "deployWithStackSets": {
                "accounts": [
                    "**************",
                ],
                "regions": [
                    "us-west-2"
                ],
                "stackSetAdministrationRoleName":"AWSCloudFormationStackSetAdministrationRole",
  "stackSetExecutionRoleName": "AWSCloudFormationStackSetExecutionRole"
        }
    },

```
Add Cloud Formation Template in config/template folder and replace the name of the in above configuration. If these roles are not created in source & target account then follow these instruction https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacksets-prereqs-self-managed.html#prereqs-self-managed-permissions

Execute
```
sh +x setup.sh 
```
to Deploy the newly added product.  


# Clean up all AWS Resources in Solution
Clean up Provisioned Products follow the instruction https://docs.aws.amazon.com/servicecatalog/latest/userguide/enduser-delete.html
Execute 
```
sh uninstall.sh
```
This will clean up all the resources created in target account from this solution.

## Contributors

- Sandeep Gawande
- Rajneesh Tyagi


## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This library is licensed under the MIT-0 License. See the LICENSE file.

