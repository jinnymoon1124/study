import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import BaseEntity from './Entity';
import { text } from 'stream/consumers';
import { Exclude, Expose } from 'class-transformer';
import { makeId, slugify } from '../utils/helpers';
import User from './User';
import Post from './Post';
import Comment from './Comment';

@Entity('votes')
export default class Vote extends BaseEntity {
  @Column()
  value: number;
  
  @ManyToOne(() => User)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  user: User;

  @Column()
  username: string;

  @Column({nullable: true})
  postId: number;

  @ManyToOne(() => Post)
  post: Post;

  @Column({nullable: true})
  commentId: number;

  @ManyToOne(() => Comment)
  comment: Comment;
}
