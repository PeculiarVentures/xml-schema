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
