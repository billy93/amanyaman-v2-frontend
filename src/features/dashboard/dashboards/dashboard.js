/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts'
import {chartstate} from './dashboardSlice'
import PulseLoader from 'react-spinners/PulseLoader'
import {
Link as Links,
  Box,
  Text,
  Center,
} from '@chakra-ui/react'
import { useDispatch, useSelector } from 'react-redux'
import PieChart from './pieChart';
import BarChart from './columnChart';


function usePrevious(value) {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = React.useRef();
  // Store current value in ref
  React.useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes
  // Return previous value (happens before update in useEffect above)
  return ref.current;
}


const Dashboards = () => {
    const [MasterChecked, setMasterChecked] = useState(false)
    const initstate= useSelector(chartstate)
    const [loading,setLoading] = React.useState(false)
  const [state] = React.useState({
       series: [{
              name: 'Sales',
               data: [4, 3, 10, 9, 29, 19, 22, 9, 12, 7, 19, 5, 13, 9, 17, 2, 7, 5]
            }],
       options: {
              chart: {
                height: 350,
                type: 'line',
                dropShadow: {
                  enabled: true,
                  color: '#000',
                  top: 18,
                  left: 7,
                  blur: 10,
                  opacity: 0.2
           },
                toolbar: {
                  show: true
                }
              },
              forecastDataPoints: {
                count: 7
              },
              colors: ['#065BAA', '#50b848'],
              dataLabels: {
                enabled: true,
              },
              markers: {
                size: 1
              },
              stroke: {
                width: 5,
                curve: 'smooth'
              },
              xaxis: {
                type: 'datetime',
                categories: ['1/11/2000', '2/11/2000', '3/11/2000', '4/11/2000', '5/11/2000', '6/11/2000', '7/11/2000', '8/11/2000', '9/11/2000', '10/11/2000', '11/11/2000', '12/11/2000', '1/11/2001', '2/11/2001', '3/11/2001','4/11/2001' ,'5/11/2001' ,'6/11/2001'],
                tickAmount: 10,
                labels: {
                  formatter: function(value, timestamp, opts) {
                    return opts.dateFormatter(new Date(timestamp), 'dd MMM')
                  }
                },
              },
              title: {
                text: 'Policies Issued',
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
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.9,
                colorStops: [
                  {
                    offset: 0,
                    color: "#065BAA",
                    opacity: 1
                  },
                  {
                    offset: 20,
                    color: "#50b848",
                    opacity: 1
                  },
                  {
                    offset: 60,
                    color: "#61DBC3",
                    opacity: 1
                  },
                  {
                    offset: 100,
                    color: "#95DA74",
                    opacity: 1
                  }
                ]
                }
                // gradient: {
                //   shade: 'dark',
                //   gradientToColors: [ '#065BAA'],
                //   shadeIntensity: 1,
                //   type: 'horizontal',
                //   opacityFrom: 1,
                //   opacityTo: 1,
                //   stops: [0, 100, 100, 100]
                // },
              },
              yaxis: {
                min: -10,
                max: 40
              },
            },
    })
    const dispatch = useDispatch()
  
    // const data = React.useMemo(() => tempList);
    

    let content;
    if (loading) {
        content = <Center h='50vh' color='#065BAA'>
                       <PulseLoader color={"#065BAA"} />
                   </Center>;
    } else if (initstate) {
        content = (
            <Box pl="2em" pr="2em" mt="5em"> 
                <Box bg="white" overflow={'scroll'} p="3">
                    <div id="chart">
                       <Box display={'flex'} gap="10px" mb="1em">
                          <Box p="10px" bg="white" border="1px solid #ebebeb" w="100%" display={'flex'} flexDirection={'column'} alignItems={'start'} justifyContent={'center'}>
                            <Text as="p" size={'sm'} style={{fontSize:"14px", fontFamily:"Mulish"}}>
                              Total Policies 
                            </Text>
                            <Text as="b" size={'sm'} style={{fontSize:"18px", fontFamily:"Mulish"}}>
                              4.629 
                            </Text>
                          </Box>
                          <Box p="10px" bg="white" border="1px solid #ebebeb" w="100%" display={'flex'} flexDirection={'column'} alignItems={'start'} justifyContent={'center'}>
                            <Text as="p" size={'sm'} style={{fontSize:"14px", fontFamily:"Mulish"}}>
                              Total Sales Amount
                            </Text>
                            <Text as="b" size={'sm'} style={{fontSize:"18px", fontFamily:"Mulish"}}>
                            IDR 52.466.700
                            </Text>
                          </Box>
                       </Box>
                        <ReactApexChart options={state?.options} series={state?.series} type="line" height={350} />
                    </div>
              </Box>
              <Box display={'flex'} gap="10px" justifyContent={'space-around'} mb="1em">
                <Box w="50%" bg="blue" flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>  
                  <Box bg="white" border="1px solid #ebebeb" w="100%">
                    <Text as="p" size={'sm'}  p="1em" style={{fontSize:"18px", fontFamily:"Mulish"}}>
                      Policies Issued
                    </Text>
                  </Box>
                  <Box bg="white" border="1px solid #ebebeb" w="100%" p="1em" display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                    <Text as="b" size={'sm'}  pl="6px" color={'#065BAA'} style={{fontSize:"14px", fontFamily:"Mulish"}}>Asia 50 Family 9 - 11 days</Text>
                    <Text as="b" size={'sm'}  pl="6px" color={'#231F20'} style={{fontSize:"14px", fontFamily:"Mulish"}}>257 sold</Text>
                  </Box>
                  <Box bg="white" border="1px solid #ebebeb" w="100%" p="1em" display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                     <Text as="b" size={'sm'} pl="6px" color={'#065BAA'} style={{ fontSize: "14px", fontFamily: "Mulish" }}>Asia 50 Individual 6 - 8 days</Text>
                     <Text as="b" size={'sm'}  pl="6px" color={'#231F20'} style={{fontSize:"14px", fontFamily:"Mulish"}}>27 sold</Text>
                  </Box>
                  <Box bg="white" border="1px solid #ebebeb" w="100%" p="1em" display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                      <Text as="b" size={'sm'} pl="6px" color={'#065BAA'} style={{ fontSize: "14px", fontFamily: "Mulish" }}>Asia 50 Individual 1 - 5 days</Text>
                     <Text as="b" size={'sm'}  pl="6px" color={'#231F20'} style={{fontSize:"14px", fontFamily:"Mulish"}}>17 sold</Text>
                  </Box>
                </Box>
                <Box w="50%" bg="blue" flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>  
                  <Box bg="white" border="1px solid #ebebeb" w="100%">
                    <Text as="p" size={'sm'}  p="1em" style={{fontSize:"18px", fontFamily:"Mulish"}}>
                      Policies Issued
                    </Text>
                  </Box>
                  <Box bg="white" border="1px solid #ebebeb" w="100%" p="1em" display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                    <Text as="b" size={'sm'}  pl="6px" color={'#065BAA'} style={{fontSize:"14px", fontFamily:"Mulish"}}>Jhon doe</Text>
                    <Text as="b" size={'sm'}  pl="6px" color={'#231F20'} style={{fontSize:"14px", fontFamily:"Mulish"}}>29 Policies</Text>
                    <Text as="b" size={'sm'}  pl="6px" color={'#231F20'} style={{fontSize:"14px", fontFamily:"Mulish"}}>IDR 3.540.000</Text>
                  </Box>
                  <Box bg="white" border="1px solid #ebebeb" w="100%" p="1em" display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                     <Text as="b" size={'sm'} pl="6px" color={'#065BAA'} style={{ fontSize: "14px", fontFamily: "Mulish" }}>Eric Jhonson</Text>
                     <Text as="b" size={'sm'} pl="6px" color={'#231F20'} style={{ fontSize: "14px", fontFamily: "Mulish" }}>10 Policies</Text>
                     <Text as="b" size={'sm'}  pl="6px" color={'#231F20'} style={{fontSize:"14px", fontFamily:"Mulish"}}>IDR 1.070.000</Text>
                  </Box>
                  <Box bg="white" border="1px solid #ebebeb" w="100%" p="1em" display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                      <Text as="b" size={'sm'} pl="6px" color={'#065BAA'} style={{ fontSize: "14px", fontFamily: "Mulish" }}>Bayu Antara</Text>
                      <Text as="b" size={'sm'} pl="6px" color={'#231F20'} style={{ fontSize: "14px", fontFamily: "Mulish" }}>30 Policies</Text>
                     <Text as="b" size={'sm'}  pl="6px" color={'#231F20'} style={{fontSize:"14px", fontFamily:"Mulish"}}>IDR 30.000.000</Text>
                  </Box>
                </Box>
              </Box>
              <Box display={'flex'} gap="10px" justifyContent={'space-around'} mb="1em" >
                <Box w="50%" flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>  
                  <Box bg="white" border="1px solid #ebebeb" w="100%">
                    <Text as="p" size={'sm'}  p="1em" style={{fontSize:"18px", fontFamily:"Mulish"}}>
                      Policies Statuses
                    </Text>
                  </Box>
                  <PieChart />
                </Box>
                <Box w="50%" flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>  
                  <Box bg="white" border="1px solid #ebebeb" w="100%">
                    <Text as="p" size={'sm'}  p="1em" style={{fontSize:"18px", fontFamily:"Mulish"}}>
                      Payment Types
                    </Text>
                  </Box>
                  <BarChart />
                </Box>
              </Box>
          </Box>
        )
    } else if ('isError') {
        content = <p>{JSON.stringify('error')}</p>;
    }

    return content
}
export default Dashboards