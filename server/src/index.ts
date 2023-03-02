import { ApolloServer } from '@apollo/server'
import {schema} from './schema'
import { startStandaloneServer } from '@apollo/server/standalone';

const server = new ApolloServer({
    schema
})

startStandaloneServer(server, {
    listen: { port: 4000 }
}).then(({ url }) => { console.log(`Server ready at ${url}`) })