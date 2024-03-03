# Purana Kitab

A REST api for book store where you can buy used (purana) books (kitab).

## Authors

- [@sherpa00](https://www.github.com/sherpa00)

## Tech Stack

- **Server:** Node, Express

- **Language:** Typescript

- **Database:** postgresql (with pg driver)

## Run Locally

1. Clone the project

```bash
  git clone https://github.com/sherpa00/PuranaKitab.git
```

2. Go to the project directory

```bash
  cd PuranaKitab
```

3. Install dependencies

```bash
  npm install
```

4. Create your local and test postgres database

5. Create required Environment Variables

```bash
  touch .env.development .env.testing .env.production
```

6. Create new Environment Variable which stores pg db url string as DATABASE_URL for running db migration

```bash
  touch .env
```

7. After creating .env and adding DATABASE_URL in it, run the migration to crreate required tables

```bash
   npm run migrate up
```

8. Start the server in dev mode

```bash
  npm run dev
```

## Environment Variables

- **.env:** Environment Variables for DATABASE_URL for database migration using pg-node-migrate (ps: pg-node-migrate only loads env variables from .env)

- **.env.testing:** Environment Variables for testing purposes

- **.env.development:** Environment Variables for development purposes

- **.env.production:** Environment Variables for production purposes

To run this project, you will need to add the following environment variables to your .env file

`PORT`

`DB_HOST`,
`DB_USER`,
`DB_PASSWORD`,
`DB_PORT`,
`DB_DATABASE`,

`PRIVATE_KEY`,
`PUBLIC_KEY`

`CLOUDINARY_CLOUD_NAME`,
`CLOUDINARY_API_KEY`,
`CLOUDINARY_API_SECRET`

`DEFAULT_GMAIL`,
`GMAIL_APP_PASSWORD`

`DATABAE_URL`,

`STRIPE_SECRET`

## Running Tests

To run tests, follow according to below steps:

1. Create test postgres database locally

2. Add the created test database url string to DATABASE_URL in .env file

3. Run database migration file to create required tables for testing database in integration tests

```bash
  npm run migrate up
```

4. Now, Run tests

``bash
npm run test

```

## Project Introduction

- suppot ES6/ES7 features
- using ESlint followed Typescript recommended typescirpt Style Guide
- using swagger-doc to manage the document. Visualize document using Swagger UI.

# REST API

The REST API example is given below.

## Get all books

### Request

`GET /books/`

    curl -i -H 'Accept: application/json' http://localhost:3003/books/

### Response

    HTTP/1.1 200 OK
    Date: Thu, 24 Feb 2011 12:36:30 GMT
    Status: 200 OK
    Connection: close
    Content-Type: application/json
    Content-Length: 2

    {
      success: true,
      message: 'Succesfully got all books',
      data: [
        ...
      ]
    }

## License

[MIT](https://choosealicense.com/licenses/mit/) [![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
```
