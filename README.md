# LemonadePartnerAPi

Take home interview assignment from 8/31/2021 to be returned on 9/7/2021 to Lemonade

## Main Features
 - User can provide a "quoteInput" object to store a "quote" in a Dyanmo Table ("QuotesTable")
 - User can query both "QuotesTable" and "PoliciesTable" for individual records given matching IDs
 - User can make a request to return all records in both "QuotesTable" and "PoliciesTable"
 - User can create a "PaymentConfirmation" object given a valid quoteId
   -  If correctly formatted "mortgageId" is provide then a paymentConfirmation will be returned with the Id of the mortgageID 
   -  If no "mortgageId" is provided a stripeCheckoutSession will be created with the Id of the mortgageID
   -  In order to proceed to creating a policy a the checkoutSession must be marked as "PAID"
 - User can provide a valid "PaymentConfirmation" contraining either a mortgageId or valid stripe session token to create a policy.
   - User may only create Policies for quotes that are in the "READY status
   - quoteId stored on the payment confirmation MUSt match the given quoteId
  - User can delete both Quotes and Policies given the correct ID
  - User can update both Quotes and Policies given the correct ID
  


## Installation

clone this repo on into your local machine

```bash
git clone https://github.com/Dev-Drew/LemonadeAPI.git
```

Use the package manager [npm](https://www.npmjs.com/) to install all required dependencies for LemonadePartnerAPI.

```bash
npm install
```

This project uses two AWS local Dynamo DB Tables perform CRUD operations. You will need install Dynamo DB on your local machine. It's pretty straightforward and AWS has [great documentation](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html) 

Once Dynamo is installed you will need to create both tables on your local machine. I have provided two files for that will create them.  Navigate to src/dynamo/createScripts then run the following commands 

```bash
node createPolicyTable.js
```
```bash
node createQuoteTable.js
```

Once the tables are created you will need to create an .env file at project root. Create the file then copy over what I've included in .env.example.

A stripe secret key for can be generated through [stripes website](https://stripe.com/). If you're having a hard time checkout [this guide](https://www.appinvoice.com/en/s/documentation/how-to-get-stripe-publishable-key-and-secret-key-23).

To send and receive emails this project has been configured with [mailtrap](https://mailtrap.io/). You'll need to create an account on their website to generate user and password

You're .env should look something like this when complete
```bash
STRIPE_TEST_KEY=sk_test_51JVNu0LvFtdDa1wmNLgNXZy3whQzCa7ojb3DG8aMEWmxfwNCXTlz2yWvp27aRQLQFL0pFecfJol7kPvo87DWlrZC00kO6GJOhM
MAILTRAP_USER=2a798c947a2e44
MAILTRAP_PASS=8eb3c831254244
```

Great! We're done. 

All that's left is to start the server. I've included a few different run scripts in the package.json.
My favorite for development is start:dev. 

```bash
npm run start:dev
```
## Assumptions
From Requirements
    - Preiumum is always $500
    - Stripe is used to process payment if mortgage ID is not provided
    - No UI is required
    - No deployment infrastructure is needed
    - Quotes and Policies will only be for Home insurance 
    
Personal 
    - QuoteIds will be random 15 characters start with "LQ"
    - MortgageIds will be random 15 characters start with "MID"
    - Any 15 character MortgageID string will be valid if it starts with "MID"
    - PolicyIds will be random 15 characters start with "LP"
    - User is always fully authenticated and authorized. 
    - One quote is only good to create one policy (can not use the same quoteId to create multiple polices)
    - Additional libraries / frameworks are allowed. 
    - No requirement for test coverage
    

## Usage

Take a look at the api.yaml file I've included the project to see what type of requests you can make.

Basic Flow
1. Create a Quote using a "QuoteInput"
2. Retrieve that Quote using its ID
3. Create a payment confirmation using the ID of the quote.
 3.1.  Only providing an ID will attempt checkout through Stripe. You may include any valid mortgageId if you want to bypass Stripe (   "mortageId": "MID163084932900")
4. Create a policy using the ID on the "PaymentConfirmation" from step 3
5. Retrieve that Policy using the ID from step 4.


Read all that and got no idea where to start? I've included a postman collection in the documents folder that has all the requests.

##


## Tech Stack
Few Basics:

[Typescript](https://www.typescriptlang.org/): Primary Language 

[Node.js](https://nodejs.org/en/): Runtime 

[Prettier](https://prettier.io/): Formatter

[ESLint](https://eslint.org/): Syntax 

---

More Advanced:

[NestJS](https://nestjs.com/): Node.js Framework, that makes building webservices a lot faster and easier (in my opinion). It draws a lot from Angular. I really like the way it handles [routing](https://docs.nestjs.com/controllers) and [decorators](https://docs.nestjs.com/custom-decorators). By default NestJS uses express, but for improved performance I've opted for [Fastify](https://docs.nestjs.com/techniques/performance)

[Stripe](https://stripe.com/): This was a project required to handle payments. Great dashboards and documentation. I've only enabled test mode, but I can still see transactions on my test dashboard.

[Nestjs-stripe](https://www.npmjs.com/package/nestjs-stripe): Basically a wrapper for stripe's own module. 

[Open](https://www.npmjs.com/package/open): Small module I'm using to open the stripe checkout session. Super easy.

[DyanmoDB](https://aws.amazon.com/dynamodb/): Database, super powerful and easy to scale. I'm only using the local version in this project.

[AWS Javacsript SDK](https://aws.amazon.com/sdk-for-javascript/) Used to access Dynamo table. I've opted to use [DocumentClient](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html) to handle all my access. It's pretty high level and abstracts a lot away. 

[nest-modules/mailer](https://github.com/nest-modules/mailer): Wrapper around [Nodemailer](https://nodemailer.com/about/). Easy way to send out emails, provided your email sever allows you. 

[mailtrap](https://mailtrap.io/): Email Sandbox, really cool app that allows you to send a receive emails. Was hesitant to put up my personal info in plaintext.  We can view sent emails via the mailtrap UI.

---

Local Tools:

[VSCode](https://code.visualstudio.com/): IDE

[DB Browser](https://sqlitebrowser.org/): GUI to view records in my local DB

[Postman](https://www.postman.com/): Send HTTP Requests





## Contributing
Will be turning this repo private once the process is over, but feel free to reach out if you have any questions!

## License
[MIT](https://choosealicense.com/licenses/mit/)