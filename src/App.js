import { Card, CardContent, FormControl, MenuItem, Select } from '@material-ui/core';
import React, {useState, useEffect} from 'react'
import axios from 'axios'
import './App.css';
import InfoBox from './Components/InfoBox';
import DisplayMap from './Components/DisplayMap'
import Table from './Components/Table';
import { sortData } from './util'
import LineGraph from './Components/LineGraph';
import "leaflet/dist/leaflet.css"

function App() {

  const [countries, setCountries] = useState(["USA", "IND", "UK"])
  const [country, setCountry] = useState("worldwide")
  const [countryInfo, setCountryInfo] = useState({})
  const [tableData, setTableData] = useState([])
  const [mapCenter, setMapCenter] = useState({lat: -15, lng: 30});
  const [mapZoom, setMapZoom] = useState(3)

  useEffect(() => {
     axios.get("https://disease.sh/v3/covid-19/countries").then(res => {
            const countries = res.data.map(country => ({
              name: country.country,
              value: country.countryInfo.iso2
            }))
            
            const sortedData = sortData(res.data)
            setTableData(sortedData)
            setCountries(countries)
     }).catch(err => {
             console.log("Error", err)
     })

    axios.get("https://disease.sh/v3/covid-19/all").then(response => {
      setCountryInfo(response.data)
    }).catch(err => {
        console.log(err)
    })

  }, [])

  const onCountryChange = (e) => {
    const countrycode = e.target.value;
    console.log(countrycode)
    setCountry(countrycode)

    const url = countrycode == "worldwide" ? 'https://disease.sh/v3/covid-19/countries/all' : `https://disease.sh/v3/covid-19/countries/${countrycode}`

    axios.get(url).then(response => {
      setCountryInfo(response.data)
      // console.log("MAP",response.data.countryInfo.lat, response.data.countryInfo.long )
      // console.log("CI",response.data.countryInfo )
      // setMapCenter({lat: response.data.countryInfo.lat, lng: response.data.countryInfo.long})
      setMapCenter({ lat: response.data.countryInfo.lat, lng: response.data.countryInfo.long });
      setMapZoom(10)
    }).catch(err => {
        console.log(err)
    })
  }

  return (
     <div className="app">
      <div className="app__left">
         <div className="app__header">
           <h1>COVID-19 TRACKER</h1>
           <FormControl className="app__dropdown">
             {console.log("country", countries)}
             <Select variant="outlined" onChange={onCountryChange} value={country}>
               <MenuItem value="worldwide">worldwide</MenuItem>
               {
                  countries.map((country, index) => (
                     <MenuItem value={country.value} key={index}>{country.name}</MenuItem>
                  ))
               }
             </Select>
          </FormControl>
         </div>

       <div className="app__status">
            <InfoBox title="Coronavirus Cases" total={countryInfo.cases} cases={countryInfo.todayCases}> </InfoBox>
            <InfoBox title="Recovered" total={countryInfo.recovered} cases={countryInfo.todayRecovered}> </InfoBox>
            <InfoBox title="Deaths" total={countryInfo.deaths} cases={countryInfo.todayDeaths}> </InfoBox>
       </div>

       <div className="app__map">
             {console.log(mapCenter, "&&&&&&&&&&&&&", country)}
             <DisplayMap center={mapCenter} zoom={mapZoom}/>
       </div>
      </div>

      <Card className="app__right">
         <CardContent>
           <h3> Live Cases by Country</h3>
           <Table countries={tableData} />
           <LineGraph/>
         </CardContent>
      </Card>
     </div>   
  );
}

export default App;
