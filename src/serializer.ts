import { isConvertible, XmlDOM } from "./helper";
import { schemaStorage } from "./storage";

export class XmlSerializer {
  public static serialize(obj: any, options: IXmlSerializerOptions = {}): string {
    const xml = this.toXML(obj, options);
    const Serializer = XmlDOM.getSerializer();
    return new Serializer().serializeToString(xml);
  }
  public static toXML(obj: any, options: IXmlSerializerOptions = {}): Element {
    if (isConvertible(obj)) {
      return obj.toXML();
    }

    const schema = schemaStorage.get(obj.constructor);
    const schemaName = obj.constructor.name;
    const namespaces = options.namespaces || {};
    let prefix = "";
    for (const p in namespaces) {
        if (schema.namespace === namespaces[p]) {
          prefix = p;
          break;
        }
    }
    const element = schema.namespace ?
      this.createElement(options.name || schema.name, schema.namespace, prefix || options.prefix || schema.prefix)
      : this.createElement(schema.name);

    if (Array.isArray(obj)) {
      throw new Error("Not implemented");
    } else if (typeof obj === "object") {

      //#region attributes
      for (const key in schema.attrs) {
        const schemaAttr = schema.attrs[key];

        if (obj[key] === undefined && !schemaAttr.optional) {
          // REQUIRED
          throw new Error(`Required attribute '${schemaAttr.name}' from schema '${schemaName}' is empty`);
        }

        if ((obj[key] === undefined && schemaAttr.optional)
          || (obj[key] === schemaAttr.defaultValue)) {
          continue;
        }

        const setAttribute = schemaAttr.namespace ?
          element.setAttributeNS.bind(element, schemaAttr.namespace)
          : element.setAttribute.bind(element);
        const attrName = schemaAttr.prefix ? `${schemaAttr.prefix}:${schemaAttr.name}` : schemaAttr.name;
        if (schemaAttr.converter) {
          setAttribute(attrName, schemaAttr.converter.toXML(obj[key], obj));
        } else {
          setAttribute(attrName, obj[key]);
        }
      }
      //#endregion

      //#region elements
      for (const key in schema.items) {
        const schemaItems = schema.items[key];
        for (const schemaItem of schemaItems) {
          const objValue = obj[key];

          if (objValue === undefined && !schemaItem.optional) {
            // REQUIRED
            throw new Error(`Required element '${schemaItem.name}' from schema '${schemaName}' is empty`);
          }

          if ((objValue === undefined && schemaItem.optional)
            || (objValue === schemaItem.defaultValue)) {
            continue;
          }

          if (!schemaItem.type) {
            // Simple element, use textContent only
            const items = !schemaItem.repeated ? [objValue] : objValue;

            for (const item of items) {
              const name = schemaItem.name || key;
              const contentElement = schemaItem.namespace ?
                this.createElement(name, schemaItem.namespace, schemaItem.prefix)
                : this.createElement(name);
              if (schemaItem.converter) {
                contentElement.textContent = schemaItem.converter.toXML(item, obj);
              } else {
                contentElement.textContent = item;
              }

              element.appendChild(contentElement);
            }
          } else {
            // constructed
            const items = !schemaItem.repeated ? [objValue] : objValue;
            for (const item of items) {
              const childElement = this.toXML(item, options);
              element.appendChild(childElement);
            }
          }
          break;
        }
      }
      //#endregion

      //#region Content
      if (schema.content) {
        const schemaContent = schema.content;
        if (schemaContent.converter) {
          element.textContent = schemaContent.converter.toXML(obj[schemaContent.name], obj);
        } else {
          element.textContent = `${obj[schemaContent.name]}`;
        }
      }
      //#endregion
    }

    return element;
  }

  public static createElement(name: string): Element;
  // tslint:disable-next-line:unified-signatures
  public static createElement(name: string, namespaceUri: string, prefix?: string): Element;
  public static createElement(name: string, namespaceUri: string | null = null, prefix: string | null = null): Element {
    if (!name) {
      throw new TypeError("Cannot create Element. Argument 'name' cannot be empty string.");
    }
    const xmlName = prefix ? `${prefix}:${name}` : name;
    const DOMParser = XmlDOM.getParser();
    // const document = new DOMParser().parseFromString(`<${xmlName} ${xmlns}/>`, "application/xml");
    const document = new DOMParser().parseFromString(`<root/>`, "application/xml");
    if (!namespaceUri) {
      return document.createElement(xmlName);
    } else {
      return document.createElementNS(namespaceUri, xmlName);
    }
    // return document.documentElement;
  }

}
