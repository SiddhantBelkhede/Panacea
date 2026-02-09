import React, { useState } from "react";
import {
  registerChild,
  getChildByCode,
  addVaccination,
  scheduleVaccination,
} from "../api.js";

const Dashboard = ({ hospital, onLogout }) => {
  const [activeTab, setActiveTab] = useState("home"); // 'home', 'register_child', 'update_history'

  // -- Registration State --
  const [generatedCode, setGeneratedCode] = useState(null);
  const [childData, setChildData] = useState({
    name: "",
    parentName: "",
    dob: "",
    gender: "Male",
  });
  const [regMessage, setRegMessage] = useState("");

  // -- Update History State --
  const [searchCode, setSearchCode] = useState("");
  const [searchedChild, setSearchedChild] = useState(null);
  const [historyMessage, setHistoryMessage] = useState("");
  const [actionType, setActionType] = useState("record"); // 'record' (past) or 'schedule' (future)

  // Forms
  const [vaccineForm, setVaccineForm] = useState({
    vaccineName: "",
    notes: "",
  });
  const [scheduleForm, setScheduleForm] = useState({
    vaccineName: "",
    dueDate: "",
    notes: "",
  });

  // --- Handlers: Registration ---
  const handleRegChange = (e) =>
    setChildData({ ...childData, [e.target.name]: e.target.value });

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegMessage("Processing...");
    const result = await registerChild({
      ...childData,
      hospitalId: hospital.hospitalId,
    });

    if (result && result.uniqueCode) {
      setGeneratedCode(result.uniqueCode);
      setRegMessage("Success!");
      setChildData({ name: "", parentName: "", dob: "", gender: "Male" });
    } else {
      setRegMessage(result.message || "Error registering child");
    }
  };

  // --- Handlers: Update History ---
  const handleSearch = async (e) => {
    e.preventDefault();
    setHistoryMessage("Searching...");
    setSearchedChild(null);

    const result = await getChildByCode(searchCode.trim());
    if (result && result._id) {
      setSearchedChild(result);
      setHistoryMessage("");
    } else {
      setHistoryMessage(result.message || "Child not found");
    }
  };

  const handleVaccineSubmit = async (e) => {
    e.preventDefault();
    if (!searchedChild) return;

    const payload = {
      uniqueCode: searchedChild.uniqueCode,
      hospitalId: hospital.hospitalId,
      vaccineName: vaccineForm.vaccineName,
      notes: vaccineForm.notes,
    };

    const result = await addVaccination(payload);
    if (result && result.child) {
      alert("Record Added Successfully!");
      setSearchedChild(result.child);
      setVaccineForm({ vaccineName: "", notes: "" });
    } else {
      alert("Error updating record");
    }
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!searchedChild) return;

    const payload = {
      uniqueCode: searchedChild.uniqueCode,
      vaccineName: scheduleForm.vaccineName,
      dueDate: scheduleForm.dueDate,
      notes: scheduleForm.notes,
    };

    const result = await scheduleVaccination(payload);
    if (result && result.child) {
      setSearchedChild(result.child);
      alert("Scheduled Successfully!");
      setScheduleForm({ vaccineName: "", dueDate: "", notes: "" });
    } else {
      alert("Error scheduling: " + (result.message || "Unknown error"));
    }
  };

  // --- Styles ---
  const tabStyle = (isActive) => ({
    padding: "10px 25px",
    marginRight: "15px",
    cursor: "pointer",
    backgroundColor: isActive ? "#007bff" : "transparent",
    color: isActive ? "white" : "#555",
    border: isActive ? "none" : "1px solid #ddd",
    borderRadius: "50px",
    fontWeight: isActive ? "600" : "500",
    fontSize: "14px",
    transition: "all 0.2s ease",
    outline: "none",
  });

  const inputStyle = {
    width: "100%",
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "15px",
    backgroundColor: "#fafafa",
    marginTop: "5px",
  };

  return (
    <div
      className="card"
      style={{
        border: "none",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: "20px",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <div>
          <h2 style={{ margin: 0, color: "#2c3e50", fontSize: "24px" }}>
            {hospital.name}
          </h2>
          <div
            style={{ display: "flex", alignItems: "center", marginTop: "5px" }}
          >
            <span
              style={{
                fontSize: "12px",
                backgroundColor: "#eef2f7",
                color: "#555",
                padding: "4px 8px",
                borderRadius: "4px",
                fontWeight: "500",
              }}
            >
              ID: {hospital.hospitalId}
            </span>
          </div>
        </div>
        <button
          onClick={onLogout}
          style={{
            backgroundColor: "#fff",
            color: "#e74c3c",
            border: "1px solid #e74c3c",
            padding: "8px 20px",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Logout
        </button>
      </div>

      {/* Navigation Tabs */}
      <div
        style={{
          padding: "25px 0",
          display: "flex",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <button
          onClick={() => setActiveTab("home")}
          style={tabStyle(activeTab === "home")}
        >
          Home
        </button>
        <button
          onClick={() => setActiveTab("register_child")}
          style={tabStyle(activeTab === "register_child")}
        >
          Register Child
        </button>
        <button
          onClick={() => setActiveTab("update_history")}
          style={tabStyle(activeTab === "update_history")}
        >
          Update Records
        </button>
      </div>

      {/* --- CONTENT AREA --- */}

      {/* 1. HOME TAB */}
      {activeTab === "home" && (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <div style={{ fontSize: "48px", marginBottom: "15px" }}>🏥</div>
          <h3 style={{ marginTop: 0, color: "#2c3e50" }}>
            Welcome to the Hospital Portal
          </h3>
          <p style={{ color: "#6c757d" }}>
            Manage births, vaccinations, and patient history.
          </p>
        </div>
      )}

      {/* 2. REGISTER CHILD TAB */}
      {activeTab === "register_child" && (
        <div style={{ padding: "20px" }}>
          {generatedCode ? (
            <div
              style={{
                backgroundColor: "#ecfdf5",
                border: "1px solid #a7f3d0",
                borderRadius: "12px",
                padding: "40px",
                textAlign: "center",
              }}
            >
              <h4
                style={{
                  margin: "0 0 10px 0",
                  fontSize: "24px",
                  color: "#065f46",
                }}
              >
                Registration Successful!
              </h4>
              <p style={{ color: "#047857" }}>
                Share this code with the parent:
              </p>
              <h1
                style={{
                  fontSize: "32px",
                  fontFamily: "monospace",
                  color: "#059669",
                  border: "2px dashed #059669",
                  display: "inline-block",
                  padding: "10px 20px",
                  borderRadius: "8px",
                }}
              >
                {generatedCode}
              </h1>
              <br />
              <button
                onClick={() => {
                  setGeneratedCode(null);
                  setRegMessage("");
                }}
                className="btn-primary"
                style={{ marginTop: "20px" }}
              >
                + Register Another
              </button>
            </div>
          ) : (
            <div style={{ maxWidth: "600px", margin: "0 auto" }}>
              <h3>Register Newborn</h3>
              <form onSubmit={handleRegisterSubmit}>
                {regMessage && <div className="alert">{regMessage}</div>}
                <div style={{ marginBottom: "15px" }}>
                  <label>Child Name</label>
                  <input
                    name="name"
                    value={childData.name}
                    onChange={handleRegChange}
                    required
                    style={inputStyle}
                  />
                </div>
                <div style={{ marginBottom: "15px" }}>
                  <label>Parent Name</label>
                  <input
                    name="parentName"
                    value={childData.parentName}
                    onChange={handleRegChange}
                    required
                    style={inputStyle}
                  />
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "15px",
                  }}
                >
                  <div style={{ marginBottom: "15px" }}>
                    <label>DOB</label>
                    <input
                      type="date"
                      name="dob"
                      value={childData.dob}
                      onChange={handleRegChange}
                      required
                      style={inputStyle}
                    />
                  </div>
                  <div style={{ marginBottom: "15px" }}>
                    <label>Gender</label>
                    <select
                      name="gender"
                      value={childData.gender}
                      onChange={handleRegChange}
                      style={{ ...inputStyle, height: "45px" }}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ width: "100%", padding: "12px" }}
                >
                  Generate ID
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* 3. UPDATE HISTORY TAB */}
      {activeTab === "update_history" && (
        <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
          {/* Search Section */}
          <div
            style={{
              marginBottom: "30px",
              backgroundColor: "#f8f9fa",
              padding: "20px",
              borderRadius: "8px",
            }}
          >
            <h4 style={{ marginTop: 0 }}>Find Child Record</h4>
            <form
              onSubmit={handleSearch}
              style={{ display: "flex", gap: "10px" }}
            >
              <input
                placeholder="Enter Unique ID (e.g. PANA-7A3B9C)"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                style={{ ...inputStyle, marginTop: 0 }}
                required
              />
              <button
                type="submit"
                className="btn-primary"
                style={{ padding: "0 25px" }}
              >
                Search
              </button>
            </form>
            {historyMessage && (
              <p style={{ color: "red", marginTop: "10px" }}>
                {historyMessage}
              </p>
            )}
          </div>

          {/* Result Section */}
          {searchedChild && (
            <div style={{ animation: "fadeIn 0.3s" }}>
              {/* Child Details Card */}
              <div
                style={{
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  padding: "20px",
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "20px",
                  }}
                >
                  <div>
                    <h3 style={{ margin: "0 0 5px 0" }}>
                      {searchedChild.name}
                    </h3>
                    <p style={{ margin: 0, color: "#666" }}>
                      Parent: {searchedChild.parentName}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span
                      style={{
                        backgroundColor: "#e3f2fd",
                        color: "#0d47a1",
                        padding: "5px 10px",
                        borderRadius: "4px",
                        fontWeight: "bold",
                      }}
                    >
                      {searchedChild.uniqueCode}
                    </span>
                    <p style={{ margin: "5px 0 0 0", fontSize: "14px" }}>
                      DOB: {new Date(searchedChild.dob).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* ACTION TOGGLE */}
              <div
                style={{ display: "flex", gap: "10px", marginBottom: "20px" }}
              >
                <button
                  onClick={() => setActionType("record")}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    backgroundColor:
                      actionType === "record" ? "#4caf50" : "#f9f9f9",
                    color: actionType === "record" ? "white" : "#333",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Record Past Vaccine
                </button>
                <button
                  onClick={() => setActionType("schedule")}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    backgroundColor:
                      actionType === "schedule" ? "#ff9800" : "#f9f9f9",
                    color: actionType === "schedule" ? "white" : "#333",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Schedule Next Dose
                </button>
              </div>

              {/* FORMS */}
              <div
                style={{
                  backgroundColor: "#fff",
                  border: `1px solid ${actionType === "record" ? "#4caf50" : "#ff9800"}`,
                  borderRadius: "8px",
                  padding: "20px",
                  marginBottom: "30px",
                }}
              >
                {actionType === "record" ? (
                  <form onSubmit={handleVaccineSubmit}>
                    <h4 style={{ marginTop: 0, color: "#2e7d32" }}>
                      + Add Completed Record
                    </h4>
                    <div style={{ marginBottom: "15px" }}>
                      <label>Vaccine Name</label>
                      <input
                        value={vaccineForm.vaccineName}
                        onChange={(e) =>
                          setVaccineForm({
                            ...vaccineForm,
                            vaccineName: e.target.value,
                          })
                        }
                        placeholder="e.g. Polio Dose 1"
                        required
                        style={inputStyle}
                      />
                    </div>
                    <div style={{ marginBottom: "15px" }}>
                      <label>Notes</label>
                      <textarea
                        value={vaccineForm.notes}
                        onChange={(e) =>
                          setVaccineForm({
                            ...vaccineForm,
                            notes: e.target.value,
                          })
                        }
                        placeholder="Details..."
                        rows="2"
                        style={{ ...inputStyle, fontFamily: "sans-serif" }}
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn-primary"
                      style={{
                        backgroundColor: "#4caf50",
                        borderColor: "#4caf50",
                      }}
                    >
                      Save Record
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleScheduleSubmit}>
                    <h4 style={{ marginTop: 0, color: "#ef6c00" }}>
                      🕒 Schedule Future Vaccination
                    </h4>
                    <div style={{ marginBottom: "15px" }}>
                      <label>Next Vaccine Name</label>
                      <input
                        value={scheduleForm.vaccineName}
                        onChange={(e) =>
                          setScheduleForm({
                            ...scheduleForm,
                            vaccineName: e.target.value,
                          })
                        }
                        placeholder="e.g. Polio Dose 2"
                        required
                        style={inputStyle}
                      />
                    </div>
                    <div style={{ marginBottom: "15px" }}>
                      <label>Due Date</label>
                      <input
                        type="date"
                        value={scheduleForm.dueDate}
                        onChange={(e) =>
                          setScheduleForm({
                            ...scheduleForm,
                            dueDate: e.target.value,
                          })
                        }
                        required
                        style={inputStyle}
                      />
                    </div>
                    <div style={{ marginBottom: "15px" }}>
                      <label>Instructions for Parent</label>
                      <textarea
                        value={scheduleForm.notes}
                        onChange={(e) =>
                          setScheduleForm({
                            ...scheduleForm,
                            notes: e.target.value,
                          })
                        }
                        placeholder="Bring vaccination card..."
                        rows="2"
                        style={{ ...inputStyle, fontFamily: "sans-serif" }}
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn-primary"
                      style={{
                        backgroundColor: "#ff9800",
                        borderColor: "#ff9800",
                      }}
                    >
                      Set Schedule
                    </button>
                  </form>
                )}
              </div>

              {/* UPCOMING SCHEDULE DISPLAY */}
              {searchedChild.upcomingSchedule &&
                searchedChild.upcomingSchedule.length > 0 && (
                  <div style={{ marginBottom: "30px" }}>
                    <h4
                      style={{
                        borderBottom: "2px solid #ff9800",
                        paddingBottom: "5px",
                        display: "inline-block",
                      }}
                    >
                      Upcoming Schedule
                    </h4>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                      }}
                    >
                      {searchedChild.upcomingSchedule.map((item, index) => (
                        <div
                          key={index}
                          style={{
                            border: "1px solid #ffcc80",
                            backgroundColor: "#fff3e0",
                            padding: "10px",
                            borderRadius: "6px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <div>
                            <strong>{item.vaccineName}</strong>
                            <br />
                            <small style={{ color: "#666" }}>
                              {item.notes}
                            </small>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <span
                              style={{ fontWeight: "bold", color: "#e65100" }}
                            >
                              Due: {new Date(item.dueDate).toLocaleDateString()}
                            </span>
                            <br />
                            <span
                              style={{
                                fontSize: "12px",
                                padding: "2px 6px",
                                borderRadius: "4px",
                                backgroundColor: "#ffe0b2",
                              }}
                            >
                              {item.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* PAST HISTORY DISPLAY */}
              <div>
                <h4
                  style={{
                    borderBottom: "2px solid #4caf50",
                    paddingBottom: "5px",
                    display: "inline-block",
                  }}
                >
                  Past History
                </h4>
                {!searchedChild.vaccinationHistory ||
                searchedChild.vaccinationHistory.length === 0 ? (
                  <p style={{ color: "#888", fontStyle: "italic" }}>
                    No records found.
                  </p>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    {searchedChild.vaccinationHistory
                      .slice()
                      .reverse()
                      .map((rec, index) => (
                        <div
                          key={index}
                          style={{
                            borderLeft: "4px solid #aaa",
                            paddingLeft: "15px",
                            backgroundColor: "#f9f9f9",
                            padding: "10px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <strong>{rec.vaccineName}</strong>
                            <small>
                              {new Date(rec.date).toLocaleDateString()}
                            </small>
                          </div>
                          <p style={{ margin: "5px 0 0 0", color: "#555" }}>
                            {rec.notes}
                          </p>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
