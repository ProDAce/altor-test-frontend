import { useEffect, useState, createContext } from 'react';
import './App.css'

import res from './assets/data.json';
import RenderTable from './components/RenderTable.jsx';
import RenderBarChart from './components/RenderBarChart.jsx';
import RenderPieChatrs from './components/RenderPieChatrs.jsx';
import { IC_menu, IC_add, IC_sun, IC_moon } from './components/Icons.jsx';

import AppService from '../service/app-service.js'
import ReactSwitch from 'react-switch';

export const ThemeContext = createContext(null);

function App() {

  const [theme, setTheme] = useState("light");
  const [zones, setZones] = useState([]);
  const [currentZone, setCurrentZone] = useState("All");
  const [data, setData] = useState([]);
  const [chartData, setChartData] = useState({});
  const [stackChartData, setStackChartData] = useState({});
  const [menu, setMenu] = useState(false);

  const toggleTheme = () => {
    setTheme((current) => (current === "light" ? "dark" : "light"))
  }


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

        tempData[ob].vehicle_brand = sortData(tempData[ob].vehicle_brand, "name", "total_vehicles")
        tempData[ob].device_brand = sortData(tempData[ob].device_brand, "name", "total_devices")
        tempData[ob].vehicle_cc = sortData(tempData[ob].vehicle_cc, "name", "total_vehicles")
        tempData[ob].handset_sdk = sortData(tempData[ob].handset_sdk, "sdk_int", "total_devices")

        // temp = Object.keys(tempData[ob].vehicle_brand).sort().map(m => { return { "name": m, "total_vehicles": tempData[ob].vehicle_brand[m] } })
        // tempData[ob].vehicle_brand = temp;

        // temp = Object.keys(tempData[ob].device_brand).sort().map(m => { return { "name": m, "total_devices": tempData[ob].device_brand[m] } })
        // tempData[ob].device_brand = temp;

        // temp = Object.keys(tempData[ob].vehicle_cc).sort().map(m => { return { "name": m, "total_vehicles": tempData[ob].vehicle_cc[m] } })
        // tempData[ob].vehicle_cc = temp;

        // temp = Object.keys(tempData[ob].handset_sdk).sort().map(m => { return { "sdk_int": m, "total_devices": tempData[ob].handset_sdk[m] } })
        // tempData[ob].handset_sdk = temp;
      })
      console.log(tempData);
      setChartData(tempData)
      setStackChartData({
        vcc: vcc,
        sdk: sdkInt
      });
    }
  }, [data])

  function sortData(d, s1, s2) {
    let temp = [];
    // temp = Object.keys(tempData[ob].vehicle_brand).sort().map(m => { return { "name": m, "total_vehicles": tempData[ob].vehicle_brand[m] } })
    let k = Object.keys(d)

    let otherFlag = "";
    let otherTotal = 0;
    let total = 0;
    k.forEach(f => {
      if (f.toLowerCase() != "other" && f.toLowerCase() != "others" && f.toLowerCase() != "not applicable") {
        temp.push({ [s1]: f, [s2]: d[f] })
      } else {
        otherFlag = f;
      }
      total += d[f]
    })

    let j = [];
    if (k.length > 9) {
      let keysSorted = k.sort(function (a, b) { return d[a] - d[b] })
      let min = d[keysSorted[0]]
      for (let i = 0; i < keysSorted.length; i++) {
        if (d[keysSorted[i]] > min && keysSorted.length - (i + 1) < 9) {
          // j = i-1;
          break;
        } else {
          j.push(keysSorted[i])
          otherTotal += d[keysSorted[i]];

        }
      }
      // console.log(d);
      // console.log(keysSorted);
      // console.log(j);
      // console.log(otherTotal);
      // console.log(total);
    }
    if (otherFlag.length) {
      temp.push({ [s1]: otherFlag, [s2]: d[otherFlag] })
    }
    if (k.length > 9 && otherTotal) {
      temp = [];
      k.forEach(f => {
        if (!j.includes(f)) {
          temp.push({ [s1]: f, [s2]: d[f] })
        }
      })
      temp.push({ [s1]: "Others", [s2]: otherTotal })
      console.log(temp);

    }
    return temp;
  }

  function renderChartsOfZones() {
    if (Object.keys(chartData).length && zones.length) {
      return Object.keys(zones).slice(1).map((z, index) => {
        let k = zones[z];

        if (currentZone == "All" || currentZone == k) {
          return (
            <section key={index}>
              <h2>{k.substring(0, 4)} {index + 1}</h2>
              {/* <div className="section-title">{k} charts</div> */}
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
          )
        } else {
          return <></>
        }
      })
    }
  }

  function renderStackChart() {
    return (
      <section>
        <h2>Stacked bar chart</h2>
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
    <div id={theme} className="container">
      <div className={"side-nav" + (menu ? " side-nav-open" : " side-nav-close")}>
        <h3>Data Visualization Dashboard</h3>
        <div className="zones">
          {renderZones()}
          <div className="switch-div">
            <label htmlFor="switch">Dark Mode: </label>
            <ReactSwitch id="switch" className="switch" onChange={toggleTheme} checked={theme === "dark"} checkedIcon={<IC_moon />} uncheckedIcon={<IC_sun color="yellow" />} offColor="#1C1856" onColor="#1C232D" />

          </div>
        </div>
        {/* <div className="add">
            <IC_add color="aquamarine" width={36} height={36} />
          </div> */}
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
  )
}

export default App
