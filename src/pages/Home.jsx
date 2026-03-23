import React, { useState, useEffect, useRef } from "react";
import DashboardLayout from "../partials/DashboardLayout";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const BASE = (import.meta.env.VITE_BACKEND_BASE_URL || "").replace(/\/+$/, "");

export default function Home() {

  const [filterType, setFilterType] = useState("Current");
  const [machines, setMachines] = useState([]);
  const [prodDate, setProdDate] = useState("");
  const [originalDate, setOriginalDate] = useState("");
  const [plantSummary, setPlantSummary] = useState(null);

  const tableRef = useRef();

  // Fetch Machine Data
  const fetchMachines = async (type) => {
    try {
      const res = await fetch(
        `${BASE}/PerformanceHome/machine-performance?filterType=${type}`
      );
      const data = await res.json();
      setMachines(data);
    } catch (err) {
      console.error("API Error:", err);
    }
  };
  //fetch plant summary
  const fetchPlantSummary = async (type) => {
    try {
      const res = await fetch(
        `${BASE}/PerformanceHome/Plant-performance?FilterType=${type}`
      );
      const data = await res.json();

      // assuming API returns single object
      setPlantSummary(data[0] || data);
    } catch (err) {
      console.error("Plant Summary API Error:", err);
    }
  };

  // Fetch Production Date
  const fetchProdDate = async () => {
    try {
      const res = await fetch(`${BASE}/PerformanceHome/GetProdDate`);
      const data = await res.json();

      if (data.length > 0) {
        const date = new Date(data[0].ProdDate).toISOString().split("T")[0];
        setProdDate(date);
        setOriginalDate(date); // store original date
      }
    } catch (err) {
      console.error("ProdDate Error:", err);
    }
  };
  useEffect(() => {
    fetchMachines("Current");
    fetchPlantSummary("Current");
    fetchProdDate();
  }, []);

  const handlePrev = () => {
    setFilterType("Prev");
    fetchMachines("Prev");
    fetchPlantSummary("Prev");
    if (originalDate) {
      const prevDate = new Date(originalDate);
      prevDate.setDate(prevDate.getDate() - 1);

      const formatted = prevDate.toISOString().split("T")[0];
      setProdDate(formatted);
    }
  };
  const handleCurrent = () => {
    setFilterType("Current");
    fetchMachines("Current");
    fetchPlantSummary("Current");
    fetchProdDate(); // reset date from API
  };

  // Excel Download
  const downloadExcel = () => {
    const table = tableRef.current;
    const workbook = XLSX.utils.table_to_book(table, { sheet: "Machine Data" });
    XLSX.writeFile(workbook, "Machine_Performance.xlsx");
  };

  // PDF Download
  const downloadPDF = () => {

    const doc = new jsPDF("l", "mm", "a4");

    doc.setFontSize(14);
    doc.text("Machine Performance Report", 14, 15);

    doc.setFontSize(10);
    doc.text(`Prod Date: ${prodDate}`, 14, 22);

    const head = [[
      "Machine",
      "Running Mould",
      "OEE",
      "Availability",
      "Performance",
      "Quality",
      "Plan",
      "Actual",
      "Achievement",
      "Rejection",
      "Man",
      "Material",
      "Method",
      "Machine",
      "Mould",
      "Total DT"
    ]];

    const body = machines.map((m) => [
      m.Machine,
      m.RunningMould || "-",
      m.OEE,
      m.Availability,
      m.Performance,
      m.Quality,
      m.Plan,
      m.Actual,
      m.Achievement,
      m.Rejected,
      m.Man,
      m.Material,
      m.Method,
      m.MachineDT,
      m.Mould,
      m.TotalDT
    ]);

    autoTable(doc, {
      startY: 28,
      head,
      body,
      styles: { fontSize: 8, halign: "center" },
      headStyles: { fillColor: [55, 65, 81] },
      alternateRowStyles: { fillColor: [245, 245, 245] }
    });

    doc.save("Machine_Performance.pdf");
  };

  // Dashboard stats
  const totalMachines = machines.length;

  return (
    <DashboardLayout>

      <div className="p-6 bg-gray-100 min-h-screen">

        {/* DASHBOARD HEADER */}
        <div className="bg-white shadow-md rounded-xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4">

          <div className="flex items-center gap-4">
            {/* <h2 className="text-xl font-semibold text-gray-700">
              Machine Performance Dashboard
            </h2> */}

            <div className="flex items-center gap-2">
              <span className="text-sm text-black">Prod Date</span>
              <input
                type="date"
                value={prodDate}
                readOnly
                className="border border-black rounded-md px-2 py-1 text-sm bg-gray-50 text-black"
              />
            </div>
          </div>

          <div className="flex gap-2">

            <button
              onClick={handlePrev}
              className={`px-4 py-2 rounded-md text-sm font-medium transition
              ${filterType === "Prev"
                  ? "bg-blue-700 text-white"
                  : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                }`}
            >
              Prev
            </button>

            <button
              onClick={handleCurrent}
              className={`px-4 py-2 rounded-md text-sm font-medium transition
              ${filterType === "Current"
                  ? "bg-blue-700 text-white"
                  : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                }`}
            >
              Current
            </button>

            <button
              onClick={downloadExcel}
              className="px-4 py-2 rounded-md bg-green-600 text-white text-sm hover:bg-green-700"
            >
              Excel
            </button>

            <button
              onClick={downloadPDF}
              className="px-4 py-2 rounded-md bg-red-600 text-white text-sm hover:bg-red-700"
            >
              PDF
            </button>

          </div>
        </div>

        {/* SUMMARY CARDS */}

        {/* PLANT SUMMARY CARDS */}
        {plantSummary && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">

            <div className="bg-white shadow rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500">OEE</p>
              <p className="text-xl font-bold text-green-600">{plantSummary.OEE}%</p>
            </div>

            <div className="bg-white shadow rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500">Availability</p>
              <p className="text-xl font-bold text-blue-600">{plantSummary.Availability}%</p>
            </div>

            <div className="bg-white shadow rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500">Performance</p>
              <p className="text-xl font-bold text-purple-600">{plantSummary.Performance}%</p>
            </div>

            <div className="bg-white shadow rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500">Quality</p>
              <p className="text-xl font-bold text-indigo-600">{plantSummary.Quality}%</p>
            </div>

            <div className="bg-white shadow rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500">Plan</p>
              <p className="text-lg font-semibold">{plantSummary.Plan}</p>
            </div>

            <div className="bg-white shadow rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500">Actual</p>
              <p className="text-lg font-semibold">{plantSummary.Actual}</p>
            </div>

            <div className="bg-white shadow rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500">Achievement</p>
              <p className="text-lg font-semibold text-green-700">
                {plantSummary.Achievement}%
              </p>
            </div>

            <div className="bg-white shadow rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500">Total DT</p>
              <p className="text-lg font-semibold text-red-600">
                {plantSummary.TotalDT}
              </p>
            </div>

          </div>
        )}
        {/* TABLE */}
        <div className="bg-white shadow-lg rounded-xl border border-gray-200 overflow-auto max-h-[70vh]">

          <table ref={tableRef} className="w-full border text-sm">

            <thead className="sticky top-0 z-20">

              <tr className="bg-indigo-700 text-white text-center">

                <th rowSpan="2" className="border p-2">Machine</th>
                <th rowSpan="2" className="border p-2">Running Mould</th>

                <th rowSpan="2" className="border">OEE</th>
                <th rowSpan="2" className="border">Availability</th>
                <th rowSpan="2" className="border">Performance</th>
                <th rowSpan="2" className="border">Quality</th>

                <th colSpan="3" className="border">Production</th>
                <th colSpan="1" className="border">Quality</th>
                <th colSpan="6" className="border">Downtimes</th>

              </tr>

              <tr className="bg-indigo-600 text-white text-center">

                <th className="border">Plan</th>
                <th className="border">Actual</th>
                <th className="border">Achievement</th>

                <th className="border">Rejection</th>

                <th className="border">Man</th>
                <th className="border">Material</th>
                <th className="border">Method</th>
                <th className="border">Machine</th>
                <th className="border">Mould</th>
                <th className="border">Total DT</th>

              </tr>

            </thead>

            <tbody>

              {machines.map((m, i) => (

                <tr
                  key={i}
                  className="text-center border text-sm hover:bg-blue-50 transition"
                >

                  <td className="border p-2 font-semibold text-gray-700">
                    {m.Machine}
                  </td>

                  <td className="border">{m.RunningMould || "-"}</td>

                  <td className="border font-semibold text-green-600">
                    {m.OEE}
                  </td>

                  <td className="border">{m.Availability}</td>
                  <td className="border">{m.Performance}</td>
                  <td className="border">{m.Quality}</td>

                  <td className="border">{m.Plan}</td>
                  <td className="border">{m.Actual}</td>
                  <td className="border">{m.Achievement}</td>

                  <td className="border">{m.Rejected}</td>

                  <td className="border">{m.Man}</td>
                  <td className="border">{m.Material}</td>
                  <td className="border">{m.Method}</td>
                  <td className="border">{m.MachineDT}</td>
                  <td className="border">{m.Mould}</td>
                  <td className="border">{m.TotalDT}</td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </DashboardLayout>
  );
}