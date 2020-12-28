import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index('users-username-idx', { unique: true })
  username: string;

  @Column()
  passwordHash: string;
}
