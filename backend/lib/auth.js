const { betterAuth } = require('better-auth');
const { prismaAdapter } = require('better-auth/adapters/prisma');
const { PrismaClient } = require('../generated/prisma/client');

const prisma = new PrismaClient();
exports.auth = betterAuth({
    trustedOrigins: [`${process.env.CORS_ORIGIN}`],
    database: prismaAdapter(prisma, {
        provider: 'postgresql',
    }),
    emailAndPassword: {
        enabled: true,
    },
});