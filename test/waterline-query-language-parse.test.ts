import Query from '../src/waterline-query-language-parse'

let query: any

beforeAll(() => {
  // query = new Query('etiquetas: papel descripcion: papel blando')
})

describe('Prueba para obtener las etiquetas a partir de un query simple', () => {
  it('Deberia devolver arreglo con etiqueta', () => {
    query = new Query('etiquetas: Papel')
    expect(query.etiquetas).toEqual(['etiquetas'])
  })
})

describe('Prueba para obtener las etiquetas a partir de un query simple', () => {
  it('Deberia devolver arreglo con descripcion', () => {
    query = new Query('etiquetas: Papel')
    expect(query.descripcion).toEqual(['Papel'])
  })
})

describe('Prueba para obtener las etiquetas a partir de un query', () => {
  it('Deberia devolver arreglo con etiqueta y descripcion', () => {
    query = new Query('etiquetas: papel descripcion: papel blando')
    expect(query.etiquetas).toEqual(['etiquetas', 'descripcion'])
  })
})

describe('Prueba para obtener las descripcion de etiquetas a partir de un query', () => {
  it('Deberia devolver arreglo con etiqueta y descripcion', () => {
    query = new Query('etiquetas: papel descripcion: papel blando')
    expect(query.descripcion).toEqual(['papel', 'papel blando'])
  })
})

describe('Prueba para obtener query a partir de un query de entrada', () => {
  it('Deberia devolver query de busqueda', () => {
    query = new Query('etiquetas: papel descripcion: papel blando')
    expect(query.query).toEqual(
      'where={"or":[{"etiquetas":{"contains":"papel"}},{"descripcion":{"contains":"papel blando"}}]}'
    )
  })
})
