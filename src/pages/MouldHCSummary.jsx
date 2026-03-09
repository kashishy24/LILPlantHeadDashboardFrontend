// src/pages/MouldHCSummary.jsx

import React, { useEffect, useState, useRef } from "react";
import DashboardLayout from "../partials/DashboardLayout";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const BASE = (import.meta.env.VITE_BACKEND_BASE_URL || "").replace(/\/+$/, "");

const MouldHCSummary = () => {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [prodDate, setProdDate] = useState("");

  const tableRef = useRef();

  useEffect(() => {
    fetchData();
    fetchProdDate();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `${BASE}/MouldSummary/hc-summary-current-year`
      );
      setData(res.data);
    } catch (err) {
      console.error("Error fetching HC summary:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProdDate = async () => {
    try {
      const res = await axios.get(`${BASE}/PerformanceHome/GetProdDate`);

      if (res.data.length > 0) {
        const formattedDate = new Date(res.data[0].ProdDate)
          .toISOString()
          .split("T")[0];

        setProdDate(formattedDate);
      }

    } catch (err) {
      console.error("ProdDate error:", err);
    }
  };

  // Excel Download
  const downloadExcel = () => {
    const workbook = XLSX.utils.table_to_book(
      tableRef.current,
      { sheet: "HC Summary" }
    );

    XLSX.writeFile(workbook, `HC_Summary_${prodDate}.xlsx`);
  };

  // PDF Download
  const downloadPDF = () => {

    const doc = new jsPDF("l", "mm", "a4");

    autoTable(doc, {
      html: tableRef.current,
      startY: 20,
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [55, 65, 81] },
      alternateRowStyles: { fillColor: [245, 245, 245] }
    });

    doc.save(`HC_Summary_${prodDate}.pdf`);
  };

  // KPI totals
  const totalPlan = data.reduce((sum, r) => sum + (r.Plan || 0), 0);
  const totalActual = data.reduce((sum, r) => sum + (r.Actual || 0), 0);
  const totalOnTime = data.reduce((sum, r) => sum + (r.OnTime || 0), 0);
  const totalDelayed = data.reduce((sum, r) => sum + (r.Delayed || 0), 0);

  return (
    <DashboardLayout>

      <div className="p-6 bg-gray-100 min-h-screen">

        {/* HEADER CARD */}
        <div className="bg-white shadow-md rounded-xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4">

          <div className="flex items-center gap-4">
   
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
        <div className="grid grid-cols-4 gap-4 mb-6">

          <div className="bg-white shadow rounded-lg p-4">
            <p className="text-sm text-gray-500">Total Plan</p>
            <p className="text-xl font-bold text-blue-600">{totalPlan}</p>
          </div>

          <div className="bg-white shadow rounded-lg p-4">
            <p className="text-sm text-gray-500">Total Actual</p>
            <p className="text-xl font-bold text-indigo-600">{totalActual}</p>
          </div>

          <div className="bg-white shadow rounded-lg p-4">
            <p className="text-sm text-gray-500">On Time</p>
            <p className="text-xl font-bold text-green-600">{totalOnTime}</p>
          </div>

          <div className="bg-white shadow rounded-lg p-4">
            <p className="text-sm text-gray-500">Delayed</p>
            <p className="text-xl font-bold text-red-600">{totalDelayed}</p>
          </div>

        </div>

        {/* TABLE */}
        <div className="bg-white shadow-lg rounded-xl border border-gray-200 overflow-auto max-h-[65vh]">

          {loading ? (
            <div className="p-10 text-center text-gray-500 animate-pulse">
              Loading Health Check Summary...
            </div>
          ) : (

            <table
              ref={tableRef}
              className="w-full text-sm text-center border"
            >

              <thead className="sticky top-0 bg-indigo-700 text-white z-10">

                <tr>
                  <th className="border px-4 py-2">Month</th>
                  <th className="border px-4 py-2">Plan</th>
                  <th className="border px-4 py-2">Actual</th>
                  <th className="border px-4 py-2">On Time</th>
                  <th className="border px-4 py-2">Delayed</th>
                </tr>

              </thead>

              <tbody>

                {data.map((row, index) => (

                  <tr
                    key={index}
                    className="border hover:bg-blue-50 transition"
                  >

                    <td className="border px-4 py-2 font-semibold text-gray-700">
                      {row.Month}
                    </td>

                    <td className="border px-4 py-2">
                      {row.Plan}
                    </td>

                    <td className="border px-4 py-2">
                      {row.Actual}
                    </td>

                    <td className="border px-4 py-2 text-green-600 font-semibold">
                      {row.OnTime}
                    </td>

                    <td className="border px-4 py-2 text-red-600 font-semibold">
                      {row.Delayed}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>
          )}

        </div>

      </div>

    </DashboardLayout>
  );
};

export default MouldHCSummary;