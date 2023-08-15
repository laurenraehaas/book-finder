const { gql } = require('apollo-server-express')

const typeDefs = gql`
    type Query {
        me: User
    }

    type User {
        _id: ID
        email: String
        username: String
        bookCount: Int
        savedBooks: [Book]!
    }

    type Book {
        bookId: ID
        title: String
        authors: [String]!
        description: String
        image: String
        link: String
    }

    type Auth {
        token: ID!
        user: User
    }

    type bookInput {
        bookId: String!
        title: String!
        authors: [String]!
        description: String!
        image: String!
        link: String!
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(email: String!, username: String!, password: String!): Auth
        saveBook(bookInfo: BookInput!): User
        removeBook(bookId: ID!) User
    }
`

module.exports = typeDefs