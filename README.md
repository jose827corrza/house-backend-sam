# HOUSE BACKEND

## Basic Information

The project is divided mainly in two parts, samConfiguration and cloudfConfiguration.

Most of the it is managed by SAM part. And consists in following AWS Resources:

- Lambda Functions
- Lambda Layer Version
- HttpApi Gateway
- Simple Table in DynamoDB
- Role, Policy and LogsGroup for the project

## Configuration or resources

There are few topics that are quite relevant.

- It was used the HttpApi resource instead the common Api.
- In this one is being used for auth purposes, a LambdaAuthorization previously created, which uses the JWT an confirms with the provider (Firebase) that is a valid token and if so, it will grand you the consumption of services.
- To achieve the behavior mentioned above, the following configuration is required in the Gateway.

```yaml
  FunctionWithAuthInvokeRole:
    Type: AWS::IAM::Role
    Properties:
      AssumeRolePolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Effect: Allow
            Principal:
              Service:
                - apigateway.amazonaws.com
            Action: sts:AssumeRole

  FunctionWithAuthInvokePolicy:
    Type: AWS::IAM::Policy
    Properties:
      PolicyName: FunctionWithAuthInvokePolicy
      Roles:
        - !Ref FunctionWithAuthInvokeRole
      PolicyDocument:
        Version: '2012-10-17'
        Statement:
          - Effect: Allow
            Action:
              - lambda:InvokeFunction
            Resource: "*"
          - Effect: Allow
            Action:
              - logs:CreateLogGroup
              - logs:CreateLogStream
              - logs:PutLogEvents
            Resource: '*'
```

Please note that if more control security is required, you can specify which resources are able to receive this role with the proper policy, is very important that the Gateway receives the 'lambda:InvokeFunction'.

- Another important topic is how to configure the LayerVersion. Must follow a similar structure as showned below.

```
src/layers/sample-layer/
└── nodejs/
    └── node_modules/
        └── axios/
```

```yaml
Resources:
  SampleLayer:
    Type: AWS::Serverless::LayerVersion
    Properties:
      LayerName: SampleLayer
      Description: A shared layer for reusable code
      ContentUri: src/layers/sample-layer
      CompatibleRuntimes:
        - nodejs20.x

  HelloWorldFunction:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: src/handlers/
      Handler: hello-from-lambda.handler
      Runtime: nodejs20.x
      Layers:
        - !Ref SampleLayer    # Add this line to reference the layer
```
