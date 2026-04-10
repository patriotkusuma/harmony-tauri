import React from "react";
import { Row, Col, Card, CardBody, CardHeader } from "reactstrap";
import { Bar, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AccountingCharts = ({ data }) => {
  const { total_revenue = 0, total_expense = 0, total_assets = 0, total_liability = 0, total_equity = 0, accounts = [] } = data;

  // 1. Performance Chart (Revenue vs Expense)
  const performanceData = {
    labels: ["Pendapatan", "Beban"],
    datasets: [
      {
        label: "Jumlah (Rp)",
        data: [total_revenue, total_expense],
        backgroundColor: [
          "rgba(45, 206, 137, 0.8)", // success/emerald
          "rgba(245, 54, 92, 0.8)",  // danger/red
        ],
        borderRadius: 8,
        borderWidth: 0,
        barThickness: 40,
      },
    ],
  };

  const performanceOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(context.raw);
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => {
            if (value >= 1000000) return (value / 1000000) + 'M';
            if (value >= 1000) return (value / 1000) + 'k';
            return value;
          }
        },
        grid: {
          display: true,
          drawBorder: false,
          color: "rgba(0,0,0,0.05)",
        }
      },
      x: {
        grid: {
          display: false,
        }
      }
    }
  };

  // 2. Asset Structure Chart (Distribution of Asset Accounts)
  const assetAccounts = accounts.filter(acc => acc.account_type === "Assets" && acc.balance > 0);
  const assetData = {
    labels: assetAccounts.map(acc => acc.account_name),
    datasets: [
      {
        data: assetAccounts.map(acc => acc.balance),
        backgroundColor: [
          "#5e72e4", "#11cdef", "#2dce89", "#fb6340", "#f5365c", "#8965e0", "#2dcead"
        ],
        borderWidth: 0,
        hoverOffset: 10,
      },
    ],
  };

  const assetOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 11
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const val = context.raw;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((val / total) * 100).toFixed(1) + '%';
            return ` ${context.label}: ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val)} (${percentage})`;
          }
        }
      }
    },
    cutout: '70%',
  };

  return (
    <Row className="mb-5">
      <Col xl="6" className="mb-4 mb-xl-0">
        <Card className="shadow-premium border-0 h-100">
          <CardHeader className="bg-transparent">
            <h6 className="text-uppercase text-muted ls-1 mb-1">Performa Keuangan</h6>
            <h5 className="h3 mb-0">Pendapatan vs Beban</h5>
          </CardHeader>
          <CardBody>
            <div style={{ height: '240px' }}>
              <Bar data={performanceData} options={performanceOptions} />
            </div>
          </CardBody>
        </Card>
      </Col>
      <Col xl="6">
        <Card className="shadow-premium border-0 h-100">
          <CardHeader className="bg-transparent">
            <h6 className="text-uppercase text-muted ls-1 mb-1">Struktur Aset</h6>
            <h5 className="h3 mb-0">Distribusi Saldo Aset</h5>
          </CardHeader>
          <CardBody>
            {assetAccounts.length > 0 ? (
              <div style={{ height: '240px' }}>
                <Doughnut data={assetData} options={assetOptions} />
              </div>
            ) : (
              <div className="d-flex align-items-center justify-content-center h-100 text-muted italic">
                Tidak ada data aset untuk ditampilkan
              </div>
            )}
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default AccountingCharts;
