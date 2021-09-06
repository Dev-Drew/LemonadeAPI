# LemonadePartnerAPi

Take home interview assignment from 8/31/2021 to be returned on 9/7/2021 to Lemonade



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

## Usage

Take a look at the api.yaml file I've included the project to see what type of requests you can make.
Got no idea where to start? I've included a postman collection in the documents folder that has a some basic requests.


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