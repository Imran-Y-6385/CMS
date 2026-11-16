
// =====================================
// COLLEGE MANAGEMENT SYSTEM
// JavaScript Main File
// =====================================

// Load saved records from browser storage

function loadData(key) {
    try {
        return JSON.parse(localStorage.getItem(key)) || [];
    } catch {
        return [];
    }
}

let students = loadData("cms_students");
let faculty = loadData("cms_faculty");
let attendance = loadData("cms_attendance");
let marks = loadData("cms_marks");
let fees = loadData("cms_fees");

// Save records

function saveData() {
    localStorage.setItem("cms_students", JSON.stringify(students));
    localStorage.setItem("cms_faculty", JSON.stringify(faculty));
    localStorage.setItem("cms_attendance", JSON.stringify(attendance));
    localStorage.setItem("cms_marks", JSON.stringify(marks));
    localStorage.setItem("cms_fees", JSON.stringify(fees));
}

// Generate IDs

function generateId() {
    return Date.now() + Math.floor(Math.random() * 1000);
}

// Prevent user-entered HTML from being interpreted as markup

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

// =====================================
// PAGE NAVIGATION
// =====================================

const navLinks = document.querySelectorAll(".sidebar nav a");
const pages = document.querySelectorAll(".page");
const pageTitle = document.getElementById("pageTitle");

navLinks.forEach(link => {
    link.addEventListener("click", function(event) {
        event.preventDefault();

        const page = this.dataset.page;

        pages.forEach(section => {
            section.classList.remove("active");
        });

        navLinks.forEach(item => {
            item.classList.remove("active");
        });

        document.getElementById(page).classList.add("active");
        this.classList.add("active");

        pageTitle.textContent =
            this.textContent.trim().replace(/^[^\s]+\s/, "");
    });
});

// =====================================
// STUDENT MANAGEMENT
// =====================================

const studentModal = document.getElementById("studentModal");

document.getElementById("addStudentBtn").onclick = () => {
    document.getElementById("studentForm").reset();
    studentModal.classList.add("show");
};

document.getElementById("closeStudentModal").onclick = () => {
    studentModal.classList.remove("show");
};

document.getElementById("studentForm").addEventListener(
    "submit", function(event) {

    event.preventDefault();

    const student = {
        id: generateId(),
        name: document.getElementById("studentName").value.trim(),
        email: document.getElementById("studentEmail").value.trim(),
        department: document.getElementById("studentDepartment").value,
        year: document.getElementById("studentYear").value
    };

    if (students.some(s =>
        s.email.toLowerCase() === student.email.toLowerCase()
    )) {
        alert("This student email already exists!");
        return;
    }

    students.push(student);

    saveData();
    renderAll();

    this.reset();
    studentModal.classList.remove("show");

    alert("Student added successfully!");
});

// Display students

function renderStudents() {

    const table = document.getElementById("studentTable");

    table.innerHTML = students.map(student => `
        <tr>
            <td>${student.id}</td>
            <td>${escapeHTML(student.name)}</td>
            <td>${escapeHTML(student.email)}</td>
            <td>${escapeHTML(student.department)}</td>
            <td>${escapeHTML(student.year)}</td>
            <td>
                <button class="delete-btn"
                    data-delete-student="${student.id}">
                    Delete
                </button>
            </td>
        </tr>
    `).join("");

    document.getElementById("recentStudents").innerHTML =
        students.slice(-5).reverse().map(student => `
        <tr>
            <td>${student.id}</td>
            <td>${escapeHTML(student.name)}</td>
            <td>${escapeHTML(student.email)}</td>
            <td>${escapeHTML(student.department)}</td>
        </tr>
    `).join("");
}

// Search students

document.getElementById("studentSearch").addEventListener(
    "input", function() {

    const search = this.value.toLowerCase();

    const filtered = students.filter(student =>
        student.name.toLowerCase().includes(search) ||
        student.email.toLowerCase().includes(search) ||
        student.department.toLowerCase().includes(search)
    );

    document.getElementById("studentTable").innerHTML =
        filtered.map(student => `
        <tr>
            <td>${student.id}</td>
            <td>${escapeHTML(student.name)}</td>
            <td>${escapeHTML(student.email)}</td>
            <td>${escapeHTML(student.department)}</td>
            <td>${escapeHTML(student.year)}</td>
            <td>
                <button class="delete-btn"
                    data-delete-student="${student.id}">
                    Delete
                </button>
            </td>
        </tr>
    `).join("");
});

// Delete student

document.getElementById("studentTable").addEventListener(
    "click", function(event) {

    const id = Number(event.target.dataset.deleteStudent);

    if (!id) return;

    if (confirm("Delete this student and related records?")) {
        students = students.filter(s => s.id !== id);
        attendance = attendance.filter(a => a.studentId !== id);
        marks = marks.filter(m => m.studentId !== id);
        fees = fees.filter(f => f.studentId !== id);

        saveData();
        renderAll();
    }
});

// =====================================
// FACULTY MANAGEMENT
// =====================================

const facultyModal = document.getElementById("facultyModal");

document.getElementById("addFacultyBtn").onclick = () => {
    document.getElementById("facultyForm").reset();
    facultyModal.classList.add("show");
};

document.getElementById("closeFacultyModal").onclick = () => {
    facultyModal.classList.remove("show");
};

document.getElementById("facultyForm").addEventListener(
    "submit", function(event) {

    event.preventDefault();

    const teacher = {
        id: generateId(),
        name: document.getElementById("facultyName").value.trim(),
        email: document.getElementById("facultyEmail").value.trim(),
        department: document.getElementById("facultyDepartment").value
    };

    if (faculty.some(f =>
        f.email.toLowerCase() === teacher.email.toLowerCase()
    )) {
        alert("Faculty email already exists!");
        return;
    }

    faculty.push(teacher);

    saveData();
    renderAll();

    this.reset();
    facultyModal.classList.remove("show");

    alert("Faculty added successfully!");
});

function renderFaculty() {

    document.getElementById("facultyTable").innerHTML =
        faculty.map(teacher => `
        <tr>
            <td>${teacher.id}</td>
            <td>${escapeHTML(teacher.name)}</td>
            <td>${escapeHTML(teacher.email)}</td>
            <td>${escapeHTML(teacher.department)}</td>
            <td>
                <button class="delete-btn"
                    data-delete-faculty="${teacher.id}">
                    Delete
                </button>
            </td>
        </tr>
    `).join("");
}

document.getElementById("facultyTable").addEventListener(
    "click", function(event) {

    const id = Number(event.target.dataset.deleteFaculty);

    if (!id) return;

    if (confirm("Delete this faculty member?")) {
        faculty = faculty.filter(f => f.id !== id);
        saveData();
        renderAll();
    }
});

// =====================================
// STUDENT DROPDOWN
// =====================================

function updateStudentDropdowns() {

    const dropdowns = [
        "attendanceStudent",
        "marksStudent",
        "feesStudent"
    ];

    dropdowns.forEach(id => {

        const select = document.getElementById(id);
        const previous = select.value;

        select.innerHTML =
            '<option value="">Select Student</option>' +
            students.map(student => `
                <option value="${student.id}">
                    ${escapeHTML(student.name)}
                </option>
            `).join("");

        if (students.some(s => String(s.id) === previous)) {
            select.value = previous;
        }
    });
}

// =====================================
// ATTENDANCE MANAGEMENT
// =====================================

document.getElementById("attendanceForm").addEventListener(
    "submit", function(event) {

    event.preventDefault();

    const studentId = Number(
        document.getElementById("attendanceStudent").value
    );

    const date = document.getElementById("attendanceDate").value;

    const status = document.getElementById("attendanceStatus").value;

    const exists = attendance.some(a =>
        a.studentId === studentId && a.date === date
    );

    if (exists) {
        alert("Attendance already recorded for this date!");
        return;
    }

    attendance.push({
        studentId,
        date,
        status
    });

    saveData();
    renderAll();

    this.reset();

    alert("Attendance saved successfully!");
});

function renderAttendance() {

    document.getElementById("attendanceTable").innerHTML =
        attendance.map(record => {

            const student = students.find(
                s => s.id === record.studentId
            );

            if (!student) return "";

            return `
                <tr>
                    <td>${escapeHTML(student.name)}</td>
                    <td>${escapeHTML(record.date)}</td>
                    <td>${escapeHTML(record.status)}</td>
                </tr>
            `;
        }).join("");
}

// =====================================
// MARKS MANAGEMENT
// =====================================

document.getElementById("marksForm").addEventListener(
    "submit", function(event) {

    event.preventDefault();

    const studentId = Number(
        document.getElementById("marksStudent").value
    );

    const subject = document.getElementById("subject").value.trim();

    const mark = Number(
        document.getElementById("markValue").value
    );

    if (!Number.isInteger(mark) || mark < 0 || mark > 100) {
        alert("Enter marks between 0 and 100!");
        return;
    }

    marks.push({
        studentId,
        subject,
        mark
    });

    saveData();
    renderAll();

    this.reset();

    alert("Marks saved successfully!");
});

function renderMarks() {

    document.getElementById("marksTable").innerHTML =
        marks.map(record => {

            const student = students.find(
                s => s.id === record.studentId
            );

            if (!student) return "";

            return `
                <tr>
                    <td>${escapeHTML(student.name)}</td>
                    <td>${escapeHTML(record.subject)}</td>
                    <td>${record.mark}/100</td>
                </tr>
            `;
        }).join("");
}

// =====================================
// FEES MANAGEMENT
// =====================================

document.getElementById("feesForm").addEventListener(
    "submit", function(event) {

    event.preventDefault();

    const studentId = Number(
        document.getElementById("feesStudent").value
    );

    const amount = Number(
        document.getElementById("feeAmount").value
    );

    const status = document.getElementById("feeStatus").value;

    if (!Number.isFinite(amount) || amount <= 0) {
        alert("Enter a valid fee amount!");
        return;
    }

    fees.push({
        studentId,
        amount,
        status
    });

    saveData();
    renderAll();

    this.reset();

    alert("Fee record saved successfully!");
});

function renderFees() {

    document.getElementById("feesTable").innerHTML =
        fees.map(record => {

            const student = students.find(
                s => s.id === record.studentId
            );

            if (!student) return "";

            return `
                <tr>
                    <td>${escapeHTML(student.name)}</td>
                    <td>₹${record.amount.toLocaleString("en-IN")}</td>
                    <td>${escapeHTML(record.status)}</td>
                </tr>
            `;
        }).join("");
}

// =====================================
// DASHBOARD COUNTS
// =====================================

function updateDashboard() {

    document.getElementById("studentCount").textContent =
        students.length;

    document.getElementById("facultyCount").textContent =
        faculty.length;

    document.getElementById("attendanceCount").textContent =
        attendance.length;

    document.getElementById("marksCount").textContent =
        marks.length;
}

// =====================================
// RENDER ALL DATA
// =====================================

function renderAll() {

    renderStudents();
    renderFaculty();
    renderAttendance();
    renderMarks();
    renderFees();
    updateStudentDropdowns();
    updateDashboard();
}

// Logout demonstration

document.getElementById("logoutBtn").addEventListener(
    "click", function() {
        alert("This is a frontend demo. Authentication is not enabled yet.");
    }
);

// Initial page loading

renderAll();
