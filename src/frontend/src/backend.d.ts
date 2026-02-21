import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Company {
    id: bigint;
    name: string;
    location: string;
    industry: string;
}
export interface StudentProfile {
    bio: string;
    principal: Principal;
    cgpa: number;
    name: string;
    email: string;
    resumeLink: string;
    branches: Array<string>;
    skills: Array<string>;
}
export type Time = bigint;
export interface JobApplication {
    status: ApplicationStatus;
    submittedTime: Time;
    studentId: Principal;
    jobId: bigint;
    jobTitle: string;
    companyName: string;
}
export interface JobPosting {
    id: bigint;
    title: string;
    minCGPA: number;
    postedTime: Time;
    description: string;
    logoUrl?: string;
    eligibleBranches: Array<string>;
    salaryRange: [bigint, bigint];
    requiredSkills: Array<string>;
    companyId: bigint;
}
export interface UserProfile {
    bio: string;
    principal: Principal;
    cgpa: number;
    name: string;
    email: string;
    resumeLink: string;
    branches: Array<string>;
    skills: Array<string>;
}
export enum ApplicationStatus {
    interviewed = "interviewed",
    applied = "applied",
    rejected = "rejected",
    reviewed = "reviewed",
    offered = "offered"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addCompany(name: string, industry: string, location: string): Promise<bigint>;
    addJobPosting(companyId: bigint, title: string, description: string, requiredSkills: Array<string>, minCGPA: number, eligibleBranches: Array<string>, salaryRange: [bigint, bigint], logoUrl: string | null): Promise<bigint>;
    applyForJob(jobId: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createStudentProfile(name: string, email: string, cgpa: number, branches: Array<string>, skills: Array<string>, resumeLink: string, bio: string): Promise<void>;
    getAppliedJobs(): Promise<Array<JobApplication>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCompanies(): Promise<Array<Company>>;
    getJobApplication(studentId: Principal, jobId: bigint): Promise<JobApplication | null>;
    getJobPostings(): Promise<Array<JobPosting>>;
    getJobPostingsByCompany(companyId: bigint): Promise<Array<JobPosting>>;
    getStudentProfile(principal: Principal): Promise<StudentProfile | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateApplicationStatus(studentId: Principal, jobId: bigint, status: ApplicationStatus): Promise<void>;
    updateStudentProfile(name: string, email: string, cgpa: number, branches: Array<string>, skills: Array<string>, resumeLink: string, bio: string): Promise<void>;
}
