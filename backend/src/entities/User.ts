import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm";
import { Project } from "./Project";
import { Task } from "./Task";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  passwordHash!: string;

  @Column()
  name!: string;

  @OneToMany(() => Project, (project) => project.owner)
  projects!: Project[];

  @OneToMany(() => Task, (task) => task.assignee)
  assignedTasks!: Task[];

  @CreateDateColumn()
  createdAt!: Date;
}
