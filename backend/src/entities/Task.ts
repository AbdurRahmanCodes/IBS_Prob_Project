import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from "typeorm";
import { User } from "./User";
import { Project } from "./Project";

export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
}

export enum TaskPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

@Entity()
export class Task {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  title!: string;

  @Column({ type: "varchar", nullable: true })
  description!: string | null;

  @Column({ type: "enum", enum: TaskStatus, default: TaskStatus.TODO })
  status!: TaskStatus;

  @Column({ type: "enum", enum: TaskPriority, default: TaskPriority.MEDIUM })
  priority!: TaskPriority;

  @Column({ type: "timestamp", nullable: true })
  dueDate!: Date | null;

  @ManyToOne(() => Project, (project) => project.tasks, { nullable: false, onDelete: "CASCADE" })
  project!: Project;

  @ManyToOne(() => User, (user) => user.assignedTasks, { nullable: true, onDelete: "SET NULL" })
  assignee!: User | null;

  @CreateDateColumn()
  createdAt!: Date;
}
