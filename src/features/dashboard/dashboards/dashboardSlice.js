import { createSlice } from "@reduxjs/toolkit"

const createDashboardSlice = createSlice({
    name: 'dashboardSlice',
    initialState: { 
        policy: {
            series: [{
              name: 'Sales',
               data: [30, 40, 45, 50, 49, 60, 70, 91]
            }],
            options: {
              chart: {
                height: 350,
                type: 'line',
              },
              forecastDataPoints: {
                count: 7
              },
              stroke: {
                width: 5,
                curve: 'smooth'
              },
              xaxis: {
                type: 'datetime',
                categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
                tickAmount: 10,
                labels: {
                 formatter: value => `${value}}`
                }
              },
              title: {
                text: 'Forecast',
                align: 'left',
                style: {
                  fontSize: "16px",
                  color: '#666'
                }
              },
              fill: {
                type: 'gradient',
                gradient: {
                  shade: 'dark',
                  gradientToColors: [ '#FDD835'],
                  shadeIntensity: 1,
                  type: 'horizontal',
                  opacityFrom: 1,
                  opacityTo: 1,
                  stops: [0, 100, 100, 100]
                },
              },
              yaxis: {
                min: -10,
                max: 40
              }
            },
        }
     },
    reducers: {
        setStatePolicyList: (state, action) => {
            state.policy = action.payload
        },
    },
})

export const {setStatePolicyList} = createDashboardSlice.actions

export default createDashboardSlice.reducer
export const chartstate = (state) => state.dashboards.policy

