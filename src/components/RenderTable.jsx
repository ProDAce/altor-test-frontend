import { useEffect, useState } from "react";
import { CSVLink, CSVDownload } from "react-csv";
import { IC_pagePrev, IC_pageNext, IC_sortDsc, IC_sortAsc, IC_filter } from "./Icons";


function RenderTable({ originalData }) {

    const [data, setData] = useState([])
    const [currentData, setCurrentData] = useState([]);
    const [page, setPage] = useState(0);
    const [search, setSearch] = useState("");
    const [items, setItems] = useState(50);
    const [filterList, setFilterList] = useState({})
    const [openFilter, setOpenFilter] = useState("");
    const [filter, setFilter] = useState({});



    // const [originalData, setOriginalData] = useState(data)

    useEffect(() => {
        if (originalData.length > 0) {
            const zSet = new Set();
            const dbSet = new Set();
            const sdkSet = new Set();
            const vbSet = new Set();
            const vccSet = new Set();

            originalData.forEach(obj => {
                zSet.add(obj.zone);
                dbSet.add(obj.device_brand)
                sdkSet.add(obj.sdk_int)
                vbSet.add(obj.vehicle_brand)
                vccSet.add(obj.vehicle_cc)
            })

            // setFilterList()
            const f = {
                zone: [...zSet].sort(),
                device_brand: [...dbSet].sort(),
                sdk_int: [...sdkSet].sort(),
                vehicle_brand: [...vbSet].sort(),
                vehicle_cc: [...vccSet].sort(),
            }

            const f2 = {
                zone: [...zSet].sort(),
                device_brand: [...dbSet].sort(),
                sdk_int: [...sdkSet].sort(),
                vehicle_brand: [...vbSet].sort(),
                vehicle_cc: [...vccSet].sort(),
            }

            setFilterList({ ...f });
            setFilter({ ...f2 })
            setData(originalData)
        }
    }, [originalData])

    useEffect(() => {
        if (data.length > 0) {
            setPage(0);
        }
    }, [data])

    useEffect(() => {
        if (page > 0) {
            const l = data.length;
            const idx = (page - 1) * items;
            setCurrentData(data.slice(idx, idx + items))
        } else {
            setPage(1)
        }

    }, [page])

    // useEffect(() => {
    //     if (search.length) {
    //         sliceData()
    //     }

    // }, [search])


    const handleOpenFilter = (v) => {
        if (openFilter !== v) {
            setOpenFilter(v)
        } else {
            setOpenFilter("")
        }
    }

    const sliceData = (s = false) => {
        let arr = []
        for (let i = 0; i < originalData.length; i++) {
            let o = originalData[i];
            if (
                filter["zone"].includes(o["zone"]) &&
                filter["device_brand"].includes(o["device_brand"]) &&
                filter["sdk_int"].includes(o["sdk_int"]) &&
                filter["vehicle_brand"].includes(o["vehicle_brand"]) &&
                filter["vehicle_cc"].includes(o["vehicle_cc"]) &&
                ((search.length > 0 && o["username"].includes(String(search)) ||
                    search.length == 0))
            ) {
                arr.push(o);
            }
        }
        if (s) {
            setSearch("");
        }
        setData(arr);
    }

    const handleFilter = (e, field, v) => {
        let f = filter[field];
        if (e) {
            f.push(v)
            setFilter({ ...filter, [field]: f })
        } else {
            const index = f.indexOf(v);
            if (index > -1) {
                f.splice(index, 1);
            }
            setFilter({ ...filter, [field]: f })
        }
        setSearch("");
        sliceData();
    }

    const downloadCSV = (v) => {
        let csvData = [];
        if (v == 1) {
            // let k = Object.keys(originalData);
            csvData.push([
                "device_brand",
                "model",
                "processor",
                "sdk_int",
                "username",
                "vehicle_brand",
                "vehicle_cc",
                "vehicle_type",
                "zone"
            ])

            for (let i = 0; i < originalData.length; i++) {
                csvData.push([
                    originalData[i].device_brand,
                    originalData[i].model,
                    originalData[i].processor,
                    originalData[i].sdk_int,
                    originalData[i].username,
                    originalData[i].vehicle_brand,
                    originalData[i].vehicle_cc,
                    originalData[i].vehicle_type,
                    originalData[i].zone,
                ])
            }
        } else if (v == 2) {
            csvData.push([
                "username",
                "zone",
                "device_brand",
                "sdk_int",
                "vehicle_brand",
                "vehicle_cc"
            ])

            for (let i = 0; i < data.length; i++) {
                csvData.push([
                    data[i].username,
                    data[i].zone,
                    data[i].device_brand,
                    data[i].sdk_int,
                    data[i].vehicle_brand,
                    data[i].vehicle_cc
                ])
            }
        } else {
            csvData.push([
                "username",
                "zone",
                "device_brand",
                "sdk_int",
                "vehicle_brand",
                "vehicle_cc"
            ])

            for (let i = 0; i < currentData.length; i++) {
                csvData.push([
                    currentData[i].username,
                    currentData[i].zone,
                    currentData[i].device_brand,
                    currentData[i].sdk_int,
                    currentData[i].vehicle_brand,
                    currentData[i].vehicle_cc
                ])
            }
        }
        return csvData
    }



    const renderDropDown = (v) => {
        let r = [];
        if (v in filterList) {
            filterList[v].forEach(obj => {
                r.push(
                    <li key={obj}>
                        <input id={`${v} + ${obj}`} type="checkbox" checked={filter[v].includes(obj)} onChange={(e) => {
                            setOpenFilter("")
                            handleFilter(e.target.checked, v, obj)
                        }} /><label htmlFor={`${v} + ${obj}`}>{obj}</label>
                    </li >)
            })

            return (
                <div className={"dropdown " + (openFilter == v ? "d-open" : "")}>
                    <ul>
                        {r}
                    </ul>
                </div>
            )
        }

    }

    const renderHeader = () => {
        // if (headerInData) {
        //     return <></>
        // } else {
        return (
            <thead>
                <tr>
                    <th>
                        <div className="th-div">username</div>
                    </th>
                    <th>
                        <div className="th-div">
                            zone

                            <div className="icons-div" style={{ marginLeft: "8px" }}>
                                <IC_filter height={16} width={16} onClick={() => handleOpenFilter("zone")} />
                                {renderDropDown("zone")}
                            </div>
                        </div>

                    </th>
                    <th>
                        <div className="th-div">
                            device_brand
                            <div className="icons-div" style={{ marginLeft: "8px" }}>
                                <IC_filter height={16} width={16} onClick={() => handleOpenFilter("device_brand")} />
                                {renderDropDown("device_brand")}
                            </div>
                        </div>

                    </th>
                    <th>
                        <div className="th-div">
                            sdk_int
                            <div className="icons-div" style={{ marginLeft: "8px" }}>
                                <IC_filter height={16} width={16} onClick={() => handleOpenFilter("sdk_int")} />
                                {renderDropDown("sdk_int")}
                            </div>
                        </div>

                    </th>
                    <th>
                        <div className="th-div">
                            vehicle_brand
                            <div className="icons-div" style={{ marginLeft: "8px" }}>
                                <IC_filter height={16} width={16} onClick={() => handleOpenFilter("vehicle_brand")} />
                                {renderDropDown("vehicle_brand")}
                            </div>
                        </div>

                    </th>
                    <th>
                        <div className="th-div">
                            vehicle_cc
                            <div className="icons-div" style={{ marginLeft: "8px" }}>
                                <IC_filter height={16} width={16} onClick={() => handleOpenFilter("vehicle_cc")} />
                                {renderDropDown("vehicle_cc")}
                            </div>
                        </div>

                    </th>
                </tr>
            </thead>
        )
        // }

    }
    const renderRows = () => {
        return (
            <tbody>
                {
                    currentData?.map((obj, index) => {
                        return (
                            <tr key={index}>
                                <td>{obj.username}</td>
                                <td>{obj.zone} <span></span></td>
                                <td>{obj.device_brand}</td>
                                <td>{obj.sdk_int}</td>
                                <td>{obj.vehicle_brand}</td>
                                <td>{obj.vehicle_cc}</td>
                            </tr>
                        )
                    })
                }
            </tbody>
        )
    }
    return (
        <>
            <div className="search">
                <label htmlFor="search">Search: </label>
                <input id="search" type="text" placeholder="Search by name" value={search} onChange={(e) => { setSearch(e.target.value) }} />
                <button onClick={() => sliceData(true)}>Search</button>
            </div>
            <div className="table-div">

                {/* <div style={{ position: 'sticky', top:'0'}}>NEW HEADER CDAFSVSSG</div> */}
                <table>
                    {renderHeader()}
                    {renderRows()}
                </table>

            </div>
            <div className="pagination-div">
                <button onClick={() => setPage(page - 1)} disabled={page == 1}><IC_pagePrev /></button>
                <div >{page} / {Math.ceil(data.length / items)}</div>
                <button onClick={() => setPage(page + 1)} disabled={page >= Math.ceil(data.length / items)} ><IC_pageNext /></button>
                <label htmlFor="jumpPage">Jump to:</label>
                <input type="number" name="jumpPage" id="jumpPage" style={{ height: "30px", textAlign: "center" }} onChange={(e) => {
                    if (e.target.value % 1 === 0 && e.target.value >= 1 && e.target.value <= Math.floor(data.length / items)) {
                        setPage(e.target.value)
                    }
                }} />
            </div>
            <div className="csv">
                <CSVLink data={downloadCSV(1)}><button>Download Original Data</button></CSVLink>
                <CSVLink data={downloadCSV(2)}><button >Download Filtered Data</button></CSVLink>
                <CSVLink data={downloadCSV(3)}><button >Download current {currentData.length} Data</button></CSVLink>
            </div>
        </>
    );
}

export default RenderTable;