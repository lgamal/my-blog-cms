const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createAdmin() {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD
  
  if (!email || !password) {
    console.error('Please set ADMIN_EMAIL and ADMIN_PASSWORD environment variables')
    process.exit(1)
  }

  const hashedPassword = await bcrypt.hash(password, 12)
  
  try {
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: 'Admin'
      }
    })
    
    console.log('Admin user created:', user.email)
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('Admin user already exists')
    } else {
      console.error('Error creating admin user:', error)
    }
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()