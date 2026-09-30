import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { User } from "./User";
import { Task } from "./Task";

@Entity()
export class Project {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column({ type: "varchar", nullable: true })
  description!: string | null;

  @ManyToOne(() => User, (user) => user.projects, { nullable: false, onDelete: "CASCADE" })
  owner!: User;

  @OneToMany(() => Task, (task) => task.project)
  tasks!: Task[];

  @CreateDateColumn()
  createdAt!: Date;
}
