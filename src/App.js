import React from 'react'
import Titles from './components/Titles'
import Form from './components/Form'
import Weather from './components/Weather'
import { wait } from '@testing-library/react'

const API_KEY = '986f23ae0447c649c36930c44d073083'

class App extends React.Component {
  state = {
    temperature: undefined,
    city: undefined,
    country: undefined,
    humidity: undefined,
    description: undefined,
    error: undefined,
    lat: undefined,
    lng: undefined,
  }

  componentWillMount() {
    console.log('Component Will Mount')

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        this.setState({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        console.log(this.state)
        let api_call = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${this.state.lat}&lon=${this.state.lng}&appid=${API_KEY}&units=metric`
        )
        const data = await api_call.json()
        console.log(data)

        this.setState({
          temperature: data.main.temp,
          city: data.name,
          country: data.sys.country,
          humidity: data.main.humidity,
          description: data.weather[0].description,
          error: '',
        })
      })
    }
  }

  getWeather = async (e) => {
    console.log('Get Weather Function ')
    e.preventDefault()

    const city = e.target.elements.city.value
    const country = e.target.elements.country.value
    let api_call = undefined
    try {
      api_call = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${API_KEY}&units=metric`
      )

      const data = await api_call.json()

      this.setState({
        temperature: data.main.temp,
        city: data.name,
        country: data.sys.country,
        humidity: data.main.humidity,
        description: data.weather[0].description,
        error: '',
      })
      console.log(data)
    } catch (error) {
      this.setState({
        temperature: undefined,
        city: undefined,
        country: undefined,
        humidity: undefined,
        description: undefined,
        error: 'Please enter correct values',
      })
    }
  }

  render() {
    return (
      <div class='wrapper'>
        <div class='main'>
          <div class='container'>
            <div class='row'>
              <div className='col-xs-12 col-sm-5  title-container'>
                <Titles />
              </div>
              <div className='col-xs-12 col-sm-7 form-container'>
                <Form
                  getWeather={this.getWeather}
                  city={this.state.city}
                  country={this.state.country}
                />
                <Weather
                  temperature={this.state.temperature}
                  city={this.state.city}
                  country={this.state.country}
                  humidity={this.state.humidity}
                  description={this.state.description}
                  error={this.state.error}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default App
