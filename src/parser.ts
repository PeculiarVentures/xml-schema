/// <reference path="./types.d.ts" />

import { isConvertible, isDocument, isElement, XmlDOM } from "./helper";
import { schemaStorage } from "./storage";

export class XmlParser {
  public static parse<T>(data: string, schema: IEmptyConstructor<T>): T {
    const Parser = XmlDOM.getParser();
    const document = new Parser().parseFromString(data, "application/xml");
    if (!document) {
      throw new Error("Cannot parse incoming data");
    }
    return this.fromXML(document, schema);
  }

  public static fromXML<T>(target: XmlParseType, targetSchema: IEmptyConstructor<T>): T {
    //#region Check target
    let element: Element | null = null;
    if (isDocument(target)) {
      element = target.documentElement;
    } else if (isElement(target)) {
      element = target;
    }
    if (!element) {
      throw new TypeError(`Argument 'target' must be Document or Element`);
    }
    //#endregion

    const obj = new targetSchema() as any;

    if (isConvertible(obj)) {
      return obj.fromXML(element) as any;
    }

    const schema = schemaStorage.get(targetSchema);

    //#region Get elements
    for (const key in schema.items) {
      const schemaItems = schema.items[key];
      for (const schemaItem of schemaItems) {
        const name = schemaItem.name || key;

        // Get value
        const values: any[] = [];
        const elementName = schemaItem.name || key;
        const children = schemaItem.namespace ?
          element.getElementsByTagNameNS(schemaItem.namespace, elementName)
          : element.getElementsByTagName(elementName);

        if (!schemaItem.repeated && children.length > 1) {
          throw new Error(`<${element.nodeName}> must have only one <${name}> element`);
        }

        for (let i = 0; i < children.length; i++) {
          const child = children.item(i);
          if (!child) {
            continue;
          }
          if (!schemaItem.type) {
            // Use text content
            if (schemaItem.converter) {
              values.push(schemaItem.converter.fromXML(child.textContent, obj));
            } else {
              values.push(child.textContent);
            }
          } else {
            // Use Element
            if (!schemaItem.type) {
              throw new Error(`Schema '${targetSchema.name}' doesn't have type value for '${key} element'`);
            }
            values.push(this.fromXML(child, schemaItem.type));
          }
        }

        if (schemaItem.repeated) {
          obj[key] = obj[key] ? obj[key].concat(values) : values;
        } else {
          const value = values[0];
          if (value === undefined && (schemaItem.optional || schemaItem.defaultValue !== undefined)) {
            // OPTIONAL
            continue;
          }
          if (!schemaItem.optional && value === undefined) {
            throw new Error(`Required element '${elementName}' in <${element.nodeName}> is missed`);
          }

          obj[key] = value;
        }
      }
    }
    //#endregion

    //#region Get attributes
    for (const key in schema.attrs) {
      const schemaAttr = schema.attrs[key];

      const value = (schemaAttr.namespace ?
        element.getAttributeNS(schemaAttr.namespace, schemaAttr.name)
        : element.getAttribute(schemaAttr.name)) || "";

      if (!value && !schemaAttr.optional && !schemaAttr.defaultValue) {
        // REQUIRED
        throw new Error(`Required attribute '${schemaAttr.name}' in <${element.nodeName}> is empty`);
      }

      if (schemaAttr.converter) {
        obj[key] = schemaAttr.converter.fromXML(value, obj);
      } else {
        obj[key] = value;
      }
    }
    //#endregion

    //#region Get value from content
    if (schema.content) {
      const contentSchema = schema.content;
      if (contentSchema.converter) {
        obj[contentSchema.name] = contentSchema.converter.fromXML(element.textContent, obj);
      } else {
        obj[contentSchema.name] = element.textContent;
      }
    }
    //#endregion

    return obj;
  }
}
