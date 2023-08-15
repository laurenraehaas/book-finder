const { User } = require('../models')
const { signToken } = require('../utils/auth')
const { AuthenticationError } = require('apollo-server-express')

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if(context.user) {
                const userInfo = await User.findOne({ _id: context.user._id }).select('-__v -password')
                return userInfo
            }
            throw new AuthenticationError('You are not logged in!')
        }
    },

    Mutation: {
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email })
            if (!user) {
                throw new AuthenticationError('Invalid login credentials')
            }
            const validPass = await user.isCorrectPassword(password)
            if(!validPass) {
                throw new AuthenticationError('No user found!')
            }
            const token = signToken(user)
            return { token, user }
        },
        addUser: async (parent, { email, username, password }) => {
            const user = await User.create({ email, username, password })
            const token = signToken(user)
            return { token, user }
        },
        saveBook: async (parent, { bookInfo }, context) => {
            if(context.user) {
                const savedBookData = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: bookInfo } },
                    { new: true }
                )
                return savedBookData
            }
            throw new AuthenticationError('Must be logged in to save book!')
        },
        removeBook: async (parent, { bookId }, context) => {
            if(context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId: bookId } } },
                    { new: true },
                )
                return updatedUser
            }
            throw new AuthenticationError('Must be logged in to delete book!')
        }
    }
}

module.exports = resolvers