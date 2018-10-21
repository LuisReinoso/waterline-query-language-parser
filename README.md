# Waterline Query Language Parser

## Contenido

- [Español](#spanish)
- [English](#english)

<a id="spanish"></a>
Dado que [sailsjs](sailsjs.com) provee un [blueprint-api](https://sailsjs.com/documentation/reference/blueprint-api). Esta librería aprovecha la ruta [find](https://sailsjs.com/documentation/reference/blueprint-api/find-where) de tal forma genera el `querystring where` y asi realizar una búsqueda compleja utilizando etiquetas.

El query de busqueda tiene la siguiente forma
```
etiqueta1: descripcion 1 etiqueta2: descripcion 2
```

### Instalación
```bash
npm install waterline-query-language-parser --save
```

### Uso
```javascript
import Query from "waterline-query-language-parse"
parser = new Query('etiquetas: papel descripcion: papel blando');

parser.etiquetas // ['etiquetas', 'descripcion']
parser.descripcion // ['papel', 'papel blando']

parser.query // where={"or":[{"etiquetas":{"contains":"papel"}},{"descripcion":{"contains":"papel blando"}}]}
```

### Builder pattern
Ahora puedes añadir mas etiquetas y descripción al query original

```javascript
import Query from "waterline-query-language-parse"

parser = new Query('etiquetas: papel');

parser.etiquetas // ['etiquetas']
parser.descripcion // ['papel']

parse.addQuery('descripcion: papel blando');

parser.etiquetas // ['etiquetas', 'descripcion']
parser.descripcion // ['papel', 'papel blando']

parser.query // where={"or":[{"etiquetas":{"contains":"papel"}},{"descripcion":{"contains":"papel blando"}}]}
```

### Modificadores

Tú puedes crear un query de búsqueda con los siguientes modificadores: mayor, menor, mayor que, menor que
```
  etiqueta:> descripcion  // mayor que
  etiqueta:>= descripcion  // mayor igual
  etiqueta:< descripcion  // menor que
  etiqueta:<= descripcion  // menor igual
```

Si quieres que sea igual no debes utilizar ningun modificador.

```javascript
import Query from "waterline-query-language-parse"

parser = new Query('pagos:> 100');
parse.addQuery('cuota:<= 15');

parser.etiquetas // ['pagos', 'cuota']
parser.descripcion // ['100', '15']

parser.query // where={"or":[{"etiquetas":{">":5}},{"cuota":{"<=":15}}]}
```

### Fechas
Tambíen puedes hacer búsqueda de fechas utilizando modificadores descritos anteriormente o por medio de un **rango**. De esta forma se realiza una búsqueda a partir de una fecha de inicio y fin de fecha.

Formato simple: `YYYY/MM/DD`
```javascript
import Query from "waterline-query-language-parse"

parser = new Query('fechaInicio:> 2018/06/05');

parser.etiquetas // ['fechaInicio']
parser.descripcion // ['2018/06/05']

parser.query // where={"or":[{"fechaInicio":{">":"2018-06-05T05:00:00.000Z"}}]}
```

Formato rango: `YYYY/MM/DD-YYYY/MM/DD`
```javascript
import Query from "waterline-query-language-parse"

parser = new Query('fechaInicio: 2018/06/05-2018/12/15');

parser.etiquetas // ['fechaInicio']
parser.descripcion // ['2018/06/05-2018/12/15']

parser.query // where={"or":[{"fechaInicio":{">":"2018-06-05T05:00:00.000Z","<":"2018-12-15T05:00:00.000Z"}}]}
```

## Referencias

Para saber más información sobre el query language de waterline visita [query-language](https://sailsjs.com/documentation/concepts/models-and-orm/query-language)

## Contribuciones

Ver [Guía de contribuciones](CONTRIBUTING.md)


<a id="english"></a>
Since [sailsjs](sailsjs.com) provides a [blueprint-api](https://sailsjs.com/documentation/reference/blueprint-api). This library uses the path [find](https://sailsjs.com/documentation/reference/blueprint-api/find-where) to generate the `querystring where` and thus perform a complex search using tags.

The search query has the following form

```
tag1: description 1 tag2: description 2
```

### Installation
```bash
npm install waterline-query-language-parser --save
```

### Use
```javascript
import Query from "waterline-query-language-parse"
parser = new Query('etiquetas: papel descripcion: papel blando');

parser.etiquetas // ['etiquetas', 'descripcion']
parser.descripcion // ['papel', 'papel blando']

parser.query // where={"or":[{"etiquetas":{"contains":"papel"}},{"descripcion":{"contains":"papel blando"}}]}
```

### Builder pattern
Now you can add more tags and description to the original query

```javascript
import Query from "waterline-query-language-parse"

parser = new Query('etiquetas: papel');

parser.etiquetas // ['etiquetas']
parser.descripcion // ['papel']

parse.addQuery('descripcion: papel blando');

parser.etiquetas // ['etiquetas', 'descripcion']
parser.descripcion // ['papel', 'papel blando']

parser.query // where={"or":[{"etiquetas":{"contains":"papel"}},{"descripcion":{"contains":"papel blando"}}]}
```

### Modifiers

You can create a search query with the following modifiers: major, minor, greater than, less than

```
  etiqueta:> descripcion  // greater than
  etiqueta:>= descripcion  // greater than or equal to
  etiqueta:< descripcion  // less than
  etiqueta:<= descripcion  // less than or equal to 
```

If you want it to be the same you should not use any modifier.

```javascript
import Query from "waterline-query-language-parse"

parser = new Query('pagos:> 100');
parse.addQuery('cuota:<= 15');

parser.etiquetas // ['pagos', 'cuota']
parser.descripcion // ['100', '15']

parser.query // where={"or":[{"etiquetas":{">":5}},{"cuota":{"<=":15}}]}
```

### Dates
You can also search for dates using modifiers described above or by means of a ** range **. In this way, a search is carried out starting from a start date and ending date.

Simple format: `YYYY/MM/DD`
```javascript
import Query from "waterline-query-language-parse"

parser = new Query('fechaInicio:> 2018/06/05');

parser.etiquetas // ['fechaInicio']
parser.descripcion // ['2018/06/05']

parser.query // where={"or":[{"fechaInicio":{">":"2018-06-05T05:00:00.000Z"}}]}
```

Format range: `YYYY/MM/DD-YYYY/MN/DD`
```javascript
import Query from "waterline-query-language-parse"

parser = new Query('fechaInicio: 2018/06/05-2018/12/15');

parser.etiquetas // ['fechaInicio']
parser.descripcion // ['2018/06/05-2018/12/15']

parser.query // where={"or":[{"fechaInicio":{">":"2018-06-05T05:00:00.000Z","<":"2018-12-15T05:00:00.000Z"}}]}
```

## References

To know more information about the query language of waterline visit [query-language] (https://sailsjs.com/documentation/concepts/models-and-orm/query-language).

## Contributions

See [Contributions Guide] (CONTRIBUTING.md)
