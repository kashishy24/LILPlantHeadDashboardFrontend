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

  // Fetch Production Date
  const fetchProdDate = async () => {
    try {
      const res = await fetch(`${BASE}/PerformanceHome/GetProdDate`);
      const data = await res.json();

      if (data.length > 0) {
        const date = new Date(data[0].ProdDate).toISOString().split("T")[0];
        setProdDate(date);
      }

    } catch (err) {
      console.error("ProdDate Error:", err);
    }
  };

  useEffect(() => {
    fetchMachines("Current");
    fetchProdDate();
  }, []);

  const handlePrev = () => {
    setFilterType("Prev");
    fetchMachines("Prev");
  };

  const handleCurrent = () => {
    setFilterType("Current");
    fetchMachines("Current");
  };

  // Excel Download
  const downloadExcel = () => {
    const table = tableRef.current;
    const workbook = XLSX.utils.table_to_book(table, { sheet: "Machine Data" });
    XLSX.writeFile(workbook, "Machine_Performance.xlsx");
  };

  // PDF Download
  const downloadPDF = () => {

    const doc = new jsPDF();

    autoTable(doc, {
      html: tableRef.current,
      startY: 20,
      theme: "grid"
    });

    doc.save("Machine_Performance.pdf");
  };

  return (
    <DashboardLayout>

      <div className="p-6 bg-gray-50 min-h-screen">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">

          {/* LEFT SIDE - PROD DATE */}
          <div className="flex items-center gap-3">
            <label className="font-medium">Prod Date:</label>
            <input
              type="date"
              value={prodDate}
              readOnly
              className="border p-2 rounded bg-gray-100"
            />
          </div>

          {/* RIGHT SIDE BUTTONS */}
          <div className="flex gap-3">

            <button
              onClick={handlePrev}
              className={`px-4 py-2 rounded text-white transition
              ${filterType === "Prev"
                  ? "bg-blue-900"
                  : "bg-blue-400 hover:bg-blue-500"
                }`}
            >
              Prev
            </button>

            <button
              onClick={handleCurrent}
              className={`px-4 py-2 rounded text-white transition
              ${filterType === "Current"
                  ? "bg-blue-900"
                  : "bg-blue-400 hover:bg-blue-500"
                }`}
            >
              Current
            </button>

            <button
              onClick={downloadExcel}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Excel
            </button>

            <button
              onClick={downloadPDF}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            >
              PDF
            </button>

          </div>

        </div>

        {/* TABLE */}
        <div className="bg-white shadow rounded-lg overflow-auto">

          <table ref={tableRef} className="w-full border text-sm">

            <thead>

              <tr className="bg-blue-900 text-white text-center">

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

              <tr className="bg-blue-700 text-white text-center">

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

                <tr key={i} className="text-center border">

                  <td className="border p-2 font-medium">{m.Machine}</td>

                  <td className="border">{m.RunningMould || "-"}</td>

                  <td className="border">{m.OEE}</td>
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