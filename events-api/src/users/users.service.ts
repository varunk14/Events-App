import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

const AUTH_SELECT = ['id', 'email', 'passwordHash', 'name', 'createdAt'] as const;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
  ) {}

  findByEmail(email: string) {
    return this.repo.findOne({
      where: { email },
      select: [...AUTH_SELECT],
    });
  }

  findById(id: string) {
    return this.repo.findOne({
      where: { id },
      select: [...AUTH_SELECT],
    });
  }

  create(data: Pick<User, 'email' | 'passwordHash' | 'name'>) {
    const user = this.repo.create(data);
    return this.repo.save(user);
  }
}
