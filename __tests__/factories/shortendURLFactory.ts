import { Factory } from 'typeorm-factory'
import  shortened_URL  from '../../src/database/entity/shortened_URL'

export const CustomerFactory = new Factory<shortened_URL>(shortened_URL);
