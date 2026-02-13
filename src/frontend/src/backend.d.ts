import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Task {
    id: bigint;
    title: string;
    isCompleted: boolean;
    owner: Principal;
    reminderTime?: Time;
}
export interface Assignment {
    id: bigint;
    title: string;
    owner: Principal;
    dueDate?: Time;
    taskId: bigint;
    subjectId: bigint;
}
export type Time = bigint;
export interface UserProfile {
    name: string;
}
export interface StudySubject {
    id: bigint;
    title: string;
    assignments: Array<Assignment>;
    owner: Principal;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addAssignment(subjectId: bigint, title: string, dueDate: Time | null): Promise<bigint | null>;
    addTask(title: string): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearTaskReminder(taskId: bigint): Promise<void>;
    completeAssignment(taskId: bigint): Promise<void>;
    completeTask(id: bigint): Promise<void>;
    createSubject(title: string): Promise<bigint>;
    deleteTask(id: bigint): Promise<void>;
    getAllTasks(): Promise<Array<Task>>;
    getAssignments(subjectId: bigint): Promise<Array<Assignment> | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getSubjects(): Promise<Array<StudySubject>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setTaskReminder(taskId: bigint, reminderTime: Time): Promise<void>;
}
