import {builder} from '../builder'

builder.prismaObject('User', {
    findUnique: user => ({ id: user.id }),
    fields: t => ({
        id: t.exposeID('id'),
        name: t.exposeString('name'),
        notes: t.relation('notes')
    })
})

builder.queryField('users', t => t.prismaField({
    type: ['User'],
    resolve: async (query, parent, args, context, info) => context.prisma.user.findMany({ ...query })
}))