import { gql, useMutation } from '@apollo/client';

export const CREATE_CLASS_MUTATION = gql`
    mutation CreateClass($name: String!, $description: String, $courseIds: [ID]) {
        createClass(name: $name, description: $description, courseIds: $courseIds)
    }
`;

export const UPDATE_CLASS_MUTATION = gql`
    mutation UpdateClass($id: ID!, $name: String, $description: String, $courseIds: [ID]) {
        updateClass(id: $id, name: $name, description: $description, courseIds: $courseIds)
    }
`;

export const DELETE_CLASS_MUTATION = gql`
    mutation DeleteClass($id: ID!) {
        deleteClass(id: $id)
    }
`;

export const ADD_STUDENT_TO_CLASS_MUTATION = gql`
    mutation AddStudentToClass($classId: ID!, $studentId: ID!) {
        addStudentToClass(classId: $classId, studentId: $studentId)
    }
`;

export const REMOVE_STUDENT_FROM_CLASS_MUTATION = gql`
    mutation RemoveStudentFromClass($classId: ID!, $studentId: ID!) {
        removeStudentFromClass(classId: $classId, studentId: $studentId)
    }
`;

export const useCreateClass = () => {
    return useMutation(CREATE_CLASS_MUTATION);
};

export const useUpdateClass = () => {
    return useMutation(UPDATE_CLASS_MUTATION);
};

export const useDeleteClass = () => {
    return useMutation(DELETE_CLASS_MUTATION);
};

export const useAddStudentToClass = () => {
    return useMutation(ADD_STUDENT_TO_CLASS_MUTATION);
};

export const useRemoveStudentFromClass = () => {
    return useMutation(REMOVE_STUDENT_FROM_CLASS_MUTATION);
};