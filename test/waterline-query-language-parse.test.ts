import Query from '../src/waterline-query-language-parse'

let query: Query

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
    expect(query.query).toEqual('where={"or":[{"fechaInicio":"2012-12-15T05:00:00.000Z"}]}')
  })

  it('Deberia devolver query de busqueda con fecha con el modificador mayor igual', () => {
    query = new Query('fechaInicio:> 2018/06/05')
    expect(query.query).toEqual('where={"or":[{"fechaInicio":{">":"2018-06-05T05:00:00.000Z"}}]}')
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
    expect(query.query).toEqual('where={"or":[{"fechaInicio.grande":"2012-12-15T05:00:00.000Z"}]}')
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

describe('Prueba de builder pattern', () => {
  it('Deberia devolver el objeto de la clase Query', () => {
    query = new Query('etiquetas: papel')
    expect(query.addQuery('nombre: Luis')).toBeInstanceOf(Query)
  })

  it('Deberia devolver dos etiquetas', () => {
    query = new Query('etiquetas: papel')
    query.addQuery('descripcion: papel blando')
    expect(query.etiquetas.length).toBe(2)
  })

  it('Deberia devolver dos descripciones', () => {
    query = new Query('etiquetas: papel')
    query.addQuery('descripcion: papel blando')
    expect(query.descripcion.length).toBe(2)
  })

  it('Deberia devolver el query de busqueda', () => {
    query = new Query('etiquetas: papel')
    query.addQuery('descripcion: papel blando')
    expect(query.query).toEqual(
      'where={"or":[{"etiquetas":{"contains":"papel"}},{"descripcion":{"contains":"papel blando"}}]}'
    )
  })
})

describe('Prubas para construir el query con modificador igual', () => {
  it('Deberia devoler el query con el parametro igual', () => {
    query = new Query('nombre:= luis')
    expect(query.query).toEqual('where={"nombre":"luis"}')
  })

  it('Deberia devoler el query con dos parametros igual', () => {
    query = new Query('nombre:= luis')
    query.addQuery('apellido:= perez')
    expect(query.query).toEqual('where={"nombre":"luis","apellido":"perez"}')
  })

  it('Deberia devoler el query con dos parametros igual y or', () => {
    query = new Query('nombre:= luis')
    query.addQuery('apellido:= perez')
    query.addQuery('ciudad: UIO')
    expect(query.query).toEqual(
      'where={"nombre":"luis","apellido":"perez","or":[{"ciudad":{"contains":"UIO"}}]}'
    )
  })

  it('Deberia retornar un query vacio cuando el input sea una fecha igual', () => {
    query = new Query('fecha:= 2018/12/01')
    expect(query.query).toEqual('where={"fecha":"2018-12-01T05:00:00.000Z"}')
  })

  it('Deberia retornar un query cuando el input sea a un rango de fecha', () => {
    query = new Query('fecha:= 2018/10/01-2018/12/15')
    expect(query.query).toEqual(
      'where={"fecha":{">=":"2018-10-01T05:00:00.000Z"}, "fecha":{"<=":"2018-12-15T05:00:00.000Z"}}'
    )
  })
})

describe('Pruebas para modificador in', () => {
  it('Deberia retornar un query con el modificador in', () => {
    query = new Query('nombre:# casa&sadasd')
    expect(query.query).toEqual('where={"nombre":{"in":["casa","sadasd"]}}')
  })

  it('Deberia retornar un query con el modificador in con el modificador or', () => {
    query = new Query('nombre:# casa&sadasd apellido:pedernales')
    expect(query.query).toEqual(
      'where={"or":[{"apellido":{"contains":"pedernales"}}],"nombre":{"in":["casa","sadasd"]}}'
    )
  })
})

describe('Pruebas para posibles errores de input', () => {
  it('Deberia retornar un query vacio cuando el input es vacio', () => {
    query = new Query('')
    expect(query.query).toEqual('')
  })

  it('Deberia retornar un query vacio cuando el input no tiene la estructora etiqueta:descripcion', () => {
    query = new Query('sadasd')
    expect(query.query).toEqual('')
  })
})

describe('Prueba para obtener el query generador query simple', () => {
  it('Deberia query inicial', () => {
    query = new Query('etiquetas: Papel')
    expect(query.queryGenerador).toEqual(' etiquetas: Papel')
  })

  it('Deberia query inicial mas el query añadido despues', () => {
    query = new Query('etiquetas: Papel')
    query.addQuery('prueba: categoria')
    expect(query.queryGenerador).toEqual(' etiquetas: Papel prueba: categoria')
  })
})
