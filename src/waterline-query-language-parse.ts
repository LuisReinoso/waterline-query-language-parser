// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"
// ...
export default class Query {
  _etiquetas: string[]
  _descripcion: string[]
  _query: string
  resultado: any

  constructor(query: string) {
    this._etiquetas = []
    this._descripcion = []
    this._query = ''

    this._etiquetas = this.parseQueryEtiquetas(query)
    this._descripcion = this.parseQueryDescripcion(query)
    this._query = this.construccionQuery(this.etiquetas, this.descripcion)
  }

  get etiquetas(): string[] {
    return this._etiquetas
  }

  get descripcion(): string[] {
    return this._descripcion
  }

  get query(): string {
    return this._query
  }

  /**
   * Método para obtener las etiquetas de un search query
   * @param query
   */
  parseQueryEtiquetas(query: string): string[] {
    const regex = /[A-Za-z][a-zA-Z0-9_]+(?=:)/g
    let etiquetas = []
    let match: any

    do {
      match = regex.exec(query)
      if (match) {
        etiquetas.push(match[0])
      }
    } while (match)
    return etiquetas
  }

  /**
   * Metodo para obtener la descripcion de las etiquetas
   *
   * @param {string} query
   * @returns {string[]}
   * @memberof Query
   */
  parseQueryDescripcion(query: string): string[] {
    const regex = /[a-z ]+(?![a-zA-Z_0-9]*:)/g
    let descripcion = []
    let match: any

    do {
      match = regex.exec(query)
      if (match) {
        descripcion.push(match[0].trim())
      }
    } while (match)
    return descripcion
  }

  /**
   * Construye el query de busqueda
   *
   * @param {string[]} etiquetas
   * @param {string[]} descripcion
   * @returns {string}
   * @memberof Query
   */
  construccionQuery(etiquetas: string[], descripcion: string[]): string {
    let query = `where={"or":[${etiquetas.map(
      (etiqueta, indice) =>
        '{"' + etiqueta + '"' + ':{"contains":"' + descripcion[indice] + '"}}'
    )}]}`
    return query
  }
}
