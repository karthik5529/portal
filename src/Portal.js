import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import "./portal.css";
import { useNavigate } from "react-router-dom";
export default function Portal({setIsLoggedIn}) {
  const [name, setName] = useState("");
  const [salary, setSalary] = useState("");
  const [advanceName, setAdvanceName] = useState("");
  const [advanceAmount, setAdvanceAmount] = useState("");
  const [foodNames, setFoodNames] = useState("");
  const [foodAmount, setFoodAmount] = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" });

  // Toast function
  const showMessage = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 3000);
  };
  const navigate = useNavigate();

const handleLogout = () => {
  setIsLoggedIn(false);
  navigate("/", { replace: true }); 
};

  const fetchRecords = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("employees").select("*");
    if (error) showMessage(error.message, "error");
    else setRecords(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // Add Employee
  const addEmployee = async () => {
    if (!name || !salary) return showMessage("Enter name and salary!", "error");
    const salaryNum = parseFloat(salary);

    const { error } = await supabase.from("employees").insert([
      {
        name,
        salary_per_day: salaryNum,
        present_days: 0,
        absent_days: 0,
        advance: 0,
        food_expense: 0,
        total_salary: 0,
        last_attendance_date: null,
      },
    ]);

    if (error) showMessage(error.message, "error");
    else {
      showMessage("Employee added!", "success");
      fetchRecords();
    }

    setName("");
    setSalary("");
  };

  // Remove Employee
  const removeEmployee = async (id) => {
    const { error } = await supabase.from("employees").delete().eq("id", id);
    if (error) showMessage(error.message, "error");
    else fetchRecords();
  };

  // Mark Present / Absent
  const markAttendance = async (id, type) => {
    const emp = records.find((e) => e.id === id);

    const istDate = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    ).toISOString().split("T")[0];

    if (emp.last_attendance_date === istDate) {
      return showMessage("Attendance already marked today!", "error");
    }

    let newPresent = emp.present_days;
    let newAbsent = emp.absent_days;

    if (type === "present") newPresent += 1;
    else newAbsent += 1;

    const newTotal =
      newPresent * emp.salary_per_day - emp.advance - emp.food_expense;

    const { error } = await supabase
      .from("employees")
      .update({
        present_days: newPresent,
        absent_days: newAbsent,
        total_salary: newTotal,
        last_attendance_date: istDate,
      })
      .eq("id", id);

    if (error) showMessage(error.message, "error");
    else fetchRecords();
  };

  // Deduct Advance
  const deductAdvance = async () => {
    if (!advanceName || !advanceAmount)
      return showMessage("Enter name and amount!", "error");

    const emp = records.find((e) => e.name === advanceName);
    if (!emp) return showMessage("Employee not found!", "error");

    const amount = parseFloat(advanceAmount);
    const newTotal = emp.total_salary - amount;

    const { error } = await supabase
      .from("employees")
      .update({
        advance: emp.advance + amount,
        total_salary: newTotal,
      })
      .eq("name", advanceName);

    if (error) showMessage(error.message, "error");
    else fetchRecords();

    setAdvanceName("");
    setAdvanceAmount("");
  };

  // Split Food Expense
  const splitFoodExpense = async () => {
    if (!foodNames || !foodAmount)
      return showMessage("Enter names and amount!", "error");

    const names = foodNames.split(",").map((n) => n.trim());
    const share = parseFloat(foodAmount) / names.length;

    for (let name of names) {
      const emp = records.find((e) => e.name === name);
      if (!emp) continue;

      const newTotal = emp.total_salary - share;

      await supabase
        .from("employees")
        .update({
          food_expense: emp.food_expense + share,
          total_salary: newTotal,
        })
        .eq("name", name);
    }

    showMessage("Food expense deducted!", "success");
    fetchRecords();
    setFoodNames("");
    setFoodAmount("");
  };

  // Reset All
 const resetAll = async () => {
  if (!window.confirm("Reset all employee stats?")) return;

  const { error } = await supabase.rpc("reset_all_employees");

  if (error) showMessage("Failed to reset data: " + error.message, "error");
  else {
    showMessage("All employees reset successfully!", "success");
    fetchRecords();
  }
};

  return (
    <div className="portal-container">
      <h1>Employee Management Portal</h1>
<div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
  <button 
    onClick={handleLogout} 
    style={{ backgroundColor: "#e74c3c", color: "white", padding: "2px 3px", borderRadius: "6px", border: "none", cursor: "pointer" , width:"20%"}}
  >
    Logout
  </button>
</div>

      {toast.message && <div className={`toast ${toast.type}`}>{toast.message}</div>}

      <div className="form-section">
        <input
          type="text"
          placeholder="Employee Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Salary / Day"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
        />
        <button onClick={addEmployee}>Add Employee</button>
      </div>

      <div className="form-section">
        <input
          type="text"
          placeholder="Employee Name for Advance"
          value={advanceName}
          onChange={(e) => setAdvanceName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Advance Amount"
          value={advanceAmount}
          onChange={(e) => setAdvanceAmount(e.target.value)}
        />
        <button onClick={deductAdvance}>Deduct Advance</button>
      </div>

      <div className="form-section">
        <input
          type="text"
          placeholder="Employee Names (comma separated) for Food Expense"
          value={foodNames}
          onChange={(e) => setFoodNames(e.target.value)}
        />
        <input
          type="number"
          placeholder="Total Food Expense"
          value={foodAmount}
          onChange={(e) => setFoodAmount(e.target.value)}
        />
        <button onClick={splitFoodExpense}>Split Food Expense</button>
      </div>

      <div className="form-section">
        <button onClick={resetAll} style={{ backgroundColor: "#e74c3c" }}>
          Reset All
        </button>
      </div>

      <div className="records-section">
        <h2>Employee Records</h2>
        <center>
        <button onClick={fetchRecords} style={{backgroundColor:"green" , color:"white" , fontWeight:"bolder",padding:"6px 12px"}}>Show Records</button> <br/><br/>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Salary/Day</th>
                <th>Present</th>
                <th>Absent</th>
                <th>Advance</th>
                <th>Food Expense</th>
                <th>Total Salary</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.name}</td>
                  <td>{emp.salary_per_day}</td>
                  <td>{emp.present_days}</td>
                  <td>{emp.absent_days}</td>
                  <td>{emp.advance}</td>
                  <td>{emp.food_expense}</td>
                  <td>{emp.total_salary}</td>
                  <td>
                    <button onClick={() => markAttendance(emp.id, "present")} style={{backgroundColor:"green" , color:"white" , fontWeight:"bolder",padding:"2px 3px",margin:"3%",cursor:"pointer"}}>
                      Present
                    </button>
                    <button onClick={() => markAttendance(emp.id, "absent")} style={{backgroundColor:"green" , color:"white" , fontWeight:"bolder",padding:"2px 3px",margin:"3%",cursor:"pointer"}}>
                      Absent
                    </button>
                    <button onClick={() => removeEmployee(emp.id)} style={{backgroundColor:"green" , color:"white" , fontWeight:"bolder",padding:"2px 3px",margin:"3%",cursor:"pointer"}}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        </center>
      </div>
    </div>
  );
}
