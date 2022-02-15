import { AfterInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Exclude } from "class-transformer";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @AfterInsert()
  logUserInserted() {
    console.log(`User Registered in DB with ID = ${this.id}`);
  }
}
