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

  it('Deberia devolver arreglo con etiqueta deep', () => {
    query = new Query('etiquetas.grandes: Papel')
    expect(query.etiquetas).toEqual(['etiquetas.grandes'])
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

  it('Deberia devolver arreglo con etiqueta deep y descripcion', () => {
    query = new Query('etiquetas.grande: papel descripcion: papel blando')
    expect(query.etiquetas).toEqual(['etiquetas.grande', 'descripcion'])
  })
})

describe('Prueba para obtener las descripcion de etiquetas a partir de un query', () => {
  it('Deberia devolver arreglo con etiqueta y descripcion', () => {
    query = new Query('etiquetas: papel descripcion: papel blando')
    expect(query.descripcion).toEqual(['papel', 'papel blando'])
  })
  it('Deberia devolver arreglo con etiqueta deep y descripcion', () => {
    query = new Query('etiquetas.grande: papel descripcion: papel blando')
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

  it('Deberia devolver query de busqueda con numeros sin comillas simples', () => {
    query = new Query('etiquetas: 5 descripcion: papel blando')
    expect(query.query).toEqual(
      'where={"or":[{"etiquetas":5},{"descripcion":{"contains":"papel blando"}}]}'
    )
  })

  it('Deberia devolver query de busqueda con numeros con el modificador mayor igual sin comillas simples', () => {
    query = new Query('etiquetas:>= 5 descripcion: papel blando')
    expect(query.query).toEqual(
      'where={"or":[{"etiquetas":{">=":5}},{"descripcion":{"contains":"papel blando"}}]}'
    )
  })

  it('Deberia devolver query de busqueda con fecha sin modificador, sin comillas simples', () => {
    query = new Query('fechaInicio:2012/12/15')
    expect(query.query).toEqual(
      'where={"or":[{"fechaInicio":"2012-12-15T05:00:00.000Z"}]}'
    )
  })

  it('Deberia devolver query de busqueda con fecha con el modificador mayor igual', () => {
    query = new Query('fechaInicio:> 2018/06/05')
    expect(query.query).toEqual(
      'where={"or":[{"fechaInicio":{">":"2018-06-05T05:00:00.000Z"}}]}'
    )
  })

  it('Deberia devolver query de busqueda con fechas con el modificador mayor y menor', () => {
    query = new Query('fechaInicio: 2018/06/05-2018/12/15')
    expect(query.query).toEqual(
      'where={"or":[{"fechaInicio":{">":"2018-06-05T05:00:00.000Z","<":"2018-12-15T05:00:00.000Z"}}]}'
    )
  })
})

describe('Prueba para obtener query a partir de un query de entrada deep', () => {
  it('Deberia devolver query de busqueda', () => {
    query = new Query('etiquetas.grande: papel descripcion: papel blando')
    expect(query.query).toEqual(
      'where={"or":[{"etiquetas.grande":{"contains":"papel"}},{"descripcion":{"contains":"papel blando"}}]}'
    )
  })

  it('Deberia devolver query de busqueda con numeros sin comillas simples', () => {
    query = new Query('etiquetas.grande: 5 descripcion: papel blando')
    expect(query.query).toEqual(
      'where={"or":[{"etiquetas.grande":5},{"descripcion":{"contains":"papel blando"}}]}'
    )
  })

  it('Deberia devolver query de busqueda con numeros con el modificador mayor igual sin comillas simples', () => {
    query = new Query('etiquetas.grande:>= 5 descripcion: papel blando')
    expect(query.query).toEqual(
      'where={"or":[{"etiquetas.grande":{">=":5}},{"descripcion":{"contains":"papel blando"}}]}'
    )
  })

  it('Deberia devolver query de busqueda con fecha sin modificador, sin comillas simples', () => {
    query = new Query('fechaInicio.grande:2012/12/15')
    expect(query.query).toEqual(
      'where={"or":[{"fechaInicio.grande":"2012-12-15T05:00:00.000Z"}]}'
    )
  })

  it('Deberia devolver query de busqueda con fecha con el modificador mayor igual', () => {
    query = new Query('fechaInicio.grande:> 2018/06/05')
    expect(query.query).toEqual(
      'where={"or":[{"fechaInicio.grande":{">":"2018-06-05T05:00:00.000Z"}}]}'
    )
  })

  it('Deberia devolver query de busqueda con fechas con el modificador mayor y menor', () => {
    query = new Query('fechaInicio.grande: 2018/06/05-2018/12/15')
    expect(query.query).toEqual(
      'where={"or":[{"fechaInicio.grande":{">":"2018-06-05T05:00:00.000Z","<":"2018-12-15T05:00:00.000Z"}}]}'
    )
  })
})
