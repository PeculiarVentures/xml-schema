# XML-SCHEMA

[![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat)](https://raw.githubusercontent.com/PeculiarVentures/xml-schema/master/LICENSE.md)
[![CircleCI](https://circleci.com/gh/PeculiarVentures/xml-schema.svg?style=svg)](https://circleci.com/gh/PeculiarVentures/xml-schema)
[![Coverage Status](https://coveralls.io/repos/github/PeculiarVentures/xml-schema/badge.svg?branch=master)](https://coveralls.io/github/PeculiarVentures/xml-schema?branch=master)
[![npm version](https://badge.fury.io/js/@pv/xml-schema.svg)](https://badge.fury.io/js/@pv/xml-schema)

[![NPM](https://nodei.co/npm/@pv/xml-schema.png)](https://nodei.co/npm/@pv/xml-schema/)

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
