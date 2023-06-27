# Purana Kitab

A REST api for book store where you can buy used (purana) books (kitab).

## Authors

- [@sherpa00](https://www.github.com/sherpa00)

## Tech Stack

- **Server:** Node, Express

- **Language:** Typescript

- **Database:** postgresql

## Run Locally

Clone the project

```bash
  git clone https://github.com/sherpa00/PuranaKitab.git
```

Go to the project directory

```bash
  cd PURANAKITAB
```

Install dependencies

```bash
  npm install
```

Build the server

```bash
  npm run build
```

Start the server

```bash
  npm run start
```


## Environment Variables

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

## Running Tests

To run tests, run the following command

```bash
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

