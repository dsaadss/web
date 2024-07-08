// Sample database structure
const database = {
    users: [
        { username: 'lecturer1', password: '123456' },
        { username: 'lecturer2', password: '123456' }
    ],
    courses: [
        {
            id: 'C001',
            name: 'Math 101',
            lectures: [
                { title: 'Lecture 1', date: new Date(2024, 0, 7), attendanceCount: null },
                { title: 'Lecture 2', date: new Date(2024, 0, 14), attendanceCount: null },
                { title: 'Lecture 3', date: new Date(2024, 0, 21), attendanceCount: null },
                { title: 'Lecture 4', date: new Date(2024, 0, 28), attendanceCount: null },
                { title: 'Lecture 5', date: new Date(2024, 1, 4), attendanceCount: null }
            ]
        },
        {
            id: 'C002',
            name: 'Physics 201',
            lectures: [
                { title: 'Lecture 1', date: new Date(2024, 0, 7), attendanceCount: null },
                { title: 'Lecture 2', date: new Date(2024, 0, 14), attendanceCount: null },
                { title: 'Lecture 3', date: new Date(2024, 0, 21), attendanceCount: null },
                { title: 'Lecture 4', date: new Date(2024, 0, 28), attendanceCount: null },
                { title: 'Lecture 5', date: new Date(2024, 1, 4), attendanceCount: null }
            ]
        }
    ],
    students: [
        { id: 'S001', name: 'Alice', attendance: {'C001': ['Present', 'Absent', 'Present', 'Present', 'Absent'], 'C002': ['Present', 'Present', 'Absent', 'Present', 'Present']} },
        { id: 'S002', name: 'Bob', attendance: {'C001': ['Absent', 'Present', 'Absent', 'Absent', 'Present'], 'C002': ['Absent', 'Absent', 'Present', 'Absent', 'Absent']} }
    ]
};

let currentCourseID = null;
let currentLectureIndex = null;
let currentButton = null;

function login() {
    const username = document.getElementById('usernameInput').value.trim();
    const password = document.getElementById('passwordInput').value.trim();

    const user = database.users.find(user => user.username === username && user.password === password);

    if (user) {
        document.getElementById('loginPage').classList.add('hidden');
        document.getElementById('attendancePage').classList.remove('hidden');
    } else {
        alert('Invalid username or password');
    }
}

function logout() {
    document.getElementById('attendancePage').classList.add('hidden');
    document.getElementById('loginPage').classList.remove('hidden');
}

function loadCourseData() {
    const courseID = document.getElementById('courseIDInput').value.trim();
    const course = database.courses.find(c => c.id === courseID);
    
    const lectureList = document.getElementById('lectureList');
    const studentList = document.getElementById('studentList');
    
    lectureList.innerHTML = '';  // Clear previous data
    studentList.innerHTML = '';  // Clear previous data

    if (course) {
        course.lectures.forEach((lecture, index) => {
            const li = document.createElement('li');
            li.classList.add('flex', 'items-center', 'mb-2');

            const lectureInfo = document.createElement('span');
            lectureInfo.textContent = `${lecture.title} on ${lecture.date.toDateString()}`;
            lectureInfo.classList.add('mr-4');

            const button = document.createElement('button');
            button.textContent = `Show Students (${lecture.attendanceCount !== null ? lecture.attendanceCount + '/' + database.students.length : '0/' + database.students.length})`;
            button.classList.add('bg-blue-500', 'text-white', 'p-2', 'rounded');
            button.onclick = () => {
                currentCourseID = courseID;
                currentLectureIndex = index;
                currentButton = button;
                loadStudentsForLecture(courseID, index);
            };

            li.appendChild(lectureInfo);
            li.appendChild(button);
            lectureList.appendChild(li);
        });
    } else {
        lectureList.innerHTML = '<li>No lectures found for this course ID.</li>';
    }
}

function loadStudentsForLecture(courseID, lectureIndex) {
    const studentList = document.getElementById('studentList');
    studentList.innerHTML = '';  // Clear previous data

    database.students.forEach(student => {
        if (student.attendance[courseID]) {
            const li = document.createElement('li');
            li.classList.add('flex', 'items-center', 'mb-2');

            const studentName = document.createElement('span');
            studentName.textContent = `${student.name} (${student.id})`;
            studentName.classList.add('mr-4');

            const attendanceCheckbox = document.createElement('input');
            attendanceCheckbox.type = 'checkbox';
            attendanceCheckbox.checked = student.attendance[courseID][lectureIndex] === 'Present';
            attendanceCheckbox.classList.add('mr-2');
            attendanceCheckbox.onchange = () => updateAttendance(student.id, courseID, lectureIndex, attendanceCheckbox.checked);

            li.appendChild(studentName);
            li.appendChild(attendanceCheckbox);

            studentList.appendChild(li);
        }
    });
}

function submitAttendance() {
    if (currentCourseID === null || currentLectureIndex === null) {
        alert('Please select a lecture first.');
        return;
    }

    const studentsPresent = database.students.filter(student => student.attendance[currentCourseID][currentLectureIndex] === 'Present').length;
    const course = database.courses.find(course => course.id === currentCourseID);
    course.lectures[currentLectureIndex].attendanceCount = studentsPresent;

    if (currentButton) {
        currentButton.textContent = `Show Students (${studentsPresent}/${database.students.length})`;
    }
}

function updateAttendance(studentID, courseID, lectureIndex, isPresent) {
    const student = database.students.find(s => s.id === studentID);
    if (student) {
        student.attendance[courseID][lectureIndex] = isPresent ? 'Present' : 'Absent';
    }
}
