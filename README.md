<h1 align="center">
  <br>
  <a href="https://github.com/CotomanAnatoli/Workshop_Type_Safety_GraphQL"><img src="https://akhilaariyachandra.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2F3lzczkev%2Fproduction%2Fcd9a28b3d15999c7cbb43dc65feab181204600e3-1200x630.png&w=1200&q=75" alt="GraphQL" width="600">
  </a>
  <br>
  End-To-End Type Safety with React, GraphQL & Prisma
  <br>
</h1>

### Welcome
Welcome to the End-To-End Type Safety with React, GraphQL & Prisma workshop

### Resources
- [The Notion Document](https://github.com/CotomanAnatoli/Workshop_Type_Safety_GraphQL/blob/main/README.md)
- [GitHub starter project](https://github.com/CotomanAnatoli/Workshop_Type_Safety_GraphQL)

### Prerequisites
In order to successfully complete the tasks in the workshop, you should have:
- Node.js installed on your machine (12.2.X / 14.X)
- An IDE installed (VSCode or WebStorm)
- SQL Server and SSMS (Management Studio)
- (Good to have)*A basic understanding of Node.js, React, and TypeScript

## What you'll do
In this workshop, you will get a first-hand look at what end-to-end type safety is and why it is important. To accomplish this, you’ll be building a GraphQL API using modern, relevant tools which will be consumed by a React client.

## Agenda
- Set up Prisma
- Set up GraphQL server
- Build GraphQL schema

<h1 align="center">1. Database: Set up Prisma</h1>

### Goal
The goal of this part is to set up Prisma, model out your schema, and seed a MS SQL server database so that you can use Prisma in your GraphQL server.

### Setup
First, clone the [starter project from GitHub](https://github.com/CotomanAnatoli/Workshop_Type_Safety_GraphQL) on your machine.

### Tasks
After cloning the repository, you should have a good starting point set up with the very beginnings of a back-end server.


### Task 1: Install dependencies
Install dependencies for the project. Run this command: 
```shell
npm i
```

### Task 2: Install & Initialize Prisma
Before building the GraphQL server, you will need to set up Prisma in your server. Install the `prisma` development dependency and run Prisma CLI's `init` command, specifying MSSQL as the database provide. Check out [init command's docs](https://www.prisma.io/docs/getting-started/quickstart) for help.

<details><summary><b>Solution</b></summary>

1. Install the Prisma CLI as a development dependency in the project:

    ```sh
    npm install prisma --save-dev
    ```

2. Set up Prisma with the init command of the Prisma CLI:

    ```sh
    npx prisma init --datasource-provider sqlserver
    ```
  [Init command documentation](https://www.prisma.io/docs/reference/api-reference/command-reference#init)
</details>

### Task 3: Create the `User` model
The [Prisma schema](https://www.prisma.io/docs/concepts/components/prisma-schema) is where you can define the shape of your data and how your individual collections relate to other collections. Currently, it should look like this:

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlserver"
  url      = env("DATABASE_URL")
}
```
The datasource and generator were both set up automatically when you initialized Prisma in your project, and simply specify that you will be connected to a MSSQL database (provider) at the location specified in the environement variable `DATABASE_URL` (url), and you want Prisam Client to be generated.

Start by creating  a `User` model to define the shape of your users' data. This model have these fields:
- `id`: an auto-incrementing integer to unique each user in the database
- `name`: the name of a user

Refer to the [Prisma schema docs](https://www.prisma.io/docs/concepts/components/prisma-schema) if you get stuck.

<details><summary><b>Solution</b></summary>

```prisma
// prisma/schema.prisma

model User {
  id   Int    @id @default(autoincrement())
  name String
}

```
</details>

### Task 4: Create the `Note` model
Your `User` model is complete, however you will also need a `Note` model to hold the notes related to each user.

Create a `Note` model with the following fields:
- `id`: an auto-incrementing integer to uniquely indentify each note in the database
- `message`: the message written in the note
- `createdAt`: a timestamp of when the note was created
- `updatedAt`: a timestamp of when the note was last updated
- `userId`: holds the `id` of the user associated with the note
Then create a one-to-many ralation between the `User` and `Note` models, where any one user can have many notes associated with it.

<details><summary><b>Solution</b></summary>

```prisma
// prisma/schema.prisma

model User {
  id   Int    @id @default(autoincrement())
  name String
  notes Note[]
}

model Note {
  id   Int    @id @default(autoincrement())
  message String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  userId Int
  user User @relation(fields: [userId], references: [id])
}
```
  - [Prisma data model docs](https://www.prisma.io/docs/concepts/components/prisma-schema/data-model)
  - [Prisma filed attributes](https://www.prisma.io/docs/concepts/components/prisma-schema/data-model#defining-attributes)
  - [Prisma one-to-many raltion docs](https://www.prisma.io/docs/concepts/components/prisma-schema/relations/one-to-many-relations)
</details>

### Task 5: Create a migration
Create a new migration to apply to your database using Prisma CLI's `migrate dev` command. This command will create the new migration file and apply it to your development database.

For instructions on how to properly create and apply your migration, check out [this page](https://www.prisma.io/docs/concepts/components/prisma-migrate/get-started) in the docs.

<details><summary><b>MSSQL Set Up</b></summary>
  
  1. Create database with SQL management studio for your project
  
  2. Create a user with `SQL server authentication` in `Security/Logins`
  
  3. Open `SQL Configuration Manager` and enable `TCP/IP` in `SQL Network Configuration/Protocols for MSSQLSERVER`
 </details>
 
 <details><summary><b>Solution</b></summary>
  
  Edit `DATABASE_URL` in `.env` file:
  ```shell
  DATABASE_URL="sqlserver://localhost:1433;database=mydb;user=SA;password=randompassword;trustServerCertificate=true;"
  ```
  Run migration command: 
  ```shell
  npx prisma migrate dev --name init
  ```
  </details>
  
### Task 6: Seed the database
Create a seed script and apply it to your database to give yourself some data to play with. Add a new file in the `prisma` folder named `seed.ts` with the following content:

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

async function main() {
    await prisma.user.deleteMany({});
    await prisma.note.deleteMany({});
    await prisma.user.create({
        data: {
            name: "Adam",
            notes: {
                create: [
                    { message: "A note for Adam" },
                    { message: "Another note for Adam" }
                ]
            }
        }
    })
    await prisma.user.create({
        data: {
            name: "Jack",
            notes: {
                create: [
                    { message: "A note for Jack" },
                    { message: "Another note for Jack" }
                ]
            }
        }
    })
    await prisma.user.create({
        data: {
            name: "Ryan",
            notes: {
                create: [
                    { message: "A note for Ryan" },
                    { message: "Another note for Ryan" }
                ]
            }
        }
    })
    await prisma.note.create({
        data: {
            message: 'Another note for  Ryan',
            userId: 3
        }
    })
}

main().then(() => {
    console.log("Data seeded...")
});
```
This script will simply create three users, each with their own set of notes.

To run this seed script, add the following to your `package.json` file:
```json
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  },
```

And run the command:
```sheel
npx prisma db seed
```

<h1 align="center">2. Back-End: Set up GraphQL server</h1>

### Goal
The goal of this lesson is to set up a GraphQL server that exposes the data in the database set up in the previous lesson.

### Task 1: Instantiate & export Prisma Client from a module 
Before building out the GraphQL server, one thing you know is that you will need an instance of Prisma Client to perform database interactions.

Create a new folder named `src` and within that folder create a file named `db.ts` instantiate Prisma Client in this module, and export the instantiated client as well the Prisma Client class from module.

<details><summary><b>Solution</b></summary>
  
  ```typescript
  // src/db.ts
  
  import { PrismaClient } from "@prisma/client"

  export const prisma = new PrismaClient();
  export { PrismaClient }
  ```
</details>

### Task 2: Add the Pothos generator to the Prisma schema
There are two different approaches to build a GraphQL schema: Code-First and Schema-First. In this workshop, you will take the Code-First approach using a library called [Pothos](https://pothos-graphql.dev/).

Install first the Pothos package the awesome [Prisma Plugin](https://pothos-graphql.dev/docs/plugins/prisma) that comes with it.

```shell
  npm i @pothos/plugin-prisma @pothos/core
```
In order to use the prisma plugin for, you need to add the Pothos types generator to your Prisma schema.Add that generator to your schema and re-generate the schema.

Follow the plugin docs [here](https://pothos-graphql.dev/docs/plugins/prisma) if you get stuck.

<details><summary><b>Solution</b></summary>
  
  ```typescript
    // prisma/schema.prisma

    generator pothos {
      provider = "prisma-pothos-types"
    }
  ```
  Run this command to generate schema:
  
  ```shell
    npx prisma generate
  ```
  
</details>

### Task 3: Create & configure a `SchemeBuilder`
With Pothos installed and Prisma Pothos types generated, you are now ready to begin building out your GraphQL schema. Pothos works off of a class named `SchemaBuilder` that provides a powerful set of tools for building out your schema.

In a new file named `src/builder.ts`, import:

- `SchemaBuilder`: The default export from `@pothos/core`
- `PrismaPlugin`: The default export from `@pothos/prisma-plugin`
- `PrismaTypes`: The default export from the generated Prisma Pothos types `@pothos/plugin-prisma/generated`
- `prisma`: The instantiated Prisma client from `db.ts`

Then instantiate and export a `SchemaBuilder` with the Prisma plugin configured

If you get stuck or need help figuring out how to properly instantiate the `SchemaBuilder`, you can refer to the [docs](https://pothos-graphql.dev/docs/plugins/prisma).


<details><summary><b>Solution</b></summary>
  
  ```typescript
  // src/builder.ts
  
    import SchemaBuilder from '@pothos/core'
    import PrismaPlugin from '@pothos/plugin-prisma'
    import type PrismaTypes from '@pothos/plugin-prisma/generated'
    import { prisma, PrismaClient } from './db'

    export const builder = new SchemaBuilder<{
        PrismaTypes: PrismaTypes
    }>({
        plugins: [PrismaPlugin],
        prisma: { client: prisma }
    })
  ```
</details>
  
  ### Task 4: Add a `Date` scalar type
  GraphQL by itself can handle these scalar types:
  
  
  - Boolean
  - Float
  - ID
  - Int
  - String
  
  We have `updatedAt` and  `createdAt` fields that are of the `DateTime` type. Those, in GraphQl, will be handled as String, but we need to define a Scalar type called `Date` because Prisma defines that data as a date.
  
  First, install `graphql-scalar`, where you will find a `Date` scalar type resolver.
  
  ```shell
     npm i graphql-scalar
  ```
  
  Then, whitin `builder.ts` add a `Date` scalar type that implements the `DateResolver` scalar from `graphql-scalars`.
If you need help, there is a complete example in the [Pothos docs](https://pothos-graphql.dev/docs/guide/scalars#scalars).
  
  >Hint: You will need to define the scalar type in the `ScemaBuilder`'s generic parameter AND add it to the builder separately.
  
 <details><summary><b>Solution</b></summary>
  1. Set up scalar type
   
   ```typescript
    // src/builder.ts
   
      export const builder = new SchemaBuilder<{
        PrismaTypes: PrismaTypes;
        Scalars: {
            Date: { Input: Date; Output: Date; }
        }
       }>({
          plugins: [PrismaPlugin],
          prisma: { client: prisma }
       })
   ```
   2. Apply teh resolver
   
   ```typescript
    // src/builder.ts
   
    builder.addScalarType('Date', DateResolver, {})
   ```
</details>
   
### Task 5: Add a root query
A GraphQL server cannot run without at least one query defined.Before hooking up your schema to a GraphQL server, you need to define a root query.
   
In `builder.ts`, add a query type to the builder with a query named `hello` that simply returns the string `"World"`.
   

<details><summary><b>Solution</b></summary>

  ```typescript
    builder.queryType({
      fields: (t) => ({
          hello: t.field({
              type: 'String',
              resolve: () => 'World'
          })
      })
    })
  ```
</details>
   
### Task 6: Create a module that exports the generated schema
The `builder` object has a method named `toSchema` that returns a generated schema. Will be more query types later on, and it would be ideal to split those out rather than defining them all in `builder.ts`.
  
Create a new file named `schema.ts` that imports the `builder` object and exports the results of the `toSchema` method. Later on, this file is where we will import modules that register more object and query types.

<details><summary><b>Solution</b></summary>

  ```typescript
  // src/schema.ts
  
    import { builder } from './builder'

    export const schema = builder.toSchema()
  ```
</details>
   
### Task 7: Create GraphQL server with the schema
In this workshop, you will be using [GraphQL Apollo](https://www.apollographql.com/docs/apollo-server/getting-started/#step-6-create-an-instance-of-apolloserver) as your GraphQL server, so before writing any code, install the `@apollo/server` dependency.

  ```shell
   npm install @apollo/server graphql   
  ```
In a new file `index.ts`, import `@apollo/server` and the schema (from `schema.ts`), create a new server using `ApolloServer` from GraphQL Apollo, and start the GraphQL server.
   
If you get stuck, you can refer to the docs. The GraphQL Apollo API docs can be found [here](https://www.apollographql.com/docs/apollo-server/getting-started/).   
   
<details><summary><b>Solution</b></summary>

  ```typescript
    // src/index.ts
  
    import { ApolloServer,  } from '@apollo/server'
    import { startStandaloneServer } from '@apollo/server/standalone';
    import { schema } from './schema'

    const server = new ApolloServer({ schema })

    startStandaloneServer(server, {
        listen: { port: 4000 },
    }).then(({ url }) => {
        console.log(`🚀  Server ready at: ${url}`);
    });
  ```
</details/>

### Task 8: Start the graphQL server and explore 
Your GraphQL server can now be run and explored! Run the following command to start up the development server:
  
  ```shell
    npm run dev
  ```
  
  This will start server on `http://localhost:4000/`. Head to [ http://localhost:4000/graphql](http://localhost:4000/graphql) to open teh GraphQL playground.
  
  In the playground, run your `hello` GraphQL query from the explorer tab and make sure you get the expected response back.
  
  After running this, explore the playground a bit and see what you can find! You should be able to see your schema, the generated types and queries, and more!
  
  <h1 align="center">3. Back-End: Build the GraphQL schema</h1>

  ### Goal
  The goal of this lesson is to set up a GraphQL server that exposes the data in the database set up in the previous lesson. GraphQL is strongly typed and will allow   the front-end to request exactly the data it needs in a way that is type-safe and documented.
  
  ### Task 1: Built a `Note` type
  Use the Pothos `builder` instance to define a `Note` type in your GraphQL schema. In order to keep your code organized, create a new folder in `src` named `models`.
  
  Create a new file within this new folder named `Note.ts` and add the `Note` type there.
  
  This type should expose these fields from the database:
  - `id`
  - `message`
  - `createdAt`
  - `updatedAt`
  
  For help, chek out the Pothos docs on the [prisma plugin](https://pothos-graphql.dev/docs/plugins/prisma).
  
  <details><summary><b>Solution</b></summary>

  ```typescript
    // src/models/Note.ts
    
    import { builder } from '../builder'

    builder.prismaObject("Note", {
        findUnique: note => ({ id: note.id }),
        fields: t => ({
            id: t.exposeID('id'),
            message: t.exposeString('message'),
            createdAt: t.expose('createdAt', {
                type: 'Date'
            }),
            updatedAt: t.expose('updatedAt', {
                type: 'Date'
            })
        })
    })
  ```
</details/>
    
  ### Task 2: Built a `User` type
  Use the Pothos `builder` instance to define a `User` type in your GraphQL schema.
  
  Create a new file in `scr/models` named `User.ts` and add the `User` type there.
  
  This type should expose these fields from the database:
  - `id`
  - `name`
  - `notes` (This is a relation)
  
  For help, chek out the Pothos docs on the [prisma plugin](https://pothos-graphql.dev/docs/plugins/prisma), and more specifically the section about exposing [relation fields](https://pothos-graphql.dev/docs/plugins/prisma#adding-relations).
  
  <details><summary><b>Solution</b></summary>

  ```typescript
    // src/models/User.ts
    
    import { builder } from '../builder'

    builder.prismaObject('User', {
        findUnique: user => ({ id: user.id }),
        fields: t => ({
            id: t.exposeID('id'),
            name: t.exposeString('name'),
            notes: t.relation('notes')
        })
    })
  ```
</details/>

### Task 3: Add `Prisma` to the GraphQL context
  In order to actually query for data, you will need to use Prisma Client. You already have an instantiated instance of it, however you don't have an easy way to access it in each of your models without manually importing it.
  
  You can add it to your GraphQL server context to make it globally available via `ctx` argument in your resolvers.
  
  Add the `prisma` instance to the server context.
  
<details><summary><b>Solution</b></summary>

  ```typescript
    // src/index.ts
    
    startStandaloneServer(server, {
        listen: { port: 4000 },
        context:  async () => ({ prisma })
    }).then(({ url }) => {
        console.log(`🚀  Server ready at: ${url}`);
    });
  ```
  ```typescript
    // src/builder.ts

    export const builder = new SchemaBuilder<{
        PrismaTypes: PrismaTypes;
        Context: { prisma: PrismaClient },
        Scalars: {
            Date: { Input: Date; Output: Date;}
        }
    }>({
        plugins: [PrismaPlugin],
        prisma: { client: prisma }
    })
  ```
</details/>

### Task 4: Add a `User` query type
With your Prisma instance available in the context and the types defined, you now have all the pieces you need to write a query type.

Add a query type for your user data within `src/models.User.ts` that returns a list of all of tour database's users.

For help, check out [this section](https://pothos-graphql.dev/docs/guide/fields#adding-fields-to-existing-type) of the Pothos docs for an example of a query.

<details><summary><b>Solution</b></summary>

  ```typescript
    // src/models/User.ts
    
    builder.queryField('users', t => t.prismaField({
        type: ['User'],
        resolve: async (query,  root, args, ctx, info) => {
            return ctx.prisma.user.findMany({ ...query })
        },
    }))
  ```
</details/>

### Task 5: Register Queries and Types in the schema
  Currently, you have defined your GraphQL object and query types but have not actually reference them anywhere in the server code that is executed. I order to actually register those, import the types into the `schema.ts` file.
  
<details><summary><b>Solution</b></summary>

  ```typescript
    // src/schema.ts
    
    import { builder } from './builder'

    import './models/User'

    export const schema = builder.toSchema()
  ```
</details/>  

### Task 6: Test queries in Apollo Studio
Now that everything is all set up, you can begin to test out your GraphQL server using Apollo Studio!

Start up your development server and play around in Apollo Studio with various GraphQL queries of your data.

Start the server by running:

```shell
  npm run dev
```

Then at [http://localhost:4000](http://localhost:4000) you should see the Apollo Studio.

Play around with various queries to see what is available. If you need a starting point, try testing out this query:

```graphql
  query Users {
    users {
      id
      name
      notes {
        id
        createdAt
        message
        updatedAt
      }
    }
  }
```