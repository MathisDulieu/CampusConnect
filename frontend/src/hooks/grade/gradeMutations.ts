import { gql, useMutation } from '@apollo/client';

export const CREATE_GRADE_MUTATION = gql`
    mutation CreateGrade($studentId: ID!, $courseId: ID!, $gradeValue: Float!, $comment: String, $semester: String!) {
        createGrade(studentId: $studentId, courseId: $courseId, gradeValue: $gradeValue, comment: $comment, semester: $semester)
    }
`;

export const UPDATE_GRADE_MUTATION = gql`
    mutation UpdateGrade($gradeId: ID!, $gradeValue: Float, $comment: String, $semester: String) {
        updateGrade(gradeId: $gradeId, gradeValue: $gradeValue, comment: $comment, semester: $semester)
    }
`;

export const DELETE_GRADE_MUTATION = gql`
    mutation DeleteGrade($gradeId: ID!) {
        deleteGrade(gradeId: $gradeId)
    }
`;

export const useCreateGrade = () => {
    return useMutation(CREATE_GRADE_MUTATION);
};

export const useUpdateGrade = () => {
    return useMutation(UPDATE_GRADE_MUTATION);
};

export const useDeleteGrade = () => {
    return useMutation(DELETE_GRADE_MUTATION);
};