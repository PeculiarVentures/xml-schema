# XML-SCHEMA

This package uses ES2015 [decorators](https://medium.com/google-developers/exploring-es7-decorators-76ecb65fb841) to simplify XML [schema creation and use](https://www.w3.org/standards/xml/schema). 


## Introduction

XML (Extensible Markup Language) Extensible Markup Language (XML) is used to describe data, using a schema can help with [some of the more common problems](https://www.owasp.org/images/5/58/XML_Based_Attacks_-_OWASP.pdf) associated with working with untrusted XML data.

While the use of schemas can help with this problem their  use can be complicated. When using `XML-SCHEMA` this is addressed by using decorators to make both serialization and parsing of XML possible via a simple class that handles Schemas for you. 

This is important because validating input data before its use is important to do because all input data is evil. Using a schema helps you handle this data [safely](https://www.owasp.org/index.php/XML_Security_Cheat_Sheet). 


## Installation

Installation is handled via  `npm`:

```
$ npm install @pv/xml-schema
```

## Examples
Node.js:

```js
```

## API

Use [index.d.ts](index.d.ts) file
