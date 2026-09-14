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
  const totalRegistrations =
    registrations.length;

  const verifiedCount =
    registrations.filter(
      (reg) => reg.status === "Verified"
    ).length;

  const rejectedCount =
    registrations.filter(
      (reg) => reg.status === "Rejected"
    ).length;

  const pendingCount =
    registrations.filter(
      (reg) => reg.status === "Pending"
    ).length;

  const totalEvents =
    registrations.reduce(
      (total, reg) =>
        total +
        (reg.selectedEvents?.length || 0),
      0
    );

  return (
    <div className="min-h-screen bg-[#020a18] text-white p-4 md:p-8">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <div>
          <h1 className="text-3xl font-bold text-cyan-400">
            Registration Dashboard
          </h1>

          <p className="text-gray-400 mt-1">
            Manage symposium registrations
          </p>
        </div>

        <button
          onClick={downloadExcel}
          className="bg-green-500 hover:bg-green-600 text-black font-semibold px-5 py-3 rounded-lg transition"
        >
          Download Excel
        </button>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">

        <div className="bg-[#021423] border border-[#12384b] rounded-xl p-5">
          <p className="text-gray-400 text-sm">
            Total Registrations
          </p>

          <h2 className="text-2xl font-bold mt-2">
            {totalRegistrations}
          </h2>
        </div>

        <div className="bg-[#021423] border border-[#12384b] rounded-xl p-5">
          <p className="text-gray-400 text-sm">
            Showing
          </p>

          <h2 className="text-2xl font-bold mt-2">
            {filteredRegistrations.length}
          </h2>
        </div>

        <div className="bg-[#021423] border border-[#12384b] rounded-xl p-5">
          <p className="text-gray-400 text-sm">
            Pending
          </p>

          <h2 className="text-2xl font-bold mt-2 text-yellow-400">
            {pendingCount}
          </h2>
        </div>

        <div className="bg-[#021423] border border-[#12384b] rounded-xl p-5">
          <p className="text-gray-400 text-sm">
            Verified
          </p>

          <h2 className="text-2xl font-bold mt-2 text-green-400">
            {verifiedCount}
          </h2>
        </div>

        <div className="bg-[#021423] border border-[#12384b] rounded-xl p-5">
          <p className="text-gray-400 text-sm">
            Rejected
          </p>

          <h2 className="text-2xl font-bold mt-2 text-red-400">
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
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full md:w-[450px] bg-[#021423] border border-[#12384b] rounded-lg px-4 py-3 outline-none focus:border-cyan-400"
        />

      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-[#021423] border border-[#12384b] rounded-xl overflow-hidden">

        {loading ? (
          <div className="p-10 text-center text-gray-400">
            Loading registrations...
          </div>
        ) : filteredRegistrations.length === 0 ? (
          <div className="p-10 text-center text-gray-400">
            No registrations found
          </div>
        ) : (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1000px]">

              <thead>
                <tr className="border-b border-[#12384b] text-left">

                  <th className="px-5 py-4 text-cyan-400">
                    Reg ID
                  </th>

                  <th className="px-5 py-4 text-cyan-400">
                    Participant
                  </th>

                  <th className="px-5 py-4 text-cyan-400">
                    Department
                  </th>

                  <th className="px-5 py-4 text-cyan-400">
                    Phone
                  </th>

                  <th className="px-5 py-4 text-cyan-400">
                    Events
                  </th>

                  <th className="px-5 py-4 text-cyan-400">
                    Amount
                  </th>

                  <th className="px-5 py-4 text-cyan-400">
                    Payment
                  </th>

                  <th className="px-5 py-4 text-cyan-400">
                    Action
                  </th>

                </tr>
              </thead>

              <tbody>

                {filteredRegistrations.map(
                  (reg) => {

                    const isRejected =
                      reg.status === "Rejected";

                    const isVerified =
                      reg.status === "Verified";

                    return (
                      <tr
                        key={reg.id}
                        className="border-b border-[#12384b] hover:bg-[#031b2b] transition"
                      >

                        {/* REG ID */}
                        <td className="px-5 py-4">

                          <span
                            className={`font-semibold ${
                              isRejected
                                ? "text-red-400"
                                : isVerified
                                ? "text-green-400"
                                : "text-cyan-400"
                            }`}
                          >
                            {reg.regId}
                          </span>

                        </td>

                        {/* PARTICIPANT */}
                        <td className="px-5 py-4">

                          <div>
                            <p className="font-semibold">
                              {reg.fullName}
                            </p>

                            <p className="text-sm text-gray-400">
                              {reg.email}
                            </p>
                          </div>

                        </td>

                        {/* DEPARTMENT */}
                        <td className="px-5 py-4 uppercase">
                          {reg.department}
                        </td>

                        {/* PHONE */}
                        <td className="px-5 py-4">
                          {reg.phone}
                        </td>

                        {/* EVENTS */}
                        <td className="px-5 py-4">

                          <div className="flex flex-wrap gap-2">

                            {reg.selectedEvents?.map(
                              (event, index) => (
                                <span
                                  key={index}
                                  className="bg-[#09283a] border border-[#164b63] text-cyan-300 px-2 py-1 rounded-md text-xs"
                                >
                                  {event}
                                </span>
                              )
                            )}

                          </div>

                        </td>

                        {/* AMOUNT */}
                        <td className="px-5 py-4 font-semibold">
                          ₹{reg.package?.price || 0}
                        </td>

                        {/* PAYMENT */}
                        <td className="px-5 py-4">

                          {reg.screenshot ? (

                            <img
                              src={reg.screenshot}
                              alt="Payment"
                              onClick={() =>
                                setSelectedImage(
                                  reg.screenshot
                                )
                              }
                              className="w-16 h-16 object-cover rounded-lg border border-[#12384b] cursor-pointer hover:scale-105 transition"
                            />

                          ) : (
                            <span className="text-gray-500">
                              No Image
                            </span>
                          )}

                        </td>

                        {/* ACTION */}
                        <td className="px-5 py-4">

                          <button
                            onClick={() =>
                              setSelectedUser(reg)
                            }
                            className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold px-4 py-2 rounded-lg transition"
                          >
                            View
                          </button>

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* ================= DETAILS MODAL ================= */}
      {selectedUser && (

        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() =>
            setSelectedUser(null)
          }
        >

          <div
            className="bg-[#021423] border border-[#12384b] rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* MODAL HEADER */}
            <div className="flex justify-between items-center mb-6">

              <div>
                <h2 className="text-2xl font-bold text-cyan-400">
                  Registration Details
                </h2>

                <p
                  className={`font-semibold mt-1 ${
                    selectedUser.status ===
                    "Rejected"
                      ? "text-red-400"
                      : selectedUser.status ===
                        "Verified"
                      ? "text-green-400"
                      : "text-yellow-400"
                  }`}
                >
                  {selectedUser.status}
                </p>
              </div>

              <button
                onClick={() =>
                  setSelectedUser(null)
                }
                className="text-gray-400 hover:text-white text-3xl"
              >
                ×
              </button>

            </div>

            {/* BASIC DETAILS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="bg-[#031b2b] rounded-xl p-4">
                <p className="text-gray-400 text-sm">
                  Registration ID
                </p>

                <p
                  className={`font-bold text-lg ${
                    selectedUser.status ===
                    "Rejected"
                      ? "text-red-400"
                      : selectedUser.status ===
                        "Verified"
                      ? "text-green-400"
                      : "text-cyan-400"
                  }`}
                >
                  {selectedUser.regId}
                </p>
              </div>

              <div className="bg-[#031b2b] rounded-xl p-4">
                <p className="text-gray-400 text-sm">
                  Full Name
                </p>

                <p className="font-semibold">
                  {selectedUser.fullName}
                </p>
              </div>

              <div className="bg-[#031b2b] rounded-xl p-4">
                <p className="text-gray-400 text-sm">
                  Email
                </p>

                <p className="font-semibold break-all">
                  {selectedUser.email}
                </p>
              </div>

              <div className="bg-[#031b2b] rounded-xl p-4">
                <p className="text-gray-400 text-sm">
                  Phone
                </p>

                <p className="font-semibold">
                  {selectedUser.phone}
                </p>
              </div>

              <div className="bg-[#031b2b] rounded-xl p-4">
                <p className="text-gray-400 text-sm">
                  College
                </p>

                <p className="font-semibold uppercase">
                  {selectedUser.college}
                </p>
              </div>

              <div className="bg-[#031b2b] rounded-xl p-4">
                <p className="text-gray-400 text-sm">
                  Department
                </p>

                <p className="font-semibold uppercase">
                  {selectedUser.department}
                </p>
              </div>

              <div className="bg-[#031b2b] rounded-xl p-4">
                <p className="text-gray-400 text-sm">
                  Year
                </p>

                <p className="font-semibold">
                  {selectedUser.year}
                </p>
              </div>

              <div className="bg-[#031b2b] rounded-xl p-4">
                <p className="text-gray-400 text-sm">
                  Food
                </p>

                <p className="font-semibold uppercase">
                  {selectedUser.food}
                </p>
              </div>

            </div>

            {/* ================= EVENTS ================= */}
            <div className="mt-6">

              <h3 className="text-xl font-bold text-cyan-400 mb-4">
                Selected Events
              </h3>

              <div className="space-y-4">

                {selectedUser.selectedEvents?.map(
                  (event, index) => {

                    const members = (
                      selectedUser.teamMembers?.[
                        event
                      ] || []
                    ).filter(
                      (member) =>
                        member &&
                        member.trim() !== ""
                    );

                    return (
                      <div
                        key={index}
                        className="bg-[#031b2b] border border-[#12384b] rounded-xl p-4"
                      >

                        <h4 className="font-bold text-lg text-white">
                          {event}
                        </h4>

                        {members.length > 0 ? (

                          <div className="mt-3">

                            <p className="text-gray-400 text-sm mb-2">
                              Team Members
                            </p>

                            <div className="flex flex-wrap gap-2">

                              {members.map(
                                (member, memberIndex) => (
                                  <span
                                    key={
                                      memberIndex
                                    }
                                    className="bg-[#09283a] border border-[#164b63] text-cyan-300 px-3 py-2 rounded-lg"
                                  >
                                    {member}
                                  </span>
                                )
                              )}

                            </div>

                          </div>

                        ) : (

                          <p className="text-gray-400 mt-2">
                            Individual Event
                          </p>

                        )}

                      </div>
                    );
                  }
                )}

              </div>

            </div>

            {/* ================= PAYMENT ================= */}
            <div className="mt-6">

              <h3 className="text-xl font-bold text-cyan-400 mb-4">
                Payment Details
              </h3>

              <div className="bg-[#031b2b] rounded-xl p-4">

                <p className="text-gray-400 text-sm">
                  Transaction ID
                </p>

                <p className="font-semibold break-all">
                  {selectedUser.transactionId}
                </p>

                <p className="text-gray-400 text-sm mt-4">
                  Amount
                </p>

                <p className="font-bold text-green-400 text-xl">
                  ₹{selectedUser.package?.price || 0}
                </p>

              </div>

            </div>

            {/* ================= SCREENSHOT ================= */}
            {selectedUser.screenshot && (

              <div className="mt-6">

                <h3 className="text-xl font-bold text-cyan-400 mb-4">
                  Payment Screenshot
                </h3>

                <img
                  src={selectedUser.screenshot}
                  alt="Payment Screenshot"
                  onClick={() =>
                    setSelectedImage(
                      selectedUser.screenshot
                    )
                  }
                  className="w-full max-w-md rounded-xl border border-[#12384b] cursor-pointer hover:opacity-90 transition"
                />

                <p className="text-gray-500 text-sm mt-2">
                  Click image to view large
                </p>

              </div>

            )}

            {/* ================= VERIFY / REJECT ================= */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">

              <button
                onClick={() =>
                  handleVerify(selectedUser)
                }
                className="flex-1 bg-green-500 hover:bg-green-600 text-black font-bold py-3 rounded-xl transition"
              >
                ✓ Verify
              </button>

              <button
                onClick={() =>
                  handleReject(selectedUser)
                }
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition"
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
          onClick={() =>
            setSelectedImage(null)
          }
        >

          <button
            onClick={() =>
              setSelectedImage(null)
            }
            className="absolute top-5 right-6 text-white text-4xl hover:text-red-400"
          >
            ×
          </button>

          <img
            src={selectedImage}
            alt="Payment Preview"
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) =>
              e.stopPropagation()
            }
          />

        </div>

      )}

    </div>
  );
};

export default Dashboard;