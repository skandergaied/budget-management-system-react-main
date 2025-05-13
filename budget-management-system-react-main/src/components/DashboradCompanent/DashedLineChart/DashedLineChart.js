// DashedLineChart.js
import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { fetchData } from '../../utils/api';

// Chart.js kayıt işlemleri
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function DashedLineChart() {
  const [incomeData, setIncomeData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        // Gelirleri getir
        const incomesResponse = await fetchData("http://localhost:8095/api/v1/income/my-incomes");

        // Giderleri getir
        const expensesResponse = await fetchData("http://localhost:8095/api/v1/expense/all");

        // Verileri işle
        setIncomeData(incomesResponse);
        setExpenseData(expensesResponse);
        setLoading(false);
      } catch (error) {
        console.error("Veri çekme hatası:", error);
        setLoading(false);
      }
    };

    fetchFinancialData();
  }, []);

  // Tarihleri ayların sırasına göre gruplamak için helper fonksiyon
  const processDataByMonth = (data) => {
    // Aylık verileri toplamak için boş bir nesne oluştur
    const monthlyData = {};

    // Aylar için labels oluştur (Ocak-Aralık)
    const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
      'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

    // Her ay için başlangıç değeri 0 olarak ayarla
    months.forEach(month => {
      monthlyData[month] = 0;
    });

    // Verileri aylara göre topla
    data.forEach(item => {
      if (item.date) {
        const date = new Date(item.date);
        const month = months[date.getMonth()];
        monthlyData[month] += parseFloat(item.amount || 0);
      }
    });

    return {
      labels: months,
      values: months.map(month => monthlyData[month])
    };
  };

  // Chart verileri oluştur
  const chartData = {
    labels: loading ? [] : processDataByMonth(incomeData).labels,
    datasets: [
      {
        label: 'Gelirler',
        data: loading ? [] : processDataByMonth(incomeData).values,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 2,
        tension: 0.4,
      },
      {
        label: 'Giderler',
        data: loading ? [] : processDataByMonth(expenseData).values,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderWidth: 2,
        borderDash: [5, 5],
        tension: 0.4,
      },
    ],
  };

  // Chart seçenekleri
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Aylık Gelir ve Gider Grafiği',
        font: {
          size: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('tr-TR', {
                style: 'currency',
                currency: 'TRY'
              }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return value.toLocaleString('tr-TR', {
              style: 'currency',
              currency: 'TRY',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            });
          }
        }
      }
    }
  };

  return (
      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title className="text-center mb-4">Finansal Genel Bakış</Card.Title>
          {loading ? (
              <div className="text-center p-5">Veriler yükleniyor...</div>
          ) : (
              <div style={{ height: '400px' }}>
                <Line data={chartData} options={chartOptions} />
              </div>
          )}
        </Card.Body>
      </Card>
  );
}

export default DashedLineChart;