import { IXmlSchema, IXmlSchemaAttribute, IXmlSchemaContent, IXmlSchemaItem } from "./schema";
import { schemaStorage } from "./storage";

export type IXmlAttributeOptions = Partial<IXmlSchemaAttribute>;
export type IXmlElementOptions = Partial<IXmlSchemaItem>;

export interface IXmlTypeOptions {
  name?: string;
  prefix?: string;
  namespace?: string;
}

export interface IXmlContentOptions {
  converter?: IXmlConverter<any, any>;
}

function getSchema(target: any) {
  let schema: IXmlSchema;
  if (!schemaStorage.has(target)) {
    schema = schemaStorage.create(target);
    schemaStorage.set(target, schema);
  } else {
    schema = schemaStorage.get(target);
  }
  return schema;
}

export const XmlType = (options?: IXmlTypeOptions) => (target: object) => {
  const schema = getSchema(target);
  Object.assign(schema, options);
};

export const XmlAttribute = (options: IXmlAttributeOptions = {}) => (target: object, propertyKey: string) => {
  const name = target.constructor.name;
  const schema = getSchema(target.constructor);

  const copyOptions = Object.assign({
    name: propertyKey,
  }, options); // set default values

  schema.attrs[propertyKey] = copyOptions;
};

export const XmlElement = (options: IXmlElementOptions = {}) => (target: object, propertyKey: string) => {
  const targetName = target.constructor.name;
  const errorMessage = `Cannot set XmlElement attribute for '${propertyKey}' property of ${targetName} schema`;
  const schema = getSchema(target.constructor);

  const copyOptions = Object.assign({
    name: propertyKey,
  }, options); // set default values

  // if (!schemaStorage.has(copyOptions.type) && !isConvertible(copyOptions.type)) {
  //   throw new Error(`${errorMessage}. Assigning type doesn't have schema.`);
  // }
  if (copyOptions.type) {
    const typeSchema = schemaStorage.get(copyOptions.type);
    copyOptions.name = options.name || typeSchema.name;
    copyOptions.namespace = typeSchema.namespace;
    copyOptions.prefix = options.prefix || typeSchema.prefix;
  }

  if (!schema.items[propertyKey]) {
    schema.items[propertyKey] = [];
  }
  const schemaItems = schema.items[propertyKey];
  if (schemaItems.length && !(copyOptions.type && schemaItems[0].type)) {
    // tslint:disable-next-line:max-line-length
    throw new Error(`${errorMessage}. Choice can't keep convertible element`);
  }

  schema.items[propertyKey].push(copyOptions);
};

export const XmlContent = (options: IXmlContentOptions = {}) => (target: object, propertyKey: string) => {
  const schemaName = target.constructor.name;
  const errorMessage = `Cannot set Content for ${propertyKey} property of ${schemaName} schema.`;
  const schema = getSchema(target.constructor);

  if (schema.content) {
    throw new Error(`${errorMessage} Current schema already has Content`);
  }

  const copyOptions = Object.assign({ name: propertyKey }, options);

  schema.content = copyOptions;
};
