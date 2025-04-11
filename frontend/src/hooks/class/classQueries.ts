import { gql, useQuery } from '@apollo/client';
import { Classroom, User } from '../type.ts';

export const GET_CLASSES_QUERY = gql`
    query GetClasses {
        classes {
            id
            name
            description
            professorId
            studentIds
            courseIds
        }
    }
`;

export const GET_CLASSES_SORTED_QUERY = gql`
    query GetClassesSorted($order: String!) {
        classesSorted(order: $order) {
            id
            name
            description
            professorId
            studentIds
            courseIds
        }
    }
`;

export const GET_CLASS_BY_ID_QUERY = gql`
    query GetClassById($id: ID!) {
        classById(id: $id) {
            id
            name
            description
            professorId
            studentIds
            courseIds
        }
    }
`;

export const GET_STUDENTS_IN_CLASS_QUERY = gql`
    query GetStudentsInClass($classId: ID!) {
        studentsInClass(classId: $classId) {
            id
            email
            username
            role
        }
    }
`;

export const useGetClasses = () => {
    return useQuery<{ classes: Classroom[] }>(GET_CLASSES_QUERY);
};

export const useGetClassesSorted = (order: string) => {
    return useQuery<{ classesSorted: Classroom[] }>(GET_CLASSES_SORTED_QUERY, {
        variables: { order }
    });
};

export const useGetClassById = (id: string) => {
    return useQuery<{ classById: Classroom }>(GET_CLASS_BY_ID_QUERY, {
        variables: { id },
        skip: !id
    });
};

export const useGetStudentsInClass = (classId: string) => {
    return useQuery<{ studentsInClass: User[] }>(GET_STUDENTS_IN_CLASS_QUERY, {
        variables: { classId },
        skip: !classId
    });
};