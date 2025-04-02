import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

let prisma
console.log("Database URL:", process.env.DATABASE_URL);

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient()
  }
  prisma = global.prisma
}

export { prisma };