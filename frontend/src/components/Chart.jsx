// Import necessary parts from react-chartjs-2 and Chart.js
import React from 'react';
import { Line } from 'react-chartjs-2';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from "axios";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import dayjs from 'dayjs';
import '../styles/loginfo.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Chart = () => {

  const { logID } = useParams();
  const [timeLogs, setTimeLogs] = useState([]);

  useEffect(() => {
    axios.get(`https://chronologger-backend-0d366a44ea30.herokuapp.com/logs/${logID}`, { withCredentials: true })
    .then(response => {
      console.log(response.data.log.loggedTimes);
      processLogs(response.data.log.loggedTimes)
    })
    .catch(error => {
      console.log(error);
    })
  }, [])

  const getLast7Days = () => {
    let days = [];
    for (let i = 6; i>= 0; i--) {
      const date = dayjs().subtract(i, 'day').format('MMM D');
      days.push(date);
    }
    return days;
  }

  const last7days = getLast7Days();

  const processLogs = (logs) => {
    const formattedLogs = logs.map(entry => ({
      date:  dayjs(entry.formattedDate, "M/D/YY").format("MMM D"),
      hours: (entry.loggedTimeTotal / 60).toFixed(1)
    }))
    setTimeLogs(formattedLogs);
  }

  // Combine logs by date
  const combinedLogs = timeLogs.reduce((acc, log) => {
    if (acc[log.date]) {
      acc[log.date] = (parseFloat(acc[log.date]) + parseFloat(log.hours)).toFixed(2);
    } else {
      acc[log.date] = parseFloat(log.hours).toFixed(2);
    }
    return acc;
  }, {});
  
  const chartData = {
    labels: Object.keys(combinedLogs), 
    datasets: [
      {
        label: 'Hours Logged',
        data: Object.values(combinedLogs),
        borderColor: '#40C057',
        backgroundColor: '#5ce175',
        fill: false,
        tension: 0
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        suggestedMax: 5,
        ticks: {
          stepSize: 1,
          color: `#000000c6`
        },
      },
      x: {
        ticks: { color: '#000000c6' }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: `#0000006`
        }
      }
    }
  };

  return (
    <div className="chart-container">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default Chart;
