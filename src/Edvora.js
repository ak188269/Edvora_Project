import React, { useEffect, useState } from 'react'
import "./Edvora.css"
import { BsFilterLeft } from "react-icons/bs";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import data from "./Data";
toast.configure()
const Edvora = () => {
    const [stateName, setState] = useState("state");
    const [NOUR, setNOUR] = useState(0);
    const [NOPR, setNOPR] = useState(0);
    const [currData, setData] = useState([]);
    const [stateData, setStateData] = useState([]);
    useEffect(() => {
        fetchData();
        // getFilteredByDist();

    }, [])


    const apiUrl_of_ride = " https://assessment.api.vweb.app/rides";
    const apiUrl_of_user = " https://assessment.api.vweb.app/user";
    const [initial_code, setCurrCode] = useState(0);
    const [data, setdata] = useState([]);
    useEffect(() => {
        getFilteredByDist();

    }, [data]);
    // -----------fetching data from api--------------------
    const fetchData = async () => {
        const response1 = await fetch(apiUrl_of_ride);
        const response2 = await fetch(apiUrl_of_user);
        const data1 = await response1.json();
        const data2 = await response2.json();
        setdata(data1);
        setData(data1);
        setCurrCode(data2.station_code);
        toast.info("click on 1) Nearest to find nearest ride available 2) on filter to filter", { position: 'top-center' })

    }
    const [stateList, setStateList] = useState([]);
    useEffect(() => {
        // get list of state
        const stateList = data.map((rides) => {
            return rides.state;
        });
        const newStateList = [...new Set(stateList)];
        setStateList(newStateList);
    }, [currData]);
    const [list, setList] = useState([]);

    const [cityName, setCityName] = useState("city");
    const [cityList, setCity] = useState([]);
    // getting city in the selected state
    useEffect(() => {
        const newCityList = [];
        data.forEach((rides, ind) => {
            if (rides.state === stateName) {
                newCityList.push(rides.city);
            }
        })
        setCity(newCityList);
    }, [stateName])
    const [stationCode, setCode] = useState("");
    const [stationPath, setStationPath] = useState([]);
    // ----------------filtering the data on basis of distance  click--------------

    const getFilteredByDist = (e, name = stateName) => {
        let dataToBeFiltered;
        if (name !== "state" && name !== "State") {
            dataToBeFiltered = stateData;
        }
        else {
            dataToBeFiltered = data;
        }
        let path_array = [];
        let id_of_station = new Map();
        dataToBeFiltered.forEach((rides) => {
            const station_path_array = rides.station_path;
            //  getting nearest ride
            var index = station_path_array.findIndex(function (number) {
                return number >= initial_code;
            });
            if (index >= 0) {
                path_array.push(station_path_array[index]);
                id_of_station.set(rides.id, station_path_array[index]);
            }
        });
        path_array.sort(function (a, b) { return a - b });
        setStationPath(path_array);
        let ordered_id = [];
        // for getting id in ordered they need to be shown 
        path_array.forEach((code) => {
            for (const [station_id, station_code] of id_of_station) {
                if (station_code === code) {
                    ordered_id.push(station_id);
                    id_of_station.delete(station_id);
                }
            }
        });
        let ordered_data = [];
        // getting ordered data which need to be shown
        ordered_id.forEach((id) => {
            dataToBeFiltered.map((rides) => {
                if (rides.id == id) {
                    ordered_data.push(rides);
                }
            });
        })
        setData(ordered_data);
        getNumber(dataToBeFiltered);

    }

    // ------------filtering data on basis of state------------------------------
    const getFilteredByState = (state) => {
        const filteredData = data.filter((rides) => {
            return rides.state === state;
        });
        console.log("state name inside getfil ", state);
        getFilteredByDist(state);
        //----------------------------------------------
        getNumber(filteredData);
        let list = document.querySelectorAll(".rides");
        for (let i = 0; i < list.length; i++) {
            if (list[i].id === "nearest") {
                list[i].classList.add("active");
            }
            else if (list[i].classList.contains("active")) {
                list[i].classList.remove("active");
            }
        }
        //-----------------------------
        setStateData(filteredData);
        setData(filteredData);
        setState(state);
        console.log("your data is ", filteredData);
    }
    //----------------------------filtering by city --------------------
    const getFilteredByCity = (city) => {
        const filteredData = data.filter((rides) => {
            return rides.city === city;
        })
        getNumber(filteredData);
        setStateData(filteredData);
        setData(filteredData);
        console.log("your data is ", filteredData);
    }
    // ------------filtering data on basis of past date------------------------------
    const getFilteredByDate = (type, name = stateName) => {
        //   setData(data);
        let dataToBeFiltered;
        if (name !== "state" && name !== "State") {
            dataToBeFiltered = stateData;
            console.log("not state ", name);
        }
        else {
            console.log(" state ", name);
            dataToBeFiltered = data;
        }
        console.log("unfiltered data is ", data);
        const ans = getNumber(dataToBeFiltered);
        const upcomingDateArray = ans[0];
        const pastDateArray = ans[1];
        const ordered_id2 = ans[2];
        const upcomingDateAndId = ans[3];
        const pastDateAndId = ans[4];
        const filteredData = [];
        // // if type is upcoming
        if (type === "upcoming") {
            console.log("upcoming is called");
            upcomingDateArray.map((date_diff) => {

                for (let [key, value] of upcomingDateAndId) {
                    if (value === date_diff) {
                        ordered_id2.push(key);
                        upcomingDateAndId.delete(key);
                    }
                }
            });
            console.log("ordered is ", ordered_id2);
            ordered_id2.forEach((id => {
                dataToBeFiltered.map((rides) => {
                    if (rides.id === id) {
                        filteredData.push(rides);
                    }
                })
            }));
        }
        else if (type === "past") {
            console.log("past is called");
            pastDateArray.map((date_diff) => {

                for (let [key, value] of pastDateAndId) {
                    if (value === date_diff) {
                        ordered_id2.push(key);
                        pastDateAndId.delete(key);
                    }
                }
            });
            console.log("ordered is ", ordered_id2);
            ordered_id2.forEach((id => {
                dataToBeFiltered.map((rides) => {
                    if (rides.id == id) {
                        filteredData.push(rides);
                    }
                })
            }));
        }
        console.log("filtered data is ", filteredData);
        if (filteredData.length == 0) {
            toast.info("No rides available", { position: 'top-center' });
        }
        setData(filteredData);
    }
    // changing class to active
    const changeToActive = (e) => {
        let list = document.querySelectorAll(".rides");
        for (let i = 0; i < list.length; i++) {
            if (list[i].innerHTML === e.target.innerHTML) {
                list[i].classList.add("active");
            }
            else if (list[i].classList.contains("active")) {
                list[i].classList.remove("active");
            }
        }
    }
    const getNumber = (dataToBeFiltered) => {
        let upcomingDateArray = [];
        let pastDateArray = [];
        let upcomingDateAndId = new Map();
        let pastDateAndId = new Map();
        let ordered_id2 = [];


        dataToBeFiltered.map((rides) => {
            const date = new Date();
            const parsed_date = Date.parse(date.toLocaleString());
            const diff = (Date.parse(rides.date)) - parsed_date;
            if (diff >= 0) {
                upcomingDateArray.push(diff);
                upcomingDateAndId.set(rides.id, diff);
            }
            else {
                pastDateArray.push(diff);
                pastDateAndId.set(rides.id, diff);
            }
        });
        upcomingDateArray.sort((a, b) => { return a - b });
        pastDateArray.sort((a, b) => { return b - a });
        setNOPR(pastDateArray.length);
        setNOUR(upcomingDateArray.length);
        return [upcomingDateArray, pastDateArray, ordered_id2, upcomingDateAndId, pastDateAndId];
    }
    // to show filter option
    const show = () => {
        var v = document.getElementById("filterOption");
        if (v.style.display === "block") {
            v.style.display = "none";
        } else {
            v.style.display = "block";
            document.getElementById("close").style.display = "block";
        }
        setCityName("City");
        setState("State");
    }

    const hideFilter = (e) => {
        document.getElementById("filterOption").style.display = "none";
    }
    // get closet station
    const getClosetStation = (array_of_path) => {
        let index = array_of_path.findIndex(function (number) {
            return number >= initial_code;
        })
        if (index >= 0)
            return array_of_path[index];
    }
    const getDate = (date) => {
        const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        const d = new Date(date);
        return `${d.getDate()}th ${month[d.getMonth()]} ${d.getFullYear()}  ${d.toLocaleTimeString()}`;
    }
    return (
        <>

            {/* header part begins here */}
            <div className="header">
                <span className="logo" >Edvora</span>
                <div className="right"><span id="name">Dhruv Singh</span> <img src="image.png" id='photo' alt="" /></div>
            </div>
            {/* rides and filter part begins here */}
            <div className="filter">
                <span className='rides ' id='nearest' onClick={(e) => { getFilteredByDist(e); changeToActive(e); hideFilter() }}>Nearest rides</span>
                <span className='rides ' onClick={(e) => { getFilteredByDate("upcoming"); changeToActive(e); hideFilter() }}>Upcoming rides ({NOUR})</span>
                <span className='rides' onClick={(e) => { getFilteredByDate("past"); changeToActive(e); hideFilter() }}>Past rides ({NOPR})</span>
                <span id='filterBtn' onClick={() => { show() }}>
                    <BsFilterLeft id='icon' />
                    <span id="filterTitle">  &nbsp;  Filters</span></span>
                {/* html for filter option */}
                <div id="filterOption" className='show' >
                    <input type="text" value={stationCode} placeholder='Filters' onChange={(e) => setCode(e.target.value)} />
                    <hr />
                    <AiOutlineCloseCircle id="close" onClick={() => hideFilter()} />
                    <select name="" id="state" className='options' value={stateName} onChange={(e) => { setState(e.target.value); getFilteredByState(e.target.value); }} >
                        <option className='state-options'>State</option>
                        {stateList.map((state_name) => {
                            return (
                                <option value={state_name} className='state-options' key={state_name} >{state_name}</option>
                            );
                        })
                        }


                    </select>

                    <select name="" id="city" className='options' value={cityName} onChange={(e) => { setCityName(e.target.value); getFilteredByCity(e.target.value); }}>
                        <option value="" className='state-options'>City</option>
                        {cityList.map((city, ind) => {
                            return (
                                <option value={city} className='state-options' key={ind}>{city}</option>
                            )
                        })}

                    </select>

                </div>
            </div>
            {/* --------Rides details ------------- */}
            <div id="ride-detail">
                {currData.map((rides, ind) => {
                    return (
                        <div className="rides-available" key={ind}>
                            <img src="map.png" className='map-image' alt="" />
                            <div className="info-of-rides">
                                <div className="each-info" id="ride-id">Ride id : {rides.id}</div>

                                <div className="each-info" id="origin-station">Origin Station : {rides.origin_station_code} </div>
                                <div className="each-info" id="station-path">Station path : [ {rides.station_path.map((ele, ind) => { return ele + ", "; })} ]
                                </div>
                                <div className="each-info" id="date">Date : {getDate(rides.date)} </div>
                                <div className="each-info" id="distance">Distance : {getClosetStation(rides.station_path) - initial_code} </div>
                            </div>
                            <div id="city-and-state">
                                <span className='name' id="city-name">{rides.city}</span>
                                <span className='name' id="sate-name">{rides.state}</span>
                            </div>
                        </div>

                    )
                })}

            </div>
        </>
    )
}

export default Edvora