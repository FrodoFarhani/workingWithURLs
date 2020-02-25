import 'jest-extended'

import { connect, disconnect } from '../../src/config/typeorm'
import { clean } from './cleanDb'

export default () => {
  beforeAll(async () => {
    await connect()
    await clean()
  })

  afterAll(disconnect)
  afterEach(clean)
}
