import React from 'react'
import ReactApexChart from 'react-apexcharts'

function ColumnChart() {
    const [state] = React.useState({
         series: [{
              name: 'Payment Types',
              data: [2.3, 3.1, 4.0, 10.1]
            }],
            options: {
              chart: {
                height: 350,
                type: 'bar',
                 toolbar: {
                    show:false,
                    tools: {
                        download: false,
                        selection: false,
                        zoom: false,
                        zoomin: false,
                        zoomout: false,
                        pan: false,
                        reset: true | '<img src="/static/icons/reset.png" width="20">',
                        customIcons: []
                    }
                },
              },
              plotOptions: {
                bar: {
                  borderRadius: 10,
                  dataLabels: {
                    position: 'top', // top, center, bottom
                  },
                },
              },
              dataLabels: {
                enabled: true,
                formatter: function (val) {
                  return val + "%";
                },
                offsetY: -20,
                style: {
                  fontSize: '12px',
                  colors: ["#304758"]
                }
              },
              
              xaxis: {
                categories: ["Credit Card", "Limit Credit", "Bank Transfer", "Deposit Top up"],
                position: 'bottom',
                axisBorder: {
                  show: false
                },
                axisTicks: {
                  show: false
                },
                crosshairs: {
                  fill: {
                    type: 'gradient',
                    gradient: {
                      colorFrom: '#D8E3F0',
                      colorTo: '#BED1E6',
                      stops: [0, 100],
                      opacityFrom: 0.4,
                      opacityTo: 0.5,
                    }
                  }
                },
                tooltip: {
                  enabled: true,
                }
                },
              yaxis: {
                axisBorder: {
                  show: false
                },
                axisTicks: {
                  show: false,
                },
                labels: {
                  show: false,
                  formatter: function (val) {
                    return val + "%";
                  }
                }
              
              },
            },
    })
  return (
        <div id="chart" style={{border:'1px solid #ebebeb'}}>
            <ReactApexChart options={state?.options} series={state?.series} type="bar" height={350} />
        </div>
  )
}

export default ColumnChart