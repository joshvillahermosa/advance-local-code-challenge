// ----------------------------------------------------------------
// SERVICES
// ----------------------------------------------------------------

/**
 * Creates base API Service
 **/
const createApiService = ({ baseUrl }) => {
  const xhr = new XMLHttpRequest()

  const request = ({ method, path }) => {
    return new Promise((resolve, reject) => {
      xhr.open(method, `${baseUrl}/${path}`)
      xhr.send()
      xhr.onload = () => {
        const status = xhr.status
        if (xhr.status !== 200) return reject({ status })
        resolve({ status, response: JSON.parse(xhr.response) })
      }
    })
  }

  return {
    request,
  }
}

// ---------------------------------------------------------------
// COMPONENTS
// ---------------------------------------------------------------
class Item extends React.Component {
  renderValues(item) {
    return Object.keys(item).map((key, index) => (
      <div key={index}>
        <span className="bold">{key}: </span>
        <span>{item[key]}</span>
      </div>
    ))
  }

  render() {
    const { item } = this.props
    return <div className="card-container">{this.renderValues(item)}</div>
  }
}

class DataCols extends React.Component {
  render() {
    const { items } = this.props
    return (
      <div className="container-column">
        {items.map((item, index) => (
          <Item item={item} key={index} />
        ))}
      </div>
    )
  }
}

class App extends React.Component {
  constructor() {
    super()

    this.state = {
      pokemon: null,
      people: null,
    }
  }

  componentWillMount() {
    const pokemonApiService = createApiService({ baseUrl: 'https://pokeapi.co/api/v2' })
    const starWarsApiService = createApiService({ baseUrl: 'https://swapi.co/api' })

    // Avoiding Async/Await so we can render the first result that comes
    starWarsApiService
      .request({ method: 'GET', path: 'people/' })
      .then(this.setItemsCallback('people'))

    pokemonApiService
      .request({ method: 'GET', path: 'pokemon?limit=5' })
      .then(this.setItemsCallback('pokemon'))
  }

  setItemsCallback = property => ({ response }) => this.setState({ [property]: response.results })

  render() {
    const { pokemon, people } = this.state
    return (
      <div className={'container'}>
        {pokemon ? <DataCols items={pokemon} /> : null}
        {people ? <DataCols items={people} /> : null}
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'))
