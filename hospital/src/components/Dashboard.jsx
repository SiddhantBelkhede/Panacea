import React, { useState } from "react";
import { registerChild } from "../api.js";

const Dashboard = ({ hospital, onLogout }) => {
  const [activeTab, setActiveTab] = useState("home");
  const [generatedCode, setGeneratedCode] = useState(null);

  // Child Form State
  const [childData, setChildData] = useState({
    name: "",
    parentName: "",
    dob: "",
    gender: "Male",
  });
  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    setChildData({ ...childData, [e.target.name]: e.target.value });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setMessage("Processing...");

    // Combine form data with the logged-in hospital's ID
    const payload = {
      ...childData,
      hospitalId: hospital.hospitalId,
    };

    const result = await registerChild(payload);

    if (result && result.uniqueCode) {
      setGeneratedCode(result.uniqueCode);
      setMessage(`Success! Child Registered.`);
      // Clear form
      setChildData({ name: "", parentName: "", dob: "", gender: "Male" });
    } else {
      setMessage(result.message || "Error registering child");
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
    borderRadius: "50px", // Pill shape
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

  const labelStyle = {
    display: "block",
    marginBottom: "5px",
    fontWeight: "600",
    color: "#444",
    fontSize: "14px",
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
            fontSize: "14px",
          }}
        >
          Logout
        </button>
      </div>

      {/* Navigation Tabs */}
      <div style={{ padding: "25px 0", display: "flex" }}>
        <button
          onClick={() => {
            setActiveTab("home");
            setGeneratedCode(null);
            setMessage("");
          }}
          style={tabStyle(activeTab === "home")}
        >
          Dashboard Home
        </button>
        <button
          onClick={() => {
            setActiveTab("register_child");
            setGeneratedCode(null);
            setMessage("");
          }}
          style={tabStyle(activeTab === "register_child")}
        >
          Register New Child
        </button>
      </div>

      {/* --- CONTENT AREA --- */}

      {activeTab === "home" && (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            background: "#f8f9fa",
            borderRadius: "12px",
            border: "1px dashed #dee2e6",
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "15px" }}>🏥</div>
          <h3 style={{ marginTop: 0, color: "#2c3e50" }}>
            Welcome to the Hospital Portal
          </h3>
          <p style={{ color: "#6c757d", maxWidth: "400px", margin: "0 auto" }}>
            Use the navigation tabs above to register new births or manage
            existing patient records.
          </p>
        </div>
      )}

      {activeTab === "register_child" && (
        <div style={{ animation: "fadeIn 0.3s ease-in-out" }}>
          {generatedCode ? (
            <div
              style={{
                backgroundColor: "#ecfdf5",
                border: "1px solid #a7f3d0",
                borderRadius: "12px",
                padding: "40px",
                textAlign: "center",
                marginTop: "10px",
              }}
            >
              <div style={{ fontSize: "40px", marginBottom: "10px" }}>✅</div>
              <h4
                style={{
                  margin: "0 0 10px 0",
                  fontSize: "24px",
                  color: "#065f46",
                }}
              >
                Registration Successful!
              </h4>
              <p style={{ color: "#047857", marginBottom: "20px" }}>
                Please write down this code or share it with the parent
                immediately.
              </p>

              <div
                style={{
                  background: "white",
                  padding: "20px 40px",
                  borderRadius: "8px",
                  display: "inline-block",
                  marginBottom: "25px",
                  border: "2px dashed #059669",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                }}
              >
                <h1
                  style={{
                    fontSize: "32px",
                    letterSpacing: "4px",
                    margin: 0,
                    fontFamily: "monospace",
                    color: "#059669",
                  }}
                >
                  {generatedCode}
                </h1>
              </div>

              <br />
              <button
                onClick={() => {
                  setGeneratedCode(null);
                  setMessage("");
                }}
                className="btn-primary"
                style={{
                  padding: "12px 24px",
                  borderRadius: "6px",
                  fontSize: "15px",
                }}
              >
                + Register Another Child
              </button>
            </div>
          ) : (
            <div style={{ maxWidth: "600px", margin: "0 auto" }}>
              <div
                style={{
                  marginBottom: "25px",
                  borderLeft: "4px solid #007bff",
                  paddingLeft: "15px",
                }}
              >
                <h3 style={{ margin: 0, color: "#2c3e50" }}>
                  Register Newborn
                </h3>
                <p
                  style={{ margin: "5px 0 0", color: "#666", fontSize: "14px" }}
                >
                  Enter the child's details to generate a unique tracking ID.
                </p>
              </div>

              <form
                onSubmit={handleRegisterSubmit}
                style={{ backgroundColor: "white", padding: "5px" }}
              >
                {message && (
                  <div className="alert" style={{ marginBottom: "20px" }}>
                    {message}
                  </div>
                )}

                <div className="form-group" style={{ marginBottom: "20px" }}>
                  <label style={labelStyle}>Child's Full Name</label>
                  <input
                    name="name"
                    value={childData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. Baby Doe"
                    style={inputStyle}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: "20px" }}>
                  <label style={labelStyle}>Parent/Guardian Name</label>
                  <input
                    name="parentName"
                    value={childData.parentName}
                    onChange={handleInputChange}
                    required
                    placeholder="Mother or Father's Name"
                    style={inputStyle}
                  />
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "20px",
                    marginBottom: "30px",
                  }}
                >
                  <div className="form-group">
                    <label style={labelStyle}>Date of Birth</label>
                    <input
                      type="date"
                      name="dob"
                      value={childData.dob}
                      onChange={handleInputChange}
                      required
                      style={inputStyle}
                    />
                  </div>

                  <div className="form-group">
                    <label style={labelStyle}>Gender</label>
                    <select
                      name="gender"
                      value={childData.gender}
                      onChange={handleInputChange}
                      style={{ ...inputStyle, padding: "12px", height: "45px" }}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  style={{
                    width: "100%",
                    padding: "14px",
                    fontSize: "16px",
                    fontWeight: "bold",
                    borderRadius: "6px",
                    boxShadow: "0 4px 6px rgba(0, 123, 255, 0.2)",
                  }}
                >
                  Generate Unique ID
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
