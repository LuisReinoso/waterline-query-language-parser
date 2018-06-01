import isFinite from 'lodash/isFinite'

export default class Query {
  private _etiquetas: string[]
  private _descripcion: string[]
  private _modificadores: string[]
  private _query: string

  constructor(query: string) {
    this._etiquetas = []
    this._descripcion = []
    this._modificadores = []
    this._query = ''

    this._etiquetas = this.parseQueryEtiquetas(query)
    this._descripcion = this.parseQueryDescripcion(query)
    this._modificadores = this.parseQueryModificador(query)

    if (
      this._etiquetas.length === this._descripcion.length &&
      this._etiquetas.length === this._modificadores.length &&
      this._descripcion.length === this._modificadores.length
    ) {
      this._query = this.construccionQuery(
        this._etiquetas,
        this._descripcion,
        this._modificadores
      )
    } else {
      this._query = ''
    }
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
    const regex = /[a-zA-Z0-9-_ ]+(?![a-zA-Z_0-9]*:)/g
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

  parseQueryModificador(query: string): string[] {
    const regex = /(:>=)|(:<=)|(:>)|(:<)|(:)/g
    let modificador = []
    let match: any

    do {
      match = regex.exec(query)
      if (match) {
        modificador.push(match[0].trim().substr(1))
      }
    } while (match)

    return modificador
  }

  /**
   * Construye el query de busqueda
   *
   * @param {string[]} etiquetas
   * @param {string[]} descripcion
   * @param {string[]} modificadores
   * @returns {string}
   * @memberof Query
   */
  construccionQuery(
    etiquetas: string[],
    descripcion: string[],
    modificadores: string[]
  ): string {
    let query = `where={"or":[${etiquetas.map((etiqueta, indice) => {
      // excluye valores NaN cuando no son numeros
      if (
        isFinite(parseFloat(descripcion[indice])) &&
        modificadores[indice].length > 0
      ) {
        return (
          '{"' +
          etiqueta +
          '"' +
          ':{"' +
          modificadores[indice] +
          '":' +
          descripcion[indice] +
          '}}'
        )
      } else if (isFinite(parseFloat(descripcion[indice]))) {
        return '{"' + etiqueta + '"' + ':' + descripcion[indice] + '}'
      }
      return (
        '{"' + etiqueta + '"' + ':{"contains":"' + descripcion[indice] + '"}}'
      )
    })}]}`
    return query
  }
}
