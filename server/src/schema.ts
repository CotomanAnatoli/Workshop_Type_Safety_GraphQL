import { builder } from './builder'

import './models/Note'
import './models/Users'

export const schema = builder.toSchema()