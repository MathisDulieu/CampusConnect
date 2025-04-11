import { gql, useQuery } from '@apollo/client';
import { Grade } from '../type.ts';

export const GET_MY_GRADES_QUERY = gql`
    query GetMyGrades {
        myGrades {
            id
            studentId
            courseId
            gradeValue
            comment
            teacherId
            semester
            timestamp
        }
    }
`;

export const GET_MY_GRADES_FOR_COURSE_QUERY = gql`
    query GetMyGradesForCourse($courseId: ID!) {
        myGradesForCourse(courseId: $courseId) {
            id
            studentId
            courseId
            gradeValue
            comment
            teacherId
            semester
            timestamp
        }
    }
`;

export const GET_GRADES_FOR_STUDENT_QUERY = gql`
    query GetGradesForStudent($studentId: ID!) {
        gradesForStudent(studentId: $studentId) {
            id
            studentId
            courseId
            gradeValue
            comment
            teacherId
            semester
            timestamp
        }
    }
`;

export const useGetMyGrades = () => {
    return useQuery<{ myGrades: Grade[] }>(GET_MY_GRADES_QUERY);
};

export const useGetMyGradesForCourse = (courseId: string) => {
    return useQuery<{ myGradesForCourse: Grade[] }>(GET_MY_GRADES_FOR_COURSE_QUERY, {
        variables: { courseId },
        skip: !courseId
    });
};

export const useGetGradesForStudent = (studentId: string) => {
    return useQuery<{ gradesForStudent: Grade[] }>(GET_GRADES_FOR_STUDENT_QUERY, {
        variables: { studentId },
        skip: !studentId
    });
};