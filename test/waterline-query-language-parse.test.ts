import Query from '../src/waterline-query-language-parse'

let query: any

beforeAll(() => {
  query = new Query('etiquetas: papel descripcion: papel blando')
})

describe('Prueba para obtener las etiquetas a partir de un query', () => {
  it('Deberia devolver arreglo con etiqueta y descripcion', () => {
    expect(query.etiquetas).toEqual(['etiquetas', 'descripcion'])
  })
})

describe('Prueba para obtener las descripcion de etiquetas a partir de un query', () => {
  it('Deberia devolver arreglo con etiqueta y descripcion', () => {
    expect(query.descripcion).toEqual(['papel', 'papel blando'])
  })
})

describe('Prueba para obtener query a partir de un query de entrada', () => {
  it('Deberia devolver query de busqueda', () => {
    expect(query.query).toEqual(
      'where={"or":[{"etiquetas":{"contains":"papel"}},{"descripcion":{"contains":"papel blando"}}]}'
    )
  })
})
