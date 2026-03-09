// src/pages/MouldSummary.jsx

import React, { useEffect, useState, useRef } from "react";
import DashboardLayout from "../partials/DashboardLayout";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const BASE = (import.meta.env.VITE_BACKEND_BASE_URL || "").replace(/\/+$/, "");

const MouldSummary = () => {

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
        `${BASE}/MouldSummary/pm-summary-current-year`
      );

      setData(res.data);

    } catch (err) {
      console.error("Error fetching PM summary:", err);
    } finally {
      setLoading(false);
    }
  };

  // Get Production Date
  const fetchProdDate = async () => {
    try {

      const res = await axios.get(
        `${BASE}/PerformanceHome/GetProdDate`
      );

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

    const table = tableRef.current;
    const workbook = XLSX.utils.table_to_book(table, { sheet: "PM Summary" });

    XLSX.writeFile(workbook, `PM_Summary_${prodDate}.xlsx`);
  };

  // PDF Download
  const downloadPDF = () => {

    const doc = new jsPDF();

    autoTable(doc, {
      html: tableRef.current,
      startY: 20,
      theme: "grid",
      styles: { fontSize: 10 }
    });

    doc.save(`PM_Summary_${prodDate}.pdf`);
  };

  return (
    <DashboardLayout>

      <div className="p-6">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">

          {/* LEFT SIDE - ProdDate */}
          <div className="flex items-center gap-2">
            <label className="font-semibold">Prod Date :</label>

            <input
              type="date"
              value={prodDate}
              readOnly
              className="border px-3 py-2 rounded bg-gray-100"
            />
          </div>

          {/* RIGHT SIDE - Download Buttons */}
          <div className="flex gap-3">

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

        {/* Title */}
        <h2 className="text-xl font-bold mb-4">
          PM Summary - Current Year
        </h2>

        {/* Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">

          {loading ? (
            <div className="p-6 text-center">Loading...</div>
          ) : (
            <table
              ref={tableRef}
              className="w-full text-sm text-center border"
            >

              <thead className="bg-blue-900 text-white">
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
                  <tr key={index} className="border hover:bg-gray-50">

                    <td className="border px-4 py-2 font-semibold">
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

export default MouldSummary;