import React, { useState } from "react";
import Chart from "react-apexcharts";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";
import "./App.css";

const App = () => {
  const [initialCapital, setInitialCapital] = useState(9500);
  const [years, setYears] = useState(30);
  const [monthlyContribution, setMonthlyContribution] = useState(2600);

  const calculateGrowthOverTime = (
    initialCapital,
    years,
    monthlyContribution,
    rate
  ) => {
    const r = rate / 12; // Monthly interest rate
    let currentValue = initialCapital;
    const valuesOverTime = [];

    for (let month = 0; month < years * 12; month++) {
      currentValue = (currentValue + monthlyContribution) * (1 + r);
      valuesOverTime.push(parseFloat(currentValue.toFixed(2)));
    }

    return valuesOverTime;
  };

  // Calculate values for both "Investing" and "Saving" scenarios
  const investingValues = calculateGrowthOverTime(
    initialCapital,
    years,
    monthlyContribution,
    0.08
  );
  const savingValues = calculateGrowthOverTime(
    initialCapital,
    years,
    monthlyContribution,
    0.02
  );

  // Generate actual year labels for the X-axis (spread across the years)
  const currentYear = new Date().getFullYear();
  const interval = Math.floor(years / 3); // Spread the labels evenly (show 4 ticks)
  const yearsX = [
    currentYear,
    currentYear + interval,
    currentYear + 2 * interval,
    currentYear + years,
  ];
  const newYearsX = Array.from({ length: years + 1 }, (_, index) =>
    (currentYear + index).toString()
  );

  // Adjust data to have one point per year
  const investingValuesPerYear = investingValues.filter(
    (_, index) => (index + 1) % 12 === 0
  );
  const savingValuesPerYear = savingValues.filter(
    (_, index) => (index + 1) % 12 === 0
  );

  const options = {
    chart: {
      id: "investment-growth",
      type: "area",
      toolbar: { show: false },
    },
    xaxis: {
      categories: newYearsX,
      labels: {
        show: true,
        rotate: 0,
        rotateAlways: false,
        hideOverlappingLabels: true,
        showDuplicates: false,
        trim: false,
        minHeight: 40,
        maxHeight: 120,
        style: {
          colors: [],
          fontSize: "12px",
          fontFamily: "Helvetica, Arial, sans-serif",
          fontWeight: 400,
          cssClass: "apexcharts-xaxis-label",
        },
        offsetX: 0,
        offsetY: 0,
      },
      tickAmount: yearsX.length - 1, // Adjust to match number of labels
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        formatter: (val) => `${val.toLocaleString()}`,
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 0.5,
        opacityFrom: 0.7,
        opacityTo: 0.3,
      },
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    dataLabels: {
      enabled: false, // Remove labels on the lines
    },
    markers: {
      size: 0, // Remove markers from the lines
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      labels: {
        useSeriesColors: true,
        formatter: function (seriesName, opts) {
          // Dynamically calculate the last values based on the series data
          let totalInvesting =
            investingValuesPerYear[investingValuesPerYear.length - 1];
          let totalSaving = savingValuesPerYear[savingValuesPerYear.length - 1];

          if (seriesName === "Inversión") {
            return `Inversión: $${totalInvesting.toLocaleString()}`;
          } else if (seriesName === "Ahorro") {
            return `Ahorro: $${totalSaving.toLocaleString()}`;
          }
          return seriesName;
        },
      },
    },
    tooltip: {
      x: {
        formatter: function (val) {
          return val ? `${val}` : "";
        },
      },
      y: {
        formatter: function (val, opts) {
          const seriesName = opts.seriesName === "Inversión" ? "Inversión" : "Ahorro";
          return `${val.toLocaleString()} ${seriesName}`;
        },
      },
    },
    colors: ["#00C9A7", "#f1c40f"],
    grid: {
      borderColor: "#ccc", // Light grid lines
      strokeDashArray: 5, // Dashed grid lines
    },
  };

  const series = [
    {
      name: "Inversión",
      data: investingValuesPerYear,
    },
    {
      name: "Ahorro",
      data: savingValuesPerYear,
    },
  ];

  return (
    <Box sx={{ display: "flex", justifyContent: "center", padding: 0 }}>
      <div className="slider-panel">
        <div className="slider-group">
          <label>Tiempo de Inversión</label>
          <div className="slider-container">
            <Slider
              min={10}
              max={50}
              step={5}
              value={years}
              onChange={(e, newValue) => setYears(newValue)}
              className="custom-slider"
            />
            <div className="slider-label-below">{years} Años</div>
          </div>
        </div>
        <div className="slider-group">
          <label>Capital Inicial</label>
          <div className="slider-container">
            <Slider
              min={1000}
              max={10000}
              step={500}
              value={initialCapital}
              onChange={(e, newValue) => setInitialCapital(newValue)}
              className="custom-slider"
            />
            <div className="slider-label-below">${initialCapital} USD</div>
          </div>
        </div>
        <div className="slider-group">
          <label>Inversión Mensual</label>
          <div className="slider-container">
            <Slider
              min={100}
              max={5000}
              step={100}
              value={monthlyContribution}
              onChange={(e, newValue) => setMonthlyContribution(newValue)}
              className="custom-slider"
            />
            <div className="slider-label-below">${monthlyContribution} USD</div>
          </div>
        </div>
      </div>
      <div className="chart-panel">
        <Chart
          options={options}
          series={series}
          type="area"
          height={400}
          width={600}
        />
      </div>
    </Box>
  );
};

export default App;