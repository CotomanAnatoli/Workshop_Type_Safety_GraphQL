import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const main = async () => {
    await  prisma.note.deleteMany({})
    await  prisma.user.deleteMany({})

    await prisma.user.create({
        data: {
            name: 'John',
            notes: {
                create: [
                    { message: 'A message for John'},
                    { message: 'Another message for John'}
                ]
            }
        }
    })
    await prisma.user.create({
        data: {
            name: 'Adam',
            notes: {
                create: [
                    { message: 'A message for Adam'},
                    { message: 'Another message for Adam'}
                ]
            }
        }
    })
    await prisma.user.create({
        data: {
            name: 'Ryan',
            notes: {
                create: [
                    { message: 'A message for Ryan'},
                    { message: 'Another message for Ryan'}
                ]
            }
        }
    })

    const user = await  prisma.user.findFirstOrThrow({ where: { name: 'Ryan' } })

    await prisma.note.create({
        data: {
            message: 'Another message for Ryan',
            userId: user.id
        }
    })
}

main().then(() => console.log('Data seeded....'))