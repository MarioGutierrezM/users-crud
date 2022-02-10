# User CRUD - Node Js & GraphQL

## Features

- Create and Update users and companies by using graphiQL interface

## Tech

- [node.js] - evented I/O for the backend
- [Express] - fast node.js network app framework
- [json-server] - simulate backend rest server 
- [GraphQL] - A Query Language and Runtime which can target any service

## Installation

It requires [Node.js](https://nodejs.org/) v14 to run.

Install the dependencies and devDependencies.

```sh
npm install
```

Start the json-server.

```sh
npm run json:server
```

Start the Express.js server.

```sh
npm run dev
```

## Examples

### Queries

#### Simple query

```gql
{
    company(id: "1") {
        name
        users {
            firstName
        }
    }
}
```

#### Naming the query

```gql
query findCompany {
    company(id: "1") {
      name
      users {
        firstName
      }
    }
  }
```

#### Getting more companies in the same query

```gql
{
    companyA: company(id: "1") {
      name
      users {
        firstName
      }
    }
    companyB: company(id: "2") {
      name
      users {
        firstName
      }
    }
}
```

### Fragments

We can create reusable fragments:

```gql
  fragment companyDetails on Company {
    id
    name
    description
  }
```

Then we use it in order to reuse query sintax

```gql
{
    companyA: company(id: "1") {
      ...companyDetails
    }
    companyB: company(id: "2") {
      ...companyDetails
    }
}
```

### Mutations

```gql
mutation {
    addUser(firstName: "Mario", age: 26) {
        id,
        firstName,
    }
}
```

```gql
mutation {
    deleteUser(id: "40") {
        id,
    }
}
```
