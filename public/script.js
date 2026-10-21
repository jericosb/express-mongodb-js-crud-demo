// ============================================================
//  FRONTEND LOGIC
//  New concept: fetch - this is how the web page talks to our
//  backend API. Everything else (getElementById, addEventListener,
//  createElement) is the same DOM we already learned.
//
//  The API base URL - our own server. Since the page is served by
//  the same server, we can use a relative path.
// ============================================================
const API = "/students";

// remember which student we are editing (null means we are adding)
let editingId = null;

// grab the elements once
const nameEl     = document.getElementById("name");
const courseEl   = document.getElementById("course");
const yearEl     = document.getElementById("year");
const enrolledEl = document.getElementById("enrolled");
const tableBody  = document.getElementById("tableBody");
const msg        = document.getElementById("msg");
const formTitle  = document.getElementById("formTitle");
const cancelBtn  = document.getElementById("cancelBtn");

// ------------------------------------------------------------
// READ - get all students and show them in the table
// ------------------------------------------------------------
async function loadStudents() {
  const res = await fetch(API);          // GET request
  const students = await res.json();     // turn the JSON text into data

  tableBody.innerHTML = "";              // clear the table first

  students.forEach(function (s) {
    const tr = document.createElement("tr");

    const status = s.enrolled
      ? '<span class="pill ok">Enrolled</span>'
      : '<span class="pill no">Not enrolled</span>';

    tr.innerHTML =
      "<td>" + s.name + "</td>" +
      "<td>" + (s.course || "") + "</td>" +
      "<td>" + (s.year || "") + "</td>" +
      "<td>" + status + "</td>" +
      '<td>' +
        '<button class="mini e">Edit</button>' +
        '<button class="mini d">Delete</button>' +
      '</td>';

    // Edit button - fill the form with this student's data
    tr.querySelector(".e").addEventListener("click", function () {
      startEdit(s);
    });

    // Delete button - remove this student
    tr.querySelector(".d").addEventListener("click", function () {
      deleteStudent(s._id);
    });

    tableBody.appendChild(tr);
  });
}

// ------------------------------------------------------------
// CREATE or UPDATE - runs when Save is clicked
// ------------------------------------------------------------
async function saveStudent() {
  // build the data object from the form
  const data = {
    name: nameEl.value,
    course: courseEl.value,
    year: yearEl.value,
    enrolled: enrolledEl.checked
  };

  let res;
  if (editingId === null) {
    // ADD - send a POST request
    res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)        // turn our object into JSON text
    });
  } else {
    // UPDATE - send a PUT request to /students/:id
    res = await fetch(API + "/" + editingId, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
  }

  if (res.ok) {
    showMsg(editingId === null ? "Student added." : "Student updated.", true);
    resetForm();
    loadStudents();        // refresh the table
  } else {
    // the backend sends an error when the name is empty (validation)
    showMsg("Name is required.", false);
  }
}

// ------------------------------------------------------------
// DELETE - send a DELETE request to /students/:id
// ------------------------------------------------------------
async function deleteStudent(id) {
  await fetch(API + "/" + id, { method: "DELETE" });
  showMsg("Student deleted.", true);
  loadStudents();
}

// ------------------------------------------------------------
// helpers for the edit mode
// ------------------------------------------------------------
function startEdit(s) {
  editingId = s._id;
  nameEl.value = s.name;
  courseEl.value = s.course || "";
  yearEl.value = s.year || "";
  enrolledEl.checked = s.enrolled;
  formTitle.textContent = "Edit Student";
  cancelBtn.style.display = "block";
}

function resetForm() {
  editingId = null;
  nameEl.value = "";
  courseEl.value = "";
  yearEl.value = "";
  enrolledEl.checked = true;
  formTitle.textContent = "Add New Student";
  cancelBtn.style.display = "none";
}

function showMsg(text, isGood) {
  msg.textContent = text;
  msg.className = isGood ? "good" : "err";
}

// ------------------------------------------------------------
// connect the buttons, then load the data when the page opens
// ------------------------------------------------------------
document.getElementById("saveBtn").addEventListener("click", saveStudent);
cancelBtn.addEventListener("click", resetForm);

loadStudents();
