export enum Role {
    STUDENT = 'STUDENT',
    PROFESSOR = 'PROFESSOR',
    ADMIN = 'ADMIN'
}

export enum SortOrder {
    ASCENDING = 'ASCENDING',
    DESCENDING = 'DESCENDING',
    UNSORTED = 'UNSORTED'
}

export interface User {
    id: string;
    email: string;
    username: string;
    password?: string;
    role: Role;
}

export interface Classroom {
    id: string;
    name: string;
    description?: string;
    professorId?: string;
    studentIds?: string[];
    courseIds?: string[];
}

export interface Grade {
    id: string;
    studentId: string;
    courseId: string;
    gradeValue: number;
    comment?: string;
    teacherId: string;
    semester: string;
    timestamp: number;
}

export interface ClassInput {
    name: string;
    description?: string;
    courseIds?: string[];
}

export interface SortInput {
    field: string;
    order: SortOrder;
}