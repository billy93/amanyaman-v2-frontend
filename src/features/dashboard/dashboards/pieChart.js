import React from 'react';
import ReactApexChart from 'react-apexcharts';

function PieChart() {
  const [state] = React.useState({
    series: [44, 55, 41, 17, 15],
    options: {
      chart: {
        width: 380,
        type: 'donut',
      },
      plotOptions: {
        pie: {
          startAngle: -90,
          endAngle: 270,
        },
      },
      dataLabels: {
        enabled: false,
      },
      fill: {
        type: 'gradient',
      },
      legend: {
        formatter: function (val, opts) {
          return val + ' - ' + opts.w.globals.series[opts.seriesIndex];
        },
      },

      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    },
  });
  return (
    <div id="chart" style={{ border: '1px solid #ebebeb' }}>
      <ReactApexChart
        options={state?.options}
        series={state?.series}
        type="donut"
        height={350}
      />
    </div>
  );
}

export default PieChart;
