declare namespace XmlSchema {

  interface IEmptyConstructor<T> {
    new(): T;
  }

  type XmlParseType = Document | Element;

  interface IXmlConverter<Type, XmlType = any> {
    fromXML(value: XmlType, target: any): Type;
    toXML(value: Type, target: any): XmlType;
  }

  type IXmlAttributeConverter<T = any> = IXmlConverter<T, string>;
  type IXmlContentConverter<T = any> = IXmlConverter<T, string | null>;
  type IXmlItemConverter<T = any> = IXmlConverter<T, string | null>;

  interface IXmlConvertible {
    fromXML(xml: Element): this;
    toXML(): Element;
  }

  interface IXmlNamespaces {
    [prefix: string]: string;
  }

  interface IXmlSerializerOptions {
    name?: string;
    prefix?: string;
    namespaces?: IXmlNamespaces;
  }

  class XmlParser {
    public static parse<T>(data: string, schema: IEmptyConstructor<T>): T;
    public static fromXML<T>(target: XmlParseType, targetSchema: IEmptyConstructor<T>): T;
  }

  class XmlSerializer {
    public static serialize(obj: any, options?: IXmlSerializerOptions): string;
    public static toXML(obj: any, options?: IXmlSerializerOptions): Element;
  }

  interface IXmlElementOptions {
    /**
     * type of child element
     * - if value is empty, then child element is simple, use textContent from it
     * - if type is not empty, then use it's schema
     */
    type?: IEmptyConstructor<any>;
    optional?: boolean;
    defaultValue?: any;
    converter?: IXmlConverter<any, any>;
    repeated?: boolean;
    name?: string;
    prefix?: string;
    namespace?: string;
  }

  interface IXmlAttributeOptions {
    optional?: boolean;
    defaultValue?: any;
    converter?: IXmlAttributeConverter;
    name?: string;
    prefix?: string;
    namespace?: string;
  }

  interface IXmlTypeOptions {
    name?: string;
    prefix?: string;
    namespace?: string;
  }

  interface IXmlContentOptions {
    converter?: IXmlConverter<any, any>;
  }

  const XmlType: (options?: IXmlTypeOptions) => ClassDecorator;
  const XmlAttribute: (options?: IXmlAttributeOptions) => PropertyDecorator;
  const XmlElement: (options?: IXmlElementOptions) => PropertyDecorator;
  const XmlContent: (options?: IXmlContentOptions) => PropertyDecorator;

  const XmlStringConverter: IXmlConverter<string, string>;
  const XmlBooleanConverter: IXmlConverter<boolean, string>;
  const XmlHexBinaryConverter: IXmlConverter<ArrayBuffer, string>;
  const XmlBase64Converter: IXmlConverter<ArrayBuffer, string>;
  const XmlIntegerNumberConverter: IXmlConverter<number, string>;
  const XmlFloatNumberConverter: IXmlConverter<number, string>;
  const XmlDateTimeConverter: IXmlConverter<Date, string>;

}

export = XmlSchema;
