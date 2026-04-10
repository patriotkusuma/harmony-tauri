import React from "react";
import { Card, CardBody, CardHeader } from "reactstrap";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const ExpenseBreakdownChart = ({ expenses }) => {
  if (!expenses || expenses.length === 0) return null;

  // Filter out expenses with 0 balance and sort by amount descending
  const activeExpenses = expenses
    .filter(exp => exp.balance > 0)
    .sort((a, b) => b.balance - a.balance)
    .slice(0, 7); // Show top 7, others can be grouped

  const otherExpenses = expenses
    .filter(exp => exp.balance > 0)
    .sort((a, b) => b.balance - a.balance)
    .slice(7);

  const labels = activeExpenses.map(exp => exp.account_name);
  const dataValues = activeExpenses.map(exp => exp.balance);

  if (otherExpenses.length > 0) {
    labels.push("Lainnya");
    dataValues.push(otherExpenses.reduce((sum, exp) => sum + exp.balance, 0));
  }

  const data = {
    labels: labels,
    datasets: [
      {
        data: dataValues,
        backgroundColor: [
          "#f5365c", "#fb6340", "#ffd600", "#11cdef", "#2dce89", "#5e72e4", "#8965e0", "#adb5bd"
        ],
        borderWidth: 0,
        hoverOffset: 15,
      },
    ],
  };

  const options = {
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
    cutout: '65%',
  };

  return (
    <Card className="shadow-premium border-0 mb-5 overflow-hidden">
      <CardHeader className="bg-transparent pb-0">
        <h6 className="text-uppercase text-muted ls-1 mb-1">Analisis Pengeluaran</h6>
        <h5 className="h3 mb-0">Komposisi Beban</h5>
      </CardHeader>
      <CardBody>
        <div style={{ height: '280px' }}>
          <Doughnut data={data} options={options} />
        </div>
      </CardBody>
    </Card>
  );
};

export default ExpenseBreakdownChart;
