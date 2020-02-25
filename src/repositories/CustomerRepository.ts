import { EntityRepository } from 'typeorm'
import  shortened_URL  from '../database/entity/shortened_URL'
import { BaseRepository } from './BaseRepository'

@EntityRepository(shortened_URL)
export class ShortenedURLRepository extends BaseRepository<shortened_URL> {}
