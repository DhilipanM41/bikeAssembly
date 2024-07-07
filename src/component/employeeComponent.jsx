import React, { useEffect, useState } from "react";
import { getBikeDetailsData, postBikeAssemblyData, postBikeAssemblyStatus, postLoginData } from "../api/service";
import { useLocation } from "react-router-dom";

const EmployeeComponent = () => {

    const { state } = useLocation();
    const [bikeData, setBikeData] = useState({});
    const [bikeAssemblyId, setBikeAssemblyId] = useState("");
    const [bikeAssemblyStatus, setBikeAssemblyStatus] = useState("Not Started")

    useEffect(() => {
        loadBikeDatafromApi()
    }, []);

    const loadBikeDatafromApi = async () => {
        try {
            let resp = await getBikeDetailsData({ id: state.id });
            setBikeData(resp.data);
        } catch (error) {
            console.log(error);
        }
    }

    const sumbitSelectedBike = async (selectedBikeAssembly) => {
        let payload = {
            employeeID: state.id,
            bikeID: selectedBikeAssembly.bike_id,
            status: 'Not started',
        }

        let postData = await postBikeAssemblyData(payload);
        if (postData.status == 200) {
            await loadBikeDatafromApi()
        }
    }

    const updateBikeAssemblyStatus = async () => {
        let resp = await postBikeAssemblyStatus({
            assemblyStatus: bikeAssemblyStatus,
            assemblyMapId: bikeAssemblyId
        });
        if (resp.status == 200) {
            setBikeAssemblyId("");
            await loadBikeDatafromApi();
        }
    }

    const bindBikeAssemblyDetails = () => {
        if (bikeData.selectBike) {
            return <div className="card-container" >
                {bikeData?.records?.map((obj) => {
                    return (
                        <div className="card" key={obj.bike_id}>
                            <p className="card__name">{obj.bike_name}</p>
                            <div className="grid-child-posts">
                                Assembly Time: {obj.assembly_hours} h {obj.assembly_minutes} m
                            </div>
                            <button className="btn" onClick={() => {
                                sumbitSelectedBike(obj)
                            }}>Select</button>
                        </div>

                    )
                })}
            </div>
        } else {
            return <div className="table-container">
                <table className="styled-table">
                    <thead>
                        <tr>
                            <th>Bike Name</th>
                            <th>Assembly Time</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bikeData?.records?.map((obj) => {
                            return <tr key={obj.bike_id}>
                                <td>{obj.bike_name}</td>
                                <td>{obj.assembly_hours + "h " + obj.assembly_minutes + "m"}</td>
                                <td>{bikeAssemblyId == obj.assembly_map_id ?
                                    <select value={bikeAssemblyStatus} onChange={(e) => { console.log(e.target.value); setBikeAssemblyStatus(e.target.value) }}>
                                        <option value={"Not Started"}>Not Started</option>
                                        <option value={"Completed"}>Completed</option>
                                    </select> :
                                    obj.status}
                                </td>
                                <td>{bikeAssemblyId == obj.assembly_map_id ?
                                    <>
                                        <img className="edit_icon_img" src="image/tick.png" onClick={() => {
                                            updateBikeAssemblyStatus()
                                        }}></img>
                                        <img className="edit_icon_img" src="image/cancel.png" onClick={() => {
                                            setBikeAssemblyId("");
                                            setBikeAssemblyStatus("")
                                        }}></img>
                                    </> : <img className="edit_icon_img" src="image/edit-icon.png" onClick={() => {
                                        setBikeAssemblyStatus(obj.status);
                                        setBikeAssemblyId(obj.assembly_map_id);
                                    }}></img>}</td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
        }
    }

    return (
        <div>
            {bindBikeAssemblyDetails()}
        </div>
    )
}

export default EmployeeComponent;