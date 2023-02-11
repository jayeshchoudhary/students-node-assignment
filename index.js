const express = require("express");
const storage = require("node-persist");
const app = express();

app.use(express.json());

const PORT = 9001;

storage.init({
    dir: "studentsDB",
    stringify: JSON.stringify,
    parse: JSON.parse,
});

app.post("/students", async (req, res) => {
    const { id, name, gpa } = req.body;
    console.log(id, name, gpa);

    const currentStudents = await storage.getItem("students");
    currentStudents.push({ id: id, name: name, gpa: gpa });

    await storage.setItem("students", currentStudents);

    res.send("works");
});

app.get("/allStudents", async (req, res) => {
    const currentStudents = await storage.getItem("students");

    let html = "<h1>All Students Data</h1>";

    currentStudents.forEach((student) => {
        html += `
        <div>
            <h3>Student Id: ${student.id}</h3>
            <h3>Name: ${student.name}</h3>
            <h3>GPA: ${student.gpa}</h3>
            <br>
        </div>
        `;
    });

    res.send(html);
});

app.get("/student/:id", async (req, res) => {
    const id = req.params.id;
    const currentStudents = await storage.getItem("students");

    currentStudents.forEach((student) => {
        if (student.id == id) {
            let html = `
                <h1>Student Details</h1>
                <div>
                    <h3>Student Id: ${student.id}</h3>
                    <h3>Name: ${student.name}</h3>
                    <h3>GPA: ${student.gpa}</h3>
                    <br>
                </div>
            `;

            res.send(html);
        }
    });
});

app.get("/topper", async (req, res) => {
    const currentStudents = await storage.getItem("students");

    let studentWithMaxMarks = currentStudents[0];

    currentStudents.forEach((student) => {
        if (student.gpa > studentWithMaxMarks.gpa) {
            studentWithMaxMarks = student;
        }
    });

    let html = `
                <h1>Student Details</h1>
                <div>
                    <h3>Student Id: ${studentWithMaxMarks.id}</h3>
                    <h3>Name: ${studentWithMaxMarks.name}</h3>
                    <h3>GPA: ${studentWithMaxMarks.gpa}</h3>
                    <br>
                </div>
            `;

    res.send(html);
});

app.listen(PORT, () => console.log("Server is running on port", PORT));
