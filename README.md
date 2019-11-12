# Serverless-Image-Handler


# Quick Start

follow the steps below to create and deploy your first serverless microservice in minutes.

    Install via npm:

npm install -g serverless

    Set-up your Provider Credentials. Watch the video on setting up credentials

    Create a Service:

You can create a new service or install existing services.

# Create a new Serverless Service/Project
serverless create --template aws-nodejs --path my-service
# Change into the newly created directory
cd my-service

    Deploy a Service:

Use this when you have made changes to your Functions, Events or Resources in serverless.yml or you simply want to deploy all changes within your Service at the same time.

serverless deploy -v

    Deploy the Function:

Use this to quickly upload and overwrite your AWS Lambda code on AWS, allowing you to develop faster.

serverless deploy function -f hello
