import React, { PureComponent } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';

const data = [
    {
      name: 'Page A', uv: 4000, pv: 2400, amt: 2400,
    },
    {
      name: 'Page B', uv: 3000, pv: 1398, amt: 2210,
    },
    {
      name: 'Page C', uv: 2000, pv: 9800, amt: 2290,
    },
    {
      name: 'Page D', uv: 2780, pv: 3908, amt: 2000,
    },
    {
      name: 'Page E', uv: 1890, pv: 4800, amt: 2181,
    },
    {
      name: 'Page F', uv: 2390, pv: 3800, amt: 2500,
    },
    {
      name: 'Page G', uv: 3490, pv: 4300, amt: 2100,
    },
];

export default class Chart extends PureComponent {
  constructor(props) {
        super(props);
        this.state = {
        };
        
  }
  render() {
    return (

      <LineChart
        width={500}
        height={300}
        data={this.props.data}
        margin={{
          top: 5, right: 50, left: 10, bottom: 5,
        }}
      >
        <Legend layout="vertical" verticalAlign="top" align="center" />
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="div" angle={-45}/>
        <YAxis/>
        <Tooltip />
        <Line type="monotone" dataKey="avg_data" stroke="#82ca9d" activeDot={{ r: 8 }} />
        
        {/*
        <Line type="monotone" dataKey="max_data" stroke="#8884d8" />
        <Line type="monotone" dataKey="min_data" stroke="#0099ff" />
        */}
      </LineChart>
 
    );
  }
}