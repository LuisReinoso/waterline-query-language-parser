# Waterline Query Language Parse

Esta librería te permite realizar una búsqueda compleja utilizando etiquetas.

El query de busqueda tiene la siguiente forma
```
etiqueta1: descripcion 1 etiqueta2: descripcion 2
```

Instalación
```bash
npm install waterline-query-language-parser
```

Uso
```javascript
import Query from "waterline-query-language-parse"
parser = new Query('etiquetas: papel descripcion: papel blando');

parser.etiquetas // ['etiquetas', 'descripcion']
parser.descripcion // ['papel', 'papel blando']

parser.query // where={"or":[{"etiquetas":{"contains":"papel"}},{"descripcion":{"contains":"papel blando"}}]}
```

