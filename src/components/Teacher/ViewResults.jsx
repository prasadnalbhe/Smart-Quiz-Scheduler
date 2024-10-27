import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";

const ViewResults = () => {
  const [testResults, setTestResults] = useState([]);

  useEffect(() => {
    const fetchTestResults = async () => {
      try {
        const teacherId = sessionStorage.getItem("userId");
        const response = await axios.get(
          "http://localhost:5000/teacher/viewresults",
          {
            params: { teacherId },
          }
        );
        setTestResults(response.data);
      } catch (error) {
        console.error("Error fetching test results:", error);
      }
    };

    fetchTestResults();
  }, []);

  const downloadExcel = (test) => {
    const worksheetData = test.students.map((student) => ({
      "Student Name": student.studentName,
      "Roll No": student.rollno,
      Division: student.division,
      Score: student.score,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Results");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const fileData = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(fileData, `${test.testName}_Results.xlsx`);
  };

  const downloadPDF = (test) => {
    const doc = new jsPDF();
    doc.text(
      `${test.testName} - ${test.subject} (Marks: ${test.marks})`,
      10,
      10
    );

    const tableColumn = ["Student Name", "Roll No", "Division", "Score"];
    const tableRows = [];

    test.students.forEach((student) => {
      const studentData = [
        student.studentName,
        student.rollno,
        student.division,
        student.score,
      ];
      tableRows.push(studentData);
    });

    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    doc.save(`${test.testName}_Results.pdf`);
  };

  return (
    <div >

{testResults.length > 0 ? (

      testResults.map((test, index) => (
        <div
          key={index}
          className="test-result-container container mb-4"
          style={{ width: "70vw" }}
        >
          <div className="header">
            <h3 className="my-3">
              {test.testName} - {test.subject} (Marks: {test.marks})
            </h3>
            <div className="buttons d-flex">
              <button
                className="btn btn-success mt-3"
                style={{ width: "100px" }}
                onClick={() => downloadExcel(test)}
              >
                XLSX{" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-filetype-xlsx"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M14 4.5V11h-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5zM7.86 14.841a1.13 1.13 0 0 0 .401.823q.195.162.479.252.284.091.665.091.507 0 .858-.158.355-.158.54-.44a1.17 1.17 0 0 0 .187-.656q0-.336-.135-.56a1 1 0 0 0-.375-.357 2 2 0 0 0-.565-.21l-.621-.144a1 1 0 0 1-.405-.176.37.37 0 0 1-.143-.299q0-.234.184-.384.188-.152.513-.152.214 0 .37.068a.6.6 0 0 1 .245.181.56.56 0 0 1 .12.258h.75a1.1 1.1 0 0 0-.199-.566 1.2 1.2 0 0 0-.5-.41 1.8 1.8 0 0 0-.78-.152q-.44 0-.777.15-.336.149-.527.421-.19.273-.19.639 0 .302.123.524t.351.367q.229.143.54.213l.618.144q.31.073.462.193a.39.39 0 0 1 .153.326.5.5 0 0 1-.085.29.56.56 0 0 1-.255.193q-.168.07-.413.07-.176 0-.32-.04a.8.8 0 0 1-.249-.115.58.58 0 0 1-.255-.384zm-3.726-2.909h.893l-1.274 2.007 1.254 1.992h-.908l-.85-1.415h-.035l-.853 1.415H1.5l1.24-2.016-1.228-1.983h.931l.832 1.438h.036zm1.923 3.325h1.697v.674H5.266v-3.999h.791zm7.636-3.325h.893l-1.274 2.007 1.254 1.992h-.908l-.85-1.415h-.035l-.853 1.415h-.861l1.24-2.016-1.228-1.983h.931l.832 1.438h.036z"
                  />
                </svg>
              </button>
              <button
                className="btn btn-danger mt-3"
                style={{ width: "100px" }}
                onClick={() => downloadPDF(test)}
              >
                PDF{" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-filetype-pdf"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M14 4.5V14a2 2 0 0 1-2 2h-1v-1h1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5zM1.6 11.85H0v3.999h.791v-1.342h.803q.43 0 .732-.173.305-.175.463-.474a1.4 1.4 0 0 0 .161-.677q0-.375-.158-.677a1.2 1.2 0 0 0-.46-.477q-.3-.18-.732-.179m.545 1.333a.8.8 0 0 1-.085.38.57.57 0 0 1-.238.241.8.8 0 0 1-.375.082H.788V12.48h.66q.327 0 .512.181.185.183.185.522m1.217-1.333v3.999h1.46q.602 0 .998-.237a1.45 1.45 0 0 0 .595-.689q.196-.45.196-1.084 0-.63-.196-1.075a1.43 1.43 0 0 0-.589-.68q-.396-.234-1.005-.234zm.791.645h.563q.371 0 .609.152a.9.9 0 0 1 .354.454q.118.302.118.753a2.3 2.3 0 0 1-.068.592 1.1 1.1 0 0 1-.196.422.8.8 0 0 1-.334.252 1.3 1.3 0 0 1-.483.082h-.563zm3.743 1.763v1.591h-.79V11.85h2.548v.653H7.896v1.117h1.606v.638z"
                  />
                </svg>
              </button>
            </div>
          </div>
          <table style={{ border: "1px solid black", width: "99%" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid black", padding: "5px 25px" }}>
                  Student Name
                </th>
                <th style={{ border: "1px solid black", padding: "5px 25px" }}>
                  Roll No
                </th>
                <th style={{ border: "1px solid black", padding: "5px 25px" }}>
                  Division
                </th>
                <th style={{ border: "1px solid black", padding: "5px 25px" }}>
                  Score
                </th>
              </tr>
            </thead>
            <tbody>
              {test.students.map((student, idx) => (
                <tr key={idx}>
                  <td
                    style={{ border: "1px solid black", padding: "9px 25px" }}
                  >
                    {student.studentName}
                  </td>
                  <td
                    style={{ border: "1px solid black", padding: "9px 25px" }}
                  >
                    {student.rollno}
                  </td>
                  <td
                    style={{ border: "1px solid black", padding: "9px 25px" }}
                  >
                    {student.division}
                  </td>
                  <td
                    style={{ border: "1px solid black", padding: "9px 25px" }}
                  >
                    {student.score}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      

    ))
  ) : (
    <p className="container " style={{height:'90px'}}>No results available.</p>
  )}
    
    </div>
  );
};

export default ViewResults;
