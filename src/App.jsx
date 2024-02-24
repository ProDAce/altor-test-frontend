import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import res from './assets/data.json';
import RenderTable from './components/RenderTable.jsx';
import RenderBarChart from './components/RenderBarChart.jsx';
import RenderPieChatrs from './components/RenderPieChatrs.jsx';
import { IC_menu } from './components/Icons.jsx';


import AppService from '../service/app-service.js'


// import { Chart } from "react-google-charts";
// import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function App() {

  // const colors = ["#72cec1", "#ffc7e4", "#8884d8", "#ffeb5c", "#fead52", "#3db4ec", "#ff8671"]
  // const colorsInv = ["#8d313e", "#00381b", "#777b27", "#0014a3", "#0152ad", "#c24b13", "#00798e"]
  // const [vehicles, setVehicles] = useState([]);
  // const [vehiclesKeys, setVehiclesKeys] = useState([]);

  // const [devices, setDevices] = useState([]);
  // const [devicesKeys, setDevicesKeys] = useState([]);

  const [zones, setZones] = useState([]);
  const [currentZone, setCurrentZone] = useState("All");
  const [data, setData] = useState([]);
  const [chartData, setChartData] = useState({});
  const [stackChartData, setStackChartData] = useState({});
  const [currentData, setCurrentData] = useState({});
  const [menu, setMenu] = useState(false);


  useEffect(() => {

    // setData(res.data)
    AppService.getAllData().then(response => {
      setData(response.data.result)
    }).catch(error => {
      console.error(error)
    })
  }, [])

  useEffect(() => {
    if (data.length) {

      let tempData = {}
      data.forEach(obj => {

        const sdk = String(obj.sdk_int);
        // Check if zone exist
        if (obj.zone in tempData) {

          if (obj.vehicle_brand in tempData[obj.zone].vehicle_brand) {
            tempData[obj.zone].vehicle_brand[obj.vehicle_brand] = tempData[obj.zone].vehicle_brand[obj.vehicle_brand] + 1
          } else {
            tempData[obj.zone].vehicle_brand[obj.vehicle_brand] = 1
          }

          if (obj.device_brand in tempData[obj.zone].device_brand) {
            tempData[obj.zone].device_brand[obj.device_brand] = tempData[obj.zone].device_brand[obj.device_brand] + 1
          } else {
            tempData[obj.zone].device_brand[obj.device_brand] = 1
          }

          if (obj.vehicle_cc in tempData[obj.zone].vehicle_cc) {
            tempData[obj.zone].vehicle_cc[obj.vehicle_cc] = tempData[obj.zone].vehicle_cc[obj.vehicle_cc] + 1
          } else {
            tempData[obj.zone].vehicle_cc[obj.vehicle_cc] = 1
          }

          if (sdk in tempData[obj.zone].handset_sdk) {
            tempData[obj.zone].handset_sdk[sdk] = tempData[obj.zone].handset_sdk[sdk] + 1
          } else {
            tempData[obj.zone].handset_sdk[sdk] = 1
          }
        } else {
          tempData[obj.zone] = {
            vehicle_brand: {
              [obj.vehicle_brand]: 1
            },
            device_brand: {
              [obj.device_brand]: 1
            },
            vehicle_cc: {
              [obj.vehicle_cc]: 1
            },
            handset_sdk: {
              [sdk]: 1
            }
          }
        }
      })

      // Data manupulation for charts
      const z = Object.keys(tempData).sort()
      console.log(tempData);
      setZones(["All", ...z]);

      let vcc = [];
      let sdkInt = [];
      z.forEach(ob => {
        let temp = [];
        vcc.push({
          "_zone": ob,
          ...tempData[ob].vehicle_cc
        })

        sdkInt.push({
          "_zone": ob,
          ...tempData[ob].handset_sdk
        })

        temp = Object.keys(tempData[ob].vehicle_brand).sort().map(m => { return { "name": m, "total_vehicles": tempData[ob].vehicle_brand[m] } })
        tempData[ob].vehicle_brand = temp;

        temp = Object.keys(tempData[ob].device_brand).sort().map(m => { return { "name": m, "total_devices": tempData[ob].device_brand[m] } })
        tempData[ob].device_brand = temp;

        temp = Object.keys(tempData[ob].vehicle_cc).sort().map(m => { return { "name": m, "total_vehicles": tempData[ob].vehicle_cc[m] } })
        tempData[ob].vehicle_cc = temp;

        temp = Object.keys(tempData[ob].handset_sdk).sort().map(m => { return { "sdk_int": m, "total_devices": tempData[ob].handset_sdk[m] } })
        tempData[ob].handset_sdk = temp;
      })
      setChartData(tempData)
      setStackChartData({
        vcc: vcc,
        sdk: sdkInt
      });

    }

  }, [data])


  // useEffect(() => {

  // }, [zones])

  function renderChartsOfZones() {
    if (Object.keys(chartData).length && zones.length) {
      console.log(zones.slice(1));
      return Object.keys(zones).slice(1).map((z, index) => {
        let k = zones[z];

        if (currentZone == "All" || currentZone == k) {
          return (
            <>
              <section>
                <div className="section-title">{k} charts</div>
                <div className="pie-chart-div">
                  <div className="pie-chart-wrapper">
                    <RenderPieChatrs key={k} data={chartData[k]?.device_brand} dataKey="total_devices" title="Device Brand distribution" />
                  </div>
                  <div className="pie-chart-wrapper">
                    <RenderPieChatrs key={k} data={chartData[k]?.vehicle_brand} dataKey="total_vehicles" title="Vehicle Brand distribution" />
                  </div>
                  <div className="pie-chart-wrapper">
                    <RenderPieChatrs key={k} data={chartData[k]?.vehicle_cc} dataKey="total_vehicles" title="Vehicle CC distribution" />
                  </div>
                </div>

                <div className="bar-chart-div">
                  <div className="bar-chart-wrapper">
                    <RenderBarChart data={chartData[k]?.vehicle_brand} dataKey={{ x: "name", y: "total_vehicles" }} title="Vehicle Brand distribution" colorIndx={index} />
                  </div>
                  <div className="bar-chart-wrapper">
                    <RenderBarChart data={chartData[k]?.handset_sdk} dataKey={{ x: "sdk_int", y: "total_devices" }} title="Handset Device SDK distribution" colorIndx={index} />
                  </div>
                </div>
              </section>
            </>
          )
        } else {
          return <></>
        }
      })
    }
  }
  // function renderChartsOfZones() {
  //   console.log(chartData);
  //   if (Object.keys(chartData).length) {
  //     if (currentZone === "All") {
  //       return zones.slice(1).map((obj, index) => {
  //         return (
  //           <div className="chart-zone" key={obj}>
  //             <h2 style={{ marginTop: "16px", marginBottom: "8px" }}>{obj}</h2>
  //             <div className="charts">
  //               <div className="chart-container">
  //                 <div className="title">Device Brand distribution</div>
  //                 <div className="chart-c">
  //                   <RenderPieChatrs data={chartData[obj]?.device_brand} dataKey="total_devices" />
  //                 </div>
  //               </div>
  //               <div className="chart-container">
  //                 <div className="title">Vehicle Brand distribution</div>
  //                 <div className="chart-c">
  //                   <RenderPieChatrs data={chartData[obj]?.vehicle_brand} dataKey="total_vehicles" />
  //                 </div>
  //               </div>
  //               <div className="chart-container">
  //                 <div className="title">Vehicle CC distribution</div>
  //                 <div className="chart-c">
  //                   <RenderPieChatrs data={chartData[obj]?.vehicle_cc} dataKey="total_vehicles" />
  //                 </div>
  //               </div>
  //             </div>
  //             <div className="charts">
  //               <div className="chart-container">
  //                 <div className="title">Vehicle Brand distribution</div>
  //                 <div className="chart">
  //                   <RenderBarChart data={chartData[obj]?.vehicle_brand} dataKey={{ x: "name", y: "total_vehicles" }} />
  //                 </div>
  //               </div>
  //               <div className="chart-container">
  //                 <div className="title">Handset Device SDK distribution</div>
  //                 <div className="chart">
  //                   <RenderBarChart data={chartData[obj]?.handset_sdk} dataKey={{ x: "sdk_int", y: "total_devices" }} />
  //                 </div>
  //               </div>
  //             </div>
  //           </div>
  //         );
  //       })
  //     } else if(currentZone in chartData) {
  //       return (
  //         <div className="chart-zone">
  //           <h2 style={{ marginTop: "16px", marginBottom: "8px" }}>{currentZone}</h2>
  //           <div className="charts">
  //             <div className="chart-container">
  //               <div className="title">Device Brand distribution</div>
  //               <div className="chart-c">
  //                 <RenderPieChatrs data={chartData[currentZone]?.device_brand} dataKey="total_devices" />
  //               </div>
  //             </div>
  //             <div className="chart-container">
  //               <div className="title">Vehicle Brand distribution</div>
  //               <div className="chart-c">
  //                 <RenderPieChatrs data={chartData[currentZone]?.vehicle_brand} dataKey="total_vehicles" />
  //               </div>
  //             </div>
  //             <div className="chart-container">
  //               <div className="title">Vehicle CC distribution</div>
  //               <div className="chart-c">
  //                 <RenderPieChatrs data={chartData[currentZone]?.vehicle_cc} dataKey="total_vehicles" />
  //               </div>
  //             </div>
  //           </div>
  //           <div className="charts">
  //             <div className="chart-container">
  //               <div className="title">Vehicle Brand distribution</div>
  //               <div className="chart">
  //                 <RenderBarChart data={chartData[currentZone]?.vehicle_brand} dataKey={{ x: "name", y: "total_vehicles" }} />
  //               </div>
  //             </div>
  //             <div className="chart-container">
  //               <div className="title">Handset Device SDK distribution</div>
  //               <div className="chart">
  //                 <RenderBarChart data={chartData[currentZone]?.handset_sdk} dataKey={{ x: "sdk_int", y: "total_devices" }} />
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       )
  //     } else{
  //       return <div>Something went wrong...</div>
  //     }
  //   }

  // }

  function renderStackChart() {
    return (
      <section>
        <div className="section-title">Stacked bar chart</div>
        <div className="bar-stackchart-div">
          <div className="bar-chart-wrapper">
            <RenderBarChart data={stackChartData.vcc} dataKey={{ x: "_zone", y: "" }} stack={true} title="Vehicle CC distribution" />
          </div>
          <div className="bar-chart-wrapper">
            <RenderBarChart data={stackChartData.sdk} dataKey={{ x: "_zone", y: "" }} stack={true} title="SDK Int distribution" />
          </div>
        </div>
      </section>
      // <div className="chart-zone">
      //   <div className="charts">
      //     <div className="chart-container">
      //       <div className="title">Vehicle CC distribution</div>
      //       <div className="chart">
      //         <RenderBarChart data={stackChartData.vcc} dataKey={{ x: "_zone", y: "" }} stack={true} />
      //       </div>
      //     </div>
      //     <div className="chart-container">
      //       <div className="title">SDK Int distribution</div>
      //       <div className="chart">
      //         <RenderBarChart data={stackChartData.sdk} dataKey={{ x: "_zone", y: "" }} stack={true} />
      //       </div>
      //     </div>
      //   </div>
      // </div>

    )
  }

  function renderZones() {
    return zones.map(obj => {
      return <button key={obj} className={currentZone == obj ? "active" : ""} onClick={() => {
        setCurrentZone(obj)
        setMenu(false)
      }}>{obj}</button>
    })
  }


  return (
    <>
      <div className="container">
        <div className={"side-nav" + (menu ? " side-nav-open" : " side-nav-close")}>
          <h3>Data Visualization Dashboard</h3>
          <div className="zones">
            {renderZones()}
          </div>
        </div>
        <div className="toolbar"> <IC_menu width="48px" height="48px" color="#fff" onClick={() => setMenu(true)} /></div>
        <main>
          <section className="section-table">
            <RenderTable originalData={data} />
          </section>
          {renderChartsOfZones()}
          {renderStackChart()}
        </main>
        <div className={"drawer-background-canvas" + (menu ? " background-canvas-on" : " background-canvas-close")} onClick={() => setMenu(false)}></div>
      </div>
    </>
  )
}

export default App
