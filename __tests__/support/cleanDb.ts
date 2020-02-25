import { getConnection } from 'typeorm'

export const clean = () => {
  const { manager } = getConnection()
  const names = ['shortened_URL']
  return manager.query(names.map(name => `delete from ${name};`).join('\n'))
}
