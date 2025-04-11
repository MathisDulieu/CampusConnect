import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useGetMe} from '../../hooks/user/userQueries';
import {useGetClasses, useGetClassById, useGetStudentsInClass} from '../../hooks/class/classQueries';
import {useGetGradesForStudent} from '../../hooks/grade/gradeQueries';
import {useCreateGrade, useUpdateGrade, useDeleteGrade} from '../../hooks/grade/gradeMutations';
import {
    useCreateClass,
    useUpdateClass,
    useDeleteClass,
    useAddStudentToClass,
    useRemoveStudentFromClass
} from '../../hooks/class/classMutations';
import {Role, User, Classroom} from '../../hooks/type.ts';
import StudentDashboard from "../student/Dashboard.tsx";

const ProfessorDashboard: React.FC = () => {
    const navigate = useNavigate();

    const [selectedClassId, setSelectedClassId] = useState<string>('');
    const [selectedStudentId, setSelectedStudentId] = useState<string>('');
    const [selectedCourseId, setSelectedCourseId] = useState<string>('');

    const [gradeValue, setGradeValue] = useState<number>(0);
    const [gradeComment, setGradeComment] = useState<string>('');
    const [gradeSemester, setGradeSemester] = useState<string>('');

    const [className, setClassName] = useState<string>('');
    const [classDescription, setClassDescription] = useState<string>('');
    const [classCourseIds, setClassCourseIds] = useState<string[]>([]);
    const [newCourseId, setNewCourseId] = useState<string>('');

    const [newStudentId, setNewStudentId] = useState<string>('');

    const [message, setMessage] = useState<string>('');
    const [error, setError] = useState<string>('');

    const {data: userData, loading: loadingUser, error: userError} = useGetMe();

    const {data: classesData, loading: loadingClasses, error: classesError, refetch: refetchClasses} = useGetClasses();

    const {
        data: classData,
        loading: loadingClass,
        error: classError,
        refetch: refetchClass
    } = useGetClassById(selectedClassId);

    const {
        data: studentsData,
        loading: loadingStudents,
        error: studentsError,
        refetch: refetchStudents
    } = useGetStudentsInClass(selectedClassId);

    const {
        data: gradesData,
        loading: loadingGrades,
        error: gradesError,
        refetch: refetchGrades
    } = useGetGradesForStudent(selectedStudentId);

    const [createGrade, {loading: creatingGrade}] = useCreateGrade();
    const [updateGrade, {loading: updatingGrade}] = useUpdateGrade();
    const [deleteGrade, {loading: deletingGrade}] = useDeleteGrade();
    const [createClass, {loading: creatingClass}] = useCreateClass();
    const [updateClass, {loading: updatingClass}] = useUpdateClass();
    const [deleteClass, {loading: deletingClass}] = useDeleteClass();
    const [addStudent, {loading: addingStudent}] = useAddStudentToClass();
    const [removeStudent, {loading: removingStudent}] = useRemoveStudentFromClass();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/login');
            return;
        }

        if (userData?.me && userData.me.role !== Role.PROFESSOR && userData.me.role !== Role.ADMIN) {
            navigate('/student-dashboard');
        }
    }, [userData, navigate]);

    useEffect(() => {
        if (selectedClassId) {
            refetchClass();
            refetchStudents();
            setSelectedStudentId('');
        }
    }, [selectedClassId, refetchClass, refetchStudents]);

    useEffect(() => {
        if (selectedStudentId) {
            refetchGrades();
        }
    }, [selectedStudentId, refetchGrades]);

    const handleCreateClass = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const {data} = await createClass({
                variables: {
                    name: className,
                    description: classDescription,
                    courseIds: classCourseIds
                }
            });

            if (data?.createClass) {
                setMessage('Class created successfully');
                setClassName('');
                setClassDescription('');
                setClassCourseIds([]);
                refetchClasses();
            } else {
                setError('Failed to create class');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred while creating class');
        }
    };

    const handleAddCourseToList = () => {
        if (newCourseId && !classCourseIds.includes(newCourseId)) {
            setClassCourseIds([...classCourseIds, newCourseId]);
            setNewCourseId('');
        }
    };

    const handleRemoveCourseFromList = (courseId: string) => {
        setClassCourseIds(classCourseIds.filter(id => id !== courseId));
    };

    const handleDeleteClass = async () => {
        if (!selectedClassId || !window.confirm('Are you sure you want to delete this class?')) {
            return;
        }

        try {
            const {data} = await deleteClass({
                variables: {id: selectedClassId}
            });

            if (data?.deleteClass) {
                setMessage('Class deleted successfully');
                setSelectedClassId('');
                refetchClasses();
            } else {
                setError('Failed to delete class');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred while deleting class');
        }
    };

    const handleAddStudent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedClassId || !newStudentId) return;

        try {
            const {data} = await addStudent({
                variables: {
                    classId: selectedClassId,
                    studentId: newStudentId
                }
            });

            if (data?.addStudentToClass) {
                setMessage('Student added to class successfully');
                setNewStudentId('');
                refetchStudents();
                refetchClass();
            } else {
                setError('Failed to add student to class');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred while adding student');
        }
    };

    const handleRemoveStudent = async (studentId: string) => {
        if (!selectedClassId || !window.confirm('Are you sure you want to remove this student from the class?')) {
            return;
        }

        try {
            const {data} = await removeStudent({
                variables: {
                    classId: selectedClassId,
                    studentId
                }
            });

            if (data?.removeStudentFromClass) {
                setMessage('Student removed from class successfully');
                if (selectedStudentId === studentId) {
                    setSelectedStudentId('');
                }
                refetchStudents();
                refetchClass();
            } else {
                setError('Failed to remove student from class');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred while removing student');
        }
    };

    const handleCreateGrade = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedStudentId || !selectedCourseId) return;

        try {
            const {data} = await createGrade({
                variables: {
                    studentId: selectedStudentId,
                    courseId: selectedCourseId,
                    gradeValue,
                    comment: gradeComment,
                    semester: gradeSemester
                }
            });

            if (data?.createGrade) {
                setMessage('Grade created successfully');
                setGradeValue(0);
                setGradeComment('');
                setGradeSemester('');
                refetchGrades();
            } else {
                setError('Failed to create grade');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred while creating grade');
        }
    };

    const handleDeleteGrade = async (gradeId: string) => {
        if (!window.confirm('Are you sure you want to delete this grade?')) {
            return;
        }

        try {
            const {data} = await deleteGrade({
                variables: {gradeId}
            });

            if (data?.deleteGrade) {
                setMessage('Grade deleted successfully');
                refetchGrades();
            } else {
                setError('Failed to delete grade');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred while deleting grade');
        }
    };

    if (loadingUser || loadingClasses) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Loading dashboard...</div>
            </div>
        );
    }

    if (userError || classesError) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    Error: {userError?.message || classesError?.message}
                </div>
                <button
                    className="bg-blue-500 text-white py-2 px-4 rounded"
                    onClick={() => {
                        localStorage.removeItem('authToken');
                        navigate('/login');
                    }}
                >
                    Logout
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <main className="flex-grow">
                <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Professor Dashboard</h1>

                    {message && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white shadow rounded-lg p-6">
                            <h2 className="text-xl font-semibold mb-4">Create New Class</h2>

                            <form onSubmit={handleCreateClass}>
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-2" htmlFor="className">
                                        Class Name
                                    </label>
                                    <input
                                        id="className"
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded"
                                        value={className}
                                        onChange={(e) => setClassName(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-2" htmlFor="classDescription">
                                        Description
                                    </label>
                                    <textarea
                                        id="classDescription"
                                        className="w-full px-3 py-2 border border-gray-300 rounded"
                                        value={classDescription}
                                        onChange={(e) => setClassDescription(e.target.value)}
                                        rows={3}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-2">
                                        Course IDs
                                    </label>
                                    <div className="flex mb-2">
                                        <input
                                            type="text"
                                            className="flex-grow px-3 py-2 border border-gray-300 rounded-l"
                                            value={newCourseId}
                                            onChange={(e) => setNewCourseId(e.target.value)}
                                            placeholder="Enter course ID"
                                        />
                                        <button
                                            type="button"
                                            className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
                                            onClick={handleAddCourseToList}
                                        >
                                            Add
                                        </button>
                                    </div>
                                    {classCourseIds.length > 0 && (
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-700 mb-1">Added Courses:</p>
                                            <ul className="space-y-1">
                                                {classCourseIds.map((courseId) => (
                                                    <li key={courseId}
                                                        className="flex justify-between items-center bg-gray-100 px-3 py-1 rounded">
                                                        <span>{courseId}</span>
                                                        <button
                                                            type="button"
                                                            className="text-red-500 hover:text-red-700"
                                                            onClick={() => handleRemoveCourseFromList(courseId)}
                                                        >
                                                            Remove
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300"
                                    disabled={creatingClass}
                                >
                                    {creatingClass ? 'Creating...' : 'Create Class'}
                                </button>
                            </form>
                        </div>

                        <div className="bg-white shadow rounded-lg p-6">
                            <h2 className="text-xl font-semibold mb-4">Manage Classes</h2>

                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2" htmlFor="selectClass">
                                    Select Class
                                </label>
                                <select
                                    id="selectClass"
                                    className="w-full px-3 py-2 border border-gray-300 rounded"
                                    value={selectedClassId}
                                    onChange={(e) => setSelectedClassId(e.target.value)}
                                >
                                    <option value="">Select a class</option>
                                    {classesData?.classes && classesData.classes.map((classroom) => (
                                        <option key={classroom.id} value={classroom.id}>
                                            {classroom.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {selectedClassId && (
                                <>
                                    {loadingClass ? (
                                        <p className="text-gray-500">Loading class details...</p>
                                    ) : classError ? (
                                        <p className="text-red-500">Error: {classError.message}</p>
                                    ) : classData?.classById && (
                                        <div className="mb-6">
                                            <div className="flex justify-between items-center mb-2">
                                                <h3 className="text-lg font-medium">{classData.classById.name}</h3>
                                                <button
                                                    onClick={handleDeleteClass}
                                                    className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 disabled:bg-red-300 text-sm"
                                                    disabled={deletingClass}
                                                >
                                                    {deletingClass ? 'Deleting...' : 'Delete Class'}
                                                </button>
                                            </div>
                                            <p className="text-gray-600 mb-2">{classData.classById.description}</p>
                                            <div className="text-sm text-gray-500">
                                                <p>Professor ID: {classData.classById.professorId}</p>
                                                <p>Course IDs: {classData.classById.courseIds?.join(', ') || 'None'}</p>
                                            </div>
                                        </div>
                                    )}

                                    <h3 className="text-lg font-medium mb-2">Add Student to Class</h3>
                                    <form onSubmit={handleAddStudent} className="mb-6">
                                        <div className="flex mb-2">
                                            <input
                                                type="text"
                                                className="flex-grow px-3 py-2 border border-gray-300 rounded-l"
                                                value={newStudentId}
                                                onChange={(e) => setNewStudentId(e.target.value)}
                                                placeholder="Enter student ID"
                                                required
                                            />
                                            <button
                                                type="submit"
                                                className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 disabled:bg-blue-300"
                                                disabled={addingStudent}
                                            >
                                                {addingStudent ? 'Adding...' : 'Add'}
                                            </button>
                                        </div>
                                    </form>

                                    <h3 className="text-lg font-medium mb-2">Students in Class</h3>
                                    {loadingStudents ? (
                                        <p className="text-gray-500">Loading students...</p>
                                    ) : studentsError ? (
                                        <p className="text-red-500">Error: {studentsError.message}</p>
                                    ) : studentsData?.studentsInClass && studentsData.studentsInClass.length > 0 ? (
                                        <ul className="divide-y divide-gray-200">
                                            {studentsData.studentsInClass.map((student) => (
                                                <li key={student.id} className="py-3 flex justify-between items-center">
                                                    <div>
                                                        <div className="font-medium">{student.username}</div>
                                                        <div className="text-sm text-gray-500">{student.email}</div>
                                                    </div>
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => setSelectedStudentId(student.id)}
                                                            className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 text-sm"
                                                        >
                                                            View Grades
                                                        </button>
                                                        <button
                                                            onClick={() => handleRemoveStudent(student.id)}
                                                            className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 disabled:bg-red-300 text-sm"
                                                            disabled={removingStudent}
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-gray-500">No students in this class.</p>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {selectedStudentId && (
                        <div className="bg-white shadow rounded-lg p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">
                                    {studentsData?.studentsInClass &&
                                        studentsData.studentsInClass.find(s => s.id === selectedStudentId)?.username} -
                                    Grades
                                </h2>
                                <button
                                    onClick={() => setSelectedStudentId('')}
                                    className="text-blue-500 hover:text-blue-700"
                                >
                                    Back to Students
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-lg font-medium mb-3">Current Grades</h3>
                                    {loadingGrades ? (
                                        <p className="text-gray-500">Loading grades...</p>
                                    ) : gradesError ? (
                                        <p className="text-red-500">Error: {gradesError.message}</p>
                                    ) : gradesData?.gradesForStudent && gradesData.gradesForStudent.length > 0 ? (
                                        <ul className="divide-y divide-gray-200">
                                            {gradesData.gradesForStudent.map((grade) => (
                                                <li key={grade.id} className="py-3">
                                                    <div className="flex justify-between items-center">
                                                        <span className="font-medium">Course: {grade.courseId}</span>
                                                        <span className={`font-bold ${
                                                            grade.gradeValue >= 16 ? 'text-green-600' :
                                                                grade.gradeValue >= 10 ? 'text-blue-600' : 'text-red-600'
                                                        }`}>
                                                            {grade.gradeValue.toFixed(1)}/20
                                                        </span>
                                                    </div>
                                                    {grade.comment && (
                                                        <div
                                                            className="text-sm text-gray-500 mt-1">{grade.comment}</div>
                                                    )}
                                                    <div className="flex justify-between items-center mt-2">
                                                        <div className="text-xs text-gray-400">
                                                            Semester: {grade.semester} |
                                                            Date: {new Date(grade.timestamp).toLocaleDateString()}
                                                        </div>
                                                        <button
                                                            onClick={() => handleDeleteGrade(grade.id)}
                                                            className="text-red-500 hover:text-red-700 text-sm"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-gray-500">No grades found for this student.</p>
                                    )}
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium mb-3">Add New Grade</h3>
                                    <form onSubmit={handleCreateGrade}>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 mb-2" htmlFor="courseSelect">
                                                Course
                                            </label>
                                            <select
                                                id="courseSelect"
                                                className="w-full px-3 py-2 border border-gray-300 rounded"
                                                value={selectedCourseId}
                                                onChange={(e) => setSelectedCourseId(e.target.value)}
                                                required
                                            >
                                                <option value="">Select a course</option>
                                                {classData?.classById?.courseIds?.map((courseId) => (
                                                    <option key={courseId} value={courseId}>
                                                        {courseId}
                                                    </option>
                                                )) || []}
                                            </select>
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-gray-700 mb-2" htmlFor="gradeValue">
                                                Grade Value (0-20)
                                            </label>
                                            <input
                                                id="gradeValue"
                                                type="number"
                                                min="0"
                                                max="20"
                                                step="0.1"
                                                className="w-full px-3 py-2 border border-gray-300 rounded"
                                                value={gradeValue}
                                                onChange={(e) => setGradeValue(parseFloat(e.target.value))}
                                                required
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-gray-700 mb-2" htmlFor="gradeSemester">
                                                Semester
                                            </label>
                                            <input
                                                id="gradeSemester"
                                                type="text"
                                                className="w-full px-3 py-2 border border-gray-300 rounded"
                                                value={gradeSemester}
                                                onChange={(e) => setGradeSemester(e.target.value)}
                                                placeholder="e.g. S1-2024"
                                                required
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-gray-700 mb-2" htmlFor="gradeComment">
                                                Comment
                                            </label>
                                            <textarea
                                                id="gradeComment"
                                                className="w-full px-3 py-2 border border-gray-300 rounded"
                                                value={gradeComment}
                                                onChange={(e) => setGradeComment(e.target.value)}
                                                rows={3}
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300"
                                            disabled={creatingGrade || !selectedCourseId}
                                        >
                                            {creatingGrade ? 'Adding Grade...' : 'Add Grade'}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
                    </div>
            </main>
        </div>
    )
}

export default ProfessorDashboard;
