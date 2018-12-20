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

    this.addQuery(query)
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
    const regex = /[A-Za-z][\.a-zA-Z0-9_]+(?=:)/g
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
    const regex = /[a-zA-Z0-9-_ /]+(?![\.a-zA-Z_0-9]*:)/g
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
    const regex = /(:>=)|(:<=)|(:>)|(:<)|(:=)|(:)/g
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
  construccionQuery(etiquetas: string[], descripcion: string[], modificadores: string[]): string {
    let etiquetasConCategoria = etiquetas.map((etiqueta, indice) => {
      // Comprobar si es fecha segun formato inicio-fin: YYYY/MM/DD-YYYY/MM/DD ó YYYY/MM/DD
      let regexFecha = /[0-9]{4}\/[0-9]{2}\/[0-9]{2}-[0-9]{4}\/[0-9]{2}\/[0-9]{2}|[0-9]{4}\/[0-9]{2}\/[0-9]{2}/g
      let isFormatoFecha = regexFecha.exec(descripcion[indice])
      if (isFormatoFecha) {
        // parse fecha si es que tiene dos logitudes
        let fecha = isFormatoFecha[0].split('-')

        if (fecha.length === 2) {
          if (modificadores[indice] === '=') {
            return {
              categoria: 'equal',
              valor:
                '"' +
                etiqueta +
                '"' +
                ':{">=":"' +
                new Date(fecha[0]).toISOString() +
                '"}, "' +
                etiqueta +
                '":{"<=":"' +
                new Date(fecha[1]).toISOString() +
                '"}'
            }
          } else {
            return {
              categoria: 'or',
              valor:
                '{"' +
                etiqueta +
                '"' +
                ':{">":"' +
                new Date(fecha[0]).toISOString() +
                '","<":"' +
                new Date(fecha[1]).toISOString() +
                '"}}'
            }
          }
        } else if (modificadores[indice].length > 0) {
          if (modificadores[indice] === '=') {
            return {
              categoria: 'equal',
              valor: '"' + etiqueta + '":"' + new Date(fecha[0]).toISOString() + '"'
            }
          } else {
            return {
              categoria: 'or',
              valor:
                '{"' +
                etiqueta +
                '"' +
                ':{"' +
                modificadores[indice] +
                '":"' +
                new Date(fecha[0]).toISOString() +
                '"}}'
            }
          }
        } else {
          return {
            categoria: 'or',
            valor: '{"' + etiqueta + '"' + ':"' + new Date(fecha[0]).toISOString() + '"}'
          }
        }
      }

      // cuando se requiere que el campo sea igual, independiente de que sea
      // numero string
      if (modificadores[indice] === '=') {
        return {
          categoria: 'equal',
          valor: '"' + etiqueta + '":"' + descripcion[indice] + '"'
        }
      }

      // excluye valores NaN cuando no son numeros
      if (isFinite(parseFloat(descripcion[indice])) && modificadores[indice].length > 0) {
        return {
          categoria: 'or',
          valor:
            '{"' +
            etiqueta +
            '"' +
            ':{"' +
            modificadores[indice] +
            '":' +
            descripcion[indice] +
            '}}'
        }
      } else if (isFinite(parseFloat(descripcion[indice]))) {
        return {
          categoria: 'or',
          valor: '{"' + etiqueta + '"' + ':' + descripcion[indice] + '}'
        }
      }
      return {
        categoria: 'or',
        valor: '{"' + etiqueta + '"' + ':{"contains":"' + descripcion[indice] + '"}}'
      }
    })

    const categoriaEqual = etiquetasConCategoria
      .filter(etiqueta => etiqueta.categoria === 'equal')
      .map(etiqueta => etiqueta.valor)
    const categoriaOr = etiquetasConCategoria
      .filter(etiqueta => etiqueta.categoria === 'or')
      .map(etiqueta => etiqueta.valor)

    let query = `where={"or":[]}`
    if (categoriaEqual.length > 0 && categoriaOr.length > 0) {
      query = `where={${categoriaEqual},"or":[${categoriaOr}]}`
    } else if (categoriaEqual.length > 0 && categoriaOr.length === 0) {
      query = `where={${categoriaEqual}}`
    } else if (categoriaOr.length > 0 && categoriaEqual.length === 0) {
      query = `where={"or":[${categoriaOr}]}`
    } else {
      query = ''
    }
    return query
  }

  /**
   * Genera el query de busqueda a partir de un string
   *
   * @param {string} query
   * @returns {Query}
   * @memberof Query
   */
  public addQuery(query: string): Query {
    let etiquetas = this.parseQueryEtiquetas(query)
    let descripcion = this.parseQueryDescripcion(query)
    let modificadores = this.parseQueryModificador(query)

    if (etiquetas.length === descripcion.length && descripcion.length === modificadores.length) {
      this._etiquetas = this._etiquetas.concat(etiquetas)
      this._descripcion = this._descripcion.concat(descripcion)
      this._modificadores = this._modificadores.concat(modificadores)

      this._query = this.construccionQuery(this._etiquetas, this._descripcion, this._modificadores)
      return this
    } else {
      this._query = ''
      return this
    }
  }
}
