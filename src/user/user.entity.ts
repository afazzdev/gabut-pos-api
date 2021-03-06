import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  Entity,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Product } from 'src/product/product.entity';
import { Invoice } from 'src/payment/invoice.entity';
import { Cart } from 'src/cart/cart.entity';

export enum UserRole {
  admin = 'admin',
  user = 'user',
}

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'user_id' })
  userId: string;

  @Column({
    name: 'full_name',
    type: 'varchar',
  })
  fullName: string;

  @Column({
    type: 'varchar',
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @Column({
    name: 'reset_password_token',
    nullable: true,
  })
  resetPasswordToken: string;

  @Column({
    name: 'reset_password_expired',
    type: 'timestamp with time zone',
    nullable: true,
  })
  resetPasswordExpired: Date;

  @Column({
    name: 'address',
    nullable: true,
  })
  address: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.user,
  })
  role: UserRole;

  @Column({
    name: 'changed_password_at',
    type: 'timestamp with time zone',
    nullable: true,
  })
  changedPasswordAt: Date;

  /**
   * Relations
   */
  @OneToOne(() => Cart, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cart_id', referencedColumnName: 'cartId' })
  cart: Cart;

  @OneToMany(() => Product, (products) => products.seller, {
    eager: false,
  })
  products: Product[];

  @OneToMany(() => Invoice, (invoice) => invoice.userId, {
    eager: false,
  })
  invoices: Invoice[];

  /**
   * Defaults
   */
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp with time zone',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp with time zone',
  })
  updatedAt: Date;

  async validatePassword(password: string): Promise<boolean> {
    const result = await bcrypt.compare(password, this.password);
    return result;
  }
}
