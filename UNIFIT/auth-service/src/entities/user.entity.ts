import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

export enum UserTipo {
  ADMINISTRADOR = 'ADMINISTRADOR',
  USUARIO_FINAL = 'USUARIO_FINAL',
}

export enum UserRol {
  ADMINISTRADOR = 'ADMINISTRADOR',
  USUARIO = 'USUARIO',
}

@Entity('auth_users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ length: 255 })
  password: string;

  @Column({ length: 255 })
  nombre: string;

  @Column({
    type: 'enum',
    enum: UserTipo,
    default: UserTipo.USUARIO_FINAL,
  })
  tipo: UserTipo;

  @Column({
    type: 'enum',
    enum: UserRol,
    default: UserRol.USUARIO,
  })
  rol: UserRol;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshToken[];
}

@Entity('refresh_tokens')
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  token: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'expires_at', type: 'timestamp' })
  expiresAt: Date;

  @Column({ default: false })
  revoked: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column(() => User)
  user: User;
}
