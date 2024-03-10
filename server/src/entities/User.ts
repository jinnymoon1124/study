import { IsEmail, Length } from 'class-validator';
import bcrypt from 'bcryptjs';
import BaseEntity from './Entity';

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  OneToMany,
  BeforeInsert,
} from 'typeorm';
import Post from './Post';
import Vote from './Vote';

@Entity('users')
export default class User extends BaseEntity {
  @Index()
  @IsEmail(undefined, { message: '이메일 주소 잘못됨' })
  @Length(1, 255, { message: '이메일 주소는 비워둘 수 없음' })
  @Column({ unique: true })
  email: string;

  @Index()
  @Length(3, 32, { message: '이름은 3자 이상' })
  @Column({ unique: true })
  username: string;

  @Column()
  @Length(6, 255, { message: '비밀번호는 6자 이상' })
  password: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Vote, (vote) => vote.user)
  votes: Vote[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 6);
  }
}
