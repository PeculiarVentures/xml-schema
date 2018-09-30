/// <reference path="./types.d.ts" />

import { XmlNodeTypes } from "./node_types";

export function isConvertible(target: any): target is IXmlConvertible {
  return !!(target && target.toXML && target.fromXML);
}

export class XmlDOM {
  public static getParser() {
    if (!this.cache.parser) {
      this.cache.parser = (typeof DOMParser === "undefined") ?
        require(this.XMLDOM_MODULE).DOMParser
        : DOMParser;
    }
    return this.cache.parser;
  }

  public static getSerializer() {
    if (!this.cache.serializer) {
      this.cache.serializer = (typeof XMLSerializer === "undefined") ?
        require(this.XMLDOM_MODULE).XMLSerializer
        : DOMParser;
    }
    return this.cache.serializer;
  }

  private static XMLDOM_MODULE = "xmldom";
  private static cache = {} as { parser: typeof DOMParser, serializer: typeof XMLSerializer };
}

export function isDocument(target: any): target is Document {
  return target && target.nodeType === XmlNodeTypes.Document;
}

export function isElement(target: any): target is Element {
  return target && target.nodeType === XmlNodeTypes.Element;
}
