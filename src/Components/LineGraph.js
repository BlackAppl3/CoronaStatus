import  React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Line } from 'react-chartjs-2'
import numeral from 'numeral'

const options = {
    legend: {
        display: false
    },
    elements: {
        point: {
            radius: 0
        }
    },
    maintainAspectRatio: false,
    tooltips: {
        mode: "index",
        intersect: false,
        callbacks: {
            label: function(tooltipItem, data){
                return numeral(tooltipItem.value).format("+0,0")
            }
        }
    },
    scales:{
        xAxes:[
            {
                type: "time",
                time: {
                    format: "MM/DD/YY",
                    tooltipFormat: "ll"
                }
            }
        ],
        yAxes: [
            {
                gridLines: {
                    display: false
                },
                ticks: {
                    callback: function (value, index, values){
                        return numeral(value).format("0a")
                    }
                }
            }
        ]
    }
}

function LineGraph() {
    const [data, setData] = useState({})

    const buildChartData = (data, casesType='cases') => {
        const chartData = [];
        let lastDataPoint;

        for(let date in data[casesType]){
            if(lastDataPoint){
                const newDataPoint = {
                    x: date,
                    y: data[casesType][date] - lastDataPoint
                }
                chartData.push(newDataPoint)
            }
            lastDataPoint = data['cases'][date]
        }
        return chartData
    }

    useEffect(() => {
        axios.get("https://disease.sh/v3/covid-19/historical/all?lastdays=120").then(res => {
            console.log(res.data, "LG")
            const chartData = buildChartData(res.data)
            setData(chartData)
            console.log("----***", chartData)
        }).catch(e => {
            console.log(e)
        })
        
    }, [])

    return (        
        <div>
            {data?.length > 0 && (
                  <Line options={options} data={{
                    datasets: [{
                       data: data,
                       backgroundColor: "rgba(204, 16, 52, 0.5)",
                       borderColor: '#CC1034'
                    }]
                }}></Line>
            )}
        </div>
    )
}

export default LineGraph
