# Install the Elastic Beanstalk CLI
http://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-install.html

# Create a Local Profile with AWS Credentials
1. Open the `~/.aws/config` file in a text editor
2. If you do not already have active AWS Credentials, login to the AWS Console using your IAM User and create a new credential pair.
3. Add a new profile in the `~/.aws/config` using the AWS Credentials that were just generated (see the example below).
```
[profile eb-cli-fantasy-football]
aws_access_key_id = xxxxxxxxxxx
aws_secret_access_key = xxxxxxxxxxxxx
```

# Initalize the Local Project as an Elastic Beanstalk Project
1. Run the command `eb init --region us-east-1 --profile eb-cli-fantasy-football`
2. Select "fantasy-football" as the application to use

# Deploy the application
`eb deploy`
