import React, { useEffect, useState } from "react";
import { getAllBikeAssemblyDetails } from "../api/service";
import { PieChart, Pie, Cell, ResponsiveContainer, Label, BarChart, XAxis, YAxis, Bar } from 'recharts';


const AdminComponent = () => {
    const [bikeData, setBikeData] = useState([]);
    const [filterHideOrShow, setFilterHideOrShow] = useState(true);
    const [filterData, setFilterData] = useState({ fromDate: "", toDate: "" });
    const [pieChartData, setPieChartData] = useState([]);

    useEffect(() => {
        loadAllAssemblyData()
    }, []);

    const loadAllAssemblyData = async () => {
        let resp = await getAllBikeAssemblyDetails({ fromDate: "", toDate: "" });
        setBikeData(resp.data);
        calculateProductivity(resp.data)
    }

    const calculateProductivity = (data) => {
        let currentBikeAssemblyTime = 0, totalEmployees = 0;
        let employeeCount = {};
        data.pieChartData.forEach((obj) => {
            if (new Date(obj.created_at).toISOString().split("T")[0] == new Date().toISOString().split("T")[0]) {
                currentBikeAssemblyTime += (obj.assembly_hours * 60) + obj.assembly_minutes;
            }
            employeeCount[obj.employee_id] = 1;
        });
        Object.values(employeeCount).forEach((obj) => totalEmployees += parseInt(obj));

        // 8 hours x 60 minutes = 480 minutes 
        setPieChartData([
            { name: 'Emp Production', value: parseInt((currentBikeAssemblyTime / 1000) * 480) },
            { name: 'Total', value: 100 - parseInt((currentBikeAssemblyTime / 1000) * 480) }])
    }



    const handleFilterOnChange = (event) => {
        setFilterData({ ...filterData, [event.target.id]: event.target.value });
    }

    const applyFilter = async () => {
        let resp = await getAllBikeAssemblyDetails(filterData);
        setBikeData(resp.data);
    }

    const resetFilter = async () => {
        let resp = await getAllBikeAssemblyDetails({ fromDate: "", toDate: "" });
        setBikeData(resp.data);
    }


    const bindPieChart = () => {

        const data01 = pieChartData.length ? pieChartData : [
            { name: 'Emp Production', value: 0 },
            { name: 'Total', value: 100 },
        ];

        const colors = ["green", "grey"];

        return <ResponsiveContainer width={400} height={200}>
            <PieChart>
                <Pie data={data01} dataKey="value" cx="50%" cy="50%" innerRadius={70} outerRadius={90} fill="#82ca9d" isAnimationActive={true} animationBegin={1000} animationDuration="2000" animationEasing="linear" >
                    {
                        data01.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index]} />
                        ))
                    }
                    <Label value={`Productivity ${data01[0].value}%`} fill="black" position="center" className="chart_label" />
                </Pie>
            </PieChart>
        </ResponsiveContainer>
    }

    const bindLineChart = () => {
        const colors = ['#0088FE', '#00C49F', '#FFBB28'];

        const data = bikeData.lineChartData || [];

        if (!data.length) return <div style={{ width: "601px", height: "203px" }}> <img src="image/no-record-found.png" style={{
            height: "190px", width: "448px"
        }}></img></div>;

        const getPath = (x, y, width, height) => {
            return `M${x},${y + height}C${x + width / 3},${y + height} ${x + width / 2},${y + height / 3}
                    ${x + width / 2}, ${y}
                    C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${x + width}, ${y + height}
                    Z`;
        };

        const TriangleBar = (props) => {
            const { fill, x, y, width, height } = props;

            return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
        };

        return (
            <ResponsiveContainer width={600} height={200}>
                <BarChart
                    data={data}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <XAxis dataKey="bike_name" />
                    <YAxis />
                    <Bar dataKey="bike_count" fill="#8884d8" shape={<TriangleBar />} label={{ position: 'top' }}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index % 20]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        );
    }


    return (
        <>
            <div className="admin_container">
                <div className="card-container">
                    <div className="card-1">
                        <h3 className="pie_chart_span"> Employee Productivity</h3>
                        {bindPieChart()}
                    </div>
                    <div className="card-1">
                        <div className="sub_header_charts">
                            <h3 className="pie_chart_span"> Number of Bikes assembled</h3> <img onClick={() => { setFilterHideOrShow(!filterHideOrShow) }} className="img_filter" src="image/filter.png" alt="filter" ></img>
                            <div hidden={filterHideOrShow} className="advanced_filter">
                                <p style={{ paddingLeft: '5px', marginBottom: "0" }}>Advanced Filter</p>
                                <div className="filter_subchild">
                                    <label>From Date</label>
                                    <input id="fromDate" value={filterData.fromDate} onChange={handleFilterOnChange} type="date"></input>
                                </div>
                                <div className="filter_subchild">
                                    <label>To Date</label>
                                    <input id="toDate" value={filterData.toDate} onChange={handleFilterOnChange} type="date"></input>
                                </div>
                                <div className="button_div_filter">
                                    <button onClick={() => {
                                        resetFilter()
                                    }}>Reset</button>
                                    <button onClick={applyFilter}>Apply</button>
                                </div>
                            </div>
                        </div>
                        <div>
                            {bindLineChart()}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminComponent;