import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import * as XLSX from "xlsx";
import { db } from "../firebase";

const Dashboard = () => {
  const [registrations, setRegistrations] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================= FETCH DATA =================
  const fetchData = async () => {
    try {
      setLoading(true);

      const querySnapshot = await getDocs(
        collection(db, "registrations")
      );

      const data = querySnapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
        status: document.data().status || "Pending",
      }));

      setRegistrations(data);
    } catch (error) {
      console.error("Error fetching registrations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ================= VERIFY =================
  const handleVerify = async (user) => {
    try {
      await updateDoc(
        doc(db, "registrations", user.id),
        {
          status: "Verified",
        }
      );

      setRegistrations((prev) =>
        prev.map((reg) =>
          reg.id === user.id
            ? { ...reg, status: "Verified" }
            : reg
        )
      );

      setSelectedUser(null);
    } catch (error) {
      console.error("Verify error:", error);
    }
  };

  // ================= REJECT =================
  const handleReject = async (user) => {
    try {
      await updateDoc(
        doc(db, "registrations", user.id),
        {
          status: "Rejected",
        }
      );

      setRegistrations((prev) =>
        prev.map((reg) =>
          reg.id === user.id
            ? { ...reg, status: "Rejected" }
            : reg
        )
      );

      setSelectedUser(null);
    } catch (error) {
      console.error("Reject error:", error);
    }
  };

  // ================= SEARCH =================
  const filteredRegistrations = registrations.filter((reg) => {
    const searchValue = search.toLowerCase();

    return (
      reg.fullName?.toLowerCase().includes(searchValue) ||
      reg.email?.toLowerCase().includes(searchValue) ||
      reg.regId?.toLowerCase().includes(searchValue) ||
      reg.phone?.toLowerCase().includes(searchValue)
    );
  });

  // ================= EXCEL DOWNLOAD =================
  const downloadExcel = () => {
    const excelData = [];

    registrations.forEach((reg) => {
      const events = reg.selectedEvents || [];

      events.forEach((event) => {
        const members = (
          reg.teamMembers?.[event] || []
        ).filter(
          (member) =>
            member &&
            member.trim() !== ""
        );

        excelData.push({
          "Registration ID": reg.regId || "",
          Status: reg.status || "Pending",
          "Full Name": reg.fullName || "",
          Email: reg.email || "",
          Phone: reg.phone || "",
          College: reg.college || "",
          Department: reg.department || "",
          Year: reg.year || "",
          Food: reg.food || "",
          Event: event,
          "Team Members":
            members.length > 0
              ? members.join(", ")
              : "Individual Event",
          "Package Count":
            reg.package?.count || "",
          "Package Price":
            reg.package?.price || "",
          "Transaction ID":
            reg.transactionId || "",
          "Created At":
            reg.createdAt
              ? reg.createdAt.toDate
                ? reg.createdAt.toDate().toLocaleString()
                : reg.createdAt
              : "",
        });
      });
    });

    const worksheet =
      XLSX.utils.json_to_sheet(excelData);

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Registrations"
    );

    XLSX.writeFile(
      workbook,
      "symposium-registrations.xlsx"
    );
  };

  // ================= STATS =================
  const totalRegistrations = registrations.length;

  const verifiedCount = registrations.filter(
    (reg) => reg.status === "Verified"
  ).length;

  const rejectedCount = registrations.filter(
    (reg) => reg.status === "Rejected"
  ).length;

  const pendingCount = registrations.filter(
    (reg) => reg.status === "Pending"
  ).length;

  return (
    <div className="min-h-screen bg-black text-white font-sans p-4 md:p-8 relative overflow-hidden">
      
      {/* Background Cyber Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(240,240,12,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(240,240,12,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10">

        {/* ================= HEADER ================= */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 border-b border-[#f0f00c]/30 pb-6">

          <div>
            <h1 className="text-3xl font-bold text-[#f0f00c] tracking-wider uppercase font-orbitron">
              Registration <span className="text-white">Dashboard</span>
            </h1>

            <p className="text-white/70 mt-1 text-sm tracking-wide">
              Manage symposium registrations & verify payments
            </p>
          </div>

          <button
            onClick={downloadExcel}
            className="bg-[#f0f00c] hover:bg-[#d4d40b] text-black font-bold px-6 py-3 border border-[#f0f00c] transition shadow-[0_0_15px_rgba(240,240,12,0.3)] uppercase tracking-wider text-sm"
          >
            Download Excel
          </button>
        </div>

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">

          <div className="bg-black/80 border border-[#f0f00c]/30 p-5 backdrop-blur-md">
            <p className="text-white/60 text-xs uppercase tracking-wider">
              Total Registrations
            </p>

            <h2 className="text-2xl font-bold mt-2 text-white">
              {totalRegistrations}
            </h2>
          </div>

          <div className="bg-black/80 border border-[#f0f00c]/30 p-5 backdrop-blur-md">
            <p className="text-white/60 text-xs uppercase tracking-wider">
              Showing
            </p>

            <h2 className="text-2xl font-bold mt-2 text-white">
              {filteredRegistrations.length}
            </h2>
          </div>

          <div className="bg-black/80 border border-[#f0f00c]/30 p-5 backdrop-blur-md">
            <p className="text-white/60 text-xs uppercase tracking-wider">
              Pending
            </p>

            <h2 className="text-2xl font-bold mt-2 text-[#f0f00c]">
              {pendingCount}
            </h2>
          </div>

          <div className="bg-black/80 border border-[#f0f00c]/30 p-5 backdrop-blur-md">
            <p className="text-white/60 text-xs uppercase tracking-wider">
              Verified
            </p>

            <h2 className="text-2xl font-bold mt-2 text-green-400">
              {verifiedCount}
            </h2>
          </div>

          <div className="bg-black/80 border border-[#f0f00c]/30 p-5 backdrop-blur-md">
            <p className="text-white/60 text-xs uppercase tracking-wider">
              Rejected
            </p>

            <h2 className="text-2xl font-bold mt-2 text-red-500">
              {rejectedCount}
            </h2>
          </div>

        </div>

        {/* ================= SEARCH ================= */}
        <div className="mb-6">

          <input
            type="text"
            placeholder="Search by name, email, Reg ID or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-[450px] bg-black/80 border border-[#f0f00c]/40 text-white placeholder:text-white/40 px-4 py-3 outline-none focus:border-[#f0f00c] focus:shadow-[0_0_12px_rgba(240,240,12,0.25)] transition"
          />

        </div>

        {/* ================= TABLE ================= */}
        <div className="bg-black/90 border border-[#f0f00c]/30 overflow-hidden shadow-[0_0_30px_rgba(240,240,12,0.05)]">

          {loading ? (
            <div className="p-10 text-center text-white/60">
              Loading registrations...
            </div>
          ) : filteredRegistrations.length === 0 ? (
            <div className="p-10 text-center text-white/60">
              No registrations found
            </div>
          ) : (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1000px]">

                <thead>
                  <tr className="border-b border-[#f0f00c]/30 text-left bg-[#f0f00c]/10">

                    <th className="px-5 py-4 text-[#f0f00c] uppercase text-xs tracking-wider font-bold">
                      Reg ID
                    </th>

                    <th className="px-5 py-4 text-[#f0f00c] uppercase text-xs tracking-wider font-bold">
                      Participant
                    </th>

                    <th className="px-5 py-4 text-[#f0f00c] uppercase text-xs tracking-wider font-bold">
                      Department
                    </th>

                    <th className="px-5 py-4 text-[#f0f00c] uppercase text-xs tracking-wider font-bold">
                      Phone
                    </th>

                    <th className="px-5 py-4 text-[#f0f00c] uppercase text-xs tracking-wider font-bold">
                      Events
                    </th>

                    <th className="px-5 py-4 text-[#f0f00c] uppercase text-xs tracking-wider font-bold">
                      Amount
                    </th>

                    <th className="px-5 py-4 text-[#f0f00c] uppercase text-xs tracking-wider font-bold">
                      Payment
                    </th>

                    <th className="px-5 py-4 text-[#f0f00c] uppercase text-xs tracking-wider font-bold">
                      Action
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {filteredRegistrations.map((reg) => {
                    const isRejected = reg.status === "Rejected";
                    const isVerified = reg.status === "Verified";

                    return (
                      <tr
                        key={reg.id}
                        className="border-b border-white/10 hover:bg-[#f0f00c]/5 transition"
                      >

                        {/* REG ID */}
                        <td className="px-5 py-4">
                          <span
                            className={`font-bold ${
                              isRejected
                                ? "text-red-500"
                                : isVerified
                                ? "text-green-400"
                                : "text-[#f0f00c]"
                            }`}
                          >
                            {reg.regId}
                          </span>
                        </td>

                        {/* PARTICIPANT */}
                        <td className="px-5 py-4">
                          <div>
                            <p className="font-semibold text-white">
                              {reg.fullName}
                            </p>
                            <p className="text-sm text-white/60">
                              {reg.email}
                            </p>
                          </div>
                        </td>

                        {/* DEPARTMENT */}
                        <td className="px-5 py-4 uppercase text-white/80">
                          {reg.department}
                        </td>

                        {/* PHONE */}
                        <td className="px-5 py-4 text-white/80">
                          {reg.phone}
                        </td>

                        {/* EVENTS */}
                        <td className="px-5 py-4">
                          <div className="flex flex-wrap gap-2">
                            {reg.selectedEvents?.map((event, index) => (
                              <span
                                key={index}
                                className="bg-white/5 border border-[#f0f00c]/30 text-[#f0f00c] px-2.5 py-1 text-xs"
                              >
                                {event}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* AMOUNT */}
                        <td className="px-5 py-4 font-bold text-white">
                          ₹{reg.package?.price || 0}
                        </td>

                        {/* PAYMENT */}
                        <td className="px-5 py-4">
                          {reg.screenshot ? (
                            <img
                              src={reg.screenshot}
                              alt="Payment"
                              onClick={() => setSelectedImage(reg.screenshot)}
                              className="w-16 h-16 object-cover border border-[#f0f00c]/40 cursor-pointer hover:scale-105 transition"
                            />
                          ) : (
                            <span className="text-white/40 text-xs">
                              No Image
                            </span>
                          )}
                        </td>

                        {/* ACTION */}
                        <td className="px-5 py-4">
                          <button
                            onClick={() => setSelectedUser(reg)}
                            className="bg-[#f0f00c] hover:bg-[#d4d40b] text-black font-bold px-4 py-2 transition text-xs uppercase"
                          >
                            View
                          </button>
                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

      {/* ================= DETAILS MODAL ================= */}
      {selectedUser && (

        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedUser(null)}
        >

          <div
            className="bg-black border border-[#f0f00c]/40 text-white w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 shadow-[0_0_50px_rgba(240,240,12,0.15)]"
            onClick={(e) => e.stopPropagation()}
          >

            {/* MODAL HEADER */}
            <div className="flex justify-between items-center mb-6 border-b border-[#f0f00c]/30 pb-4">

              <div>
                <h2 className="text-2xl font-bold text-[#f0f00c] uppercase tracking-wide">
                  Registration Details
                </h2>

                <p
                  className={`font-semibold mt-1 text-sm ${
                    selectedUser.status === "Rejected"
                      ? "text-red-500"
                      : selectedUser.status === "Verified"
                      ? "text-green-400"
                      : "text-[#f0f00c]"
                  }`}
                >
                  STATUS: {selectedUser.status}
                </p>
              </div>

              <button
                onClick={() => setSelectedUser(null)}
                className="text-white/60 hover:text-white text-3xl"
              >
                ×
              </button>

            </div>

            {/* BASIC DETAILS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="bg-white/5 border border-[#f0f00c]/20 p-4">
                <p className="text-[#f0f00c] text-xs uppercase font-bold">
                  Registration ID
                </p>

                <p
                  className={`font-bold text-lg ${
                    selectedUser.status === "Rejected"
                      ? "text-red-500"
                      : selectedUser.status === "Verified"
                      ? "text-green-400"
                      : "text-white"
                  }`}
                >
                  {selectedUser.regId}
                </p>
              </div>

              <div className="bg-white/5 border border-[#f0f00c]/20 p-4">
                <p className="text-[#f0f00c] text-xs uppercase font-bold">
                  Full Name
                </p>

                <p className="font-semibold text-white">
                  {selectedUser.fullName}
                </p>
              </div>

              <div className="bg-white/5 border border-[#f0f00c]/20 p-4">
                <p className="text-[#f0f00c] text-xs uppercase font-bold">
                  Email
                </p>

                <p className="font-semibold text-white break-all">
                  {selectedUser.email}
                </p>
              </div>

              <div className="bg-white/5 border border-[#f0f00c]/20 p-4">
                <p className="text-[#f0f00c] text-xs uppercase font-bold">
                  Phone
                </p>

                <p className="font-semibold text-white">
                  {selectedUser.phone}
                </p>
              </div>

              <div className="bg-white/5 border border-[#f0f00c]/20 p-4">
                <p className="text-[#f0f00c] text-xs uppercase font-bold">
                  College
                </p>

                <p className="font-semibold text-white uppercase">
                  {selectedUser.college}
                </p>
              </div>

              <div className="bg-white/5 border border-[#f0f00c]/20 p-4">
                <p className="text-[#f0f00c] text-xs uppercase font-bold">
                  Department
                </p>

                <p className="font-semibold text-white uppercase">
                  {selectedUser.department}
                </p>
              </div>

              <div className="bg-white/5 border border-[#f0f00c]/20 p-4">
                <p className="text-[#f0f00c] text-xs uppercase font-bold">
                  Year
                </p>

                <p className="font-semibold text-white">
                  {selectedUser.year}
                </p>
              </div>

              <div className="bg-white/5 border border-[#f0f00c]/20 p-4">
                <p className="text-[#f0f00c] text-xs uppercase font-bold">
                  Food
                </p>

                <p className="font-semibold text-white uppercase">
                  {selectedUser.food}
                </p>
              </div>

            </div>

            {/* ================= EVENTS ================= */}
            <div className="mt-6">

              <h3 className="text-lg font-bold text-[#f0f00c] uppercase mb-4">
                Selected Events
              </h3>

              <div className="space-y-4">

                {selectedUser.selectedEvents?.map((event, index) => {
                  const members = (
                    selectedUser.teamMembers?.[event] || []
                  ).filter(
                    (member) => member && member.trim() !== ""
                  );

                  return (
                    <div
                      key={index}
                      className="bg-white/5 border border-[#f0f00c]/20 p-4"
                    >

                      <h4 className="font-bold text-md text-white">
                        {event}
                      </h4>

                      {members.length > 0 ? (

                        <div className="mt-3">

                          <p className="text-white/60 text-xs mb-2 uppercase">
                            Team Members
                          </p>

                          <div className="flex flex-wrap gap-2">

                            {members.map((member, memberIndex) => (
                              <span
                                key={memberIndex}
                                className="bg-black border border-[#f0f00c]/40 text-[#f0f00c] px-3 py-1 text-sm font-semibold"
                              >
                                {member}
                              </span>
                            ))}

                          </div>

                        </div>

                      ) : (

                        <p className="text-white/50 text-sm mt-2">
                          Individual Event
                        </p>

                      )}

                    </div>
                  );
                })}

              </div>

            </div>

            {/* ================= PAYMENT ================= */}
            <div className="mt-6">

              <h3 className="text-lg font-bold text-[#f0f00c] uppercase mb-4">
                Payment Details
              </h3>

              <div className="bg-white/5 border border-[#f0f00c]/20 p-4">

                <p className="text-[#f0f00c] text-xs uppercase font-bold">
                  Transaction ID
                </p>

                <p className="font-semibold text-white break-all">
                  {selectedUser.transactionId}
                </p>

                <p className="text-[#f0f00c] text-xs uppercase font-bold mt-4">
                  Amount
                </p>

                <p className="font-bold text-[#f0f00c] text-xl">
                  ₹{selectedUser.package?.price || 0}
                </p>

              </div>

            </div>

            {/* ================= SCREENSHOT ================= */}
            {selectedUser.screenshot && (

              <div className="mt-6">

                <h3 className="text-lg font-bold text-[#f0f00c] uppercase mb-4">
                  Payment Screenshot
                </h3>

                <img
                  src={selectedUser.screenshot}
                  alt="Payment Screenshot"
                  onClick={() => setSelectedImage(selectedUser.screenshot)}
                  className="w-full max-w-md border border-[#f0f00c]/40 cursor-pointer hover:opacity-90 transition"
                />

                <p className="text-white/50 text-xs mt-2">
                  Click image to view large
                </p>

              </div>

            )}

            {/* ================= VERIFY / REJECT ================= */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">

              <button
                onClick={() => handleVerify(selectedUser)}
                className="flex-1 bg-green-500 hover:bg-green-600 text-black font-bold py-3 transition uppercase text-sm"
              >
                ✓ Verify
              </button>

              <button
                onClick={() => handleReject(selectedUser)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 transition uppercase text-sm"
              >
                ✕ Reject
              </button>

            </div>

          </div>

        </div>

      )}

      {/* ================= IMAGE VIEWER ================= */}
      {selectedImage && (

        <div
          className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >

          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-5 right-6 text-[#f0f00c] text-4xl hover:text-red-500"
          >
            ×
          </button>

          <img
            src={selectedImage}
            alt="Payment Preview"
            className="max-w-full max-h-[90vh] object-contain border border-[#f0f00c]/40"
            onClick={(e) => e.stopPropagation()}
          />

        </div>

      )}

    </div>
  );
};

export default Dashboard;