/// <reference path="../types.d.ts" />

import { Convert } from "pvtsutils";
// https://www.w3.org/TR/xmlschema-2/#built-in-primitive-datatypes

export const XmlStringConverter: IXmlConverter<string, string> = {
  fromXML: (value: string) => value,
  toXML: (value: string) => value,
};

// Note: Legal values for boolean are true, false, 1 (which indicates true), and 0 (which indicates false).
export const XmlBooleanConverter: IXmlConverter<boolean, string> = {
  fromXML: (value: string) => !!value,
  toXML: (value: boolean) => value ? "true" : "false",
};

export const XmlHexBinaryConverter: IXmlConverter<ArrayBuffer, string> = {
  fromXML: (value: string) => Convert.FromHex(value),
  toXML: (value: ArrayBuffer) => Convert.ToHex(value),
};

export const XmlBase64Converter: IXmlConverter<ArrayBuffer, string> = {
  fromXML: (value: string) => Convert.FromBase64(value),
  toXML: (value: ArrayBuffer) => Convert.ToBase64(value),
};

export const XmlIntegerNumberConverter: IXmlConverter<number, string> = {
  fromXML: (value: string) => parseInt(value, 10),
  toXML: (value: number) => value.toString(),
};

export const XmlFloatNumberConverter: IXmlConverter<number, string> = {
  fromXML: (value: string) => parseFloat(value),
  toXML: (value: number) => value.toString(),
};

export const XmlDateTimeConverter: IXmlConverter<Date, string> = {
  fromXML: (value: string) => new Date(value),
  toXML: (value: Date) => value.toISOString(),
};
