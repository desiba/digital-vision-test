# This is a technical test for Digital Vision

## Technology Used
 - NestJS

 - NestJS GraphQL

 - Prisma ORM

 - PostgreSQL DB

 ## Database Setup
 - install docker if you don't have one

 - Run ` git clone https://github.com/desiba/digital-vision-test.git` to pull the code from github

 - Run ` npm install` to install the npm dependencies

 - Run ` docker compose up` to spring up the database connection

 - Run ` mv .env.example .env` to rename the .env.sample to .env file

 - Run ` npx prisma migrate dev --name init` to create the database schema

 - Run ` npx prisma generate` to generate ObjectTypes, Args etc

 - Run ` npx prisma db seed` to seed the Roles and Permissions

 - Run ` npm run start:dev` to start the server

 - Open http://localhost:4000/graphql

 - Now Run your mutations, queries  from GraphQL Play Ground play ground

 ## Runing Test - Open a new terminal to the project directory
 - Run ` npm run test` to run the tests.

 ## You can use these sample data to login via biometricKey or email and password
```javascript
    {
        id: 34335353,
        email: "xyz@gmail.com",
        biometricKey: 'U2FsdGVkX18n9SzWzj2SpNVGgjWtHlsvm0JLzemHu1Y=',
        password: await hash('P@ssword01')
    }
```


 ## Create User from GrapgQL
 - Follow the screen shot sample on how to add the neceassary body and parameters to GraphQL
 ![alt text](./signup-view.png)

 ## Login User with email and password from GrapgQL
 - The screenshot shows how you can login view GraphQl
 ![alt text](./signin-view.png)

  ## Login with biometric  from GrapgQL
 - The screenshot shows how you can login view GraphQl
 ![alt text](./biometric-login.png)

 ## Features 
  - Register User

  - Login Registered User

  - Login with biometricKey