/// <reference path="./types.d.ts" />

export interface IXmlSchemaAttribute {
  optional?: boolean;
  defaultValue?: any;
  converter?: IXmlAttributeConverter;
  name: string;
  prefix?: string;
  namespace?: string;
}

export interface IXmlSchemaItem {
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

export interface IXmlSchema {
  items: { [key: string]: IXmlSchemaItem[] };
  attrs: { [key: string]: IXmlSchemaAttribute };
  name: string;
  prefix?: string;
  namespace?: string;
  content?: IXmlSchemaContent;
}
export interface IXmlSchemaContent {
  /**
   * Class property name
   */
  name: string;
  converter?: IXmlContentConverter;
}

export class XmlSchemaStorage {
  protected items = new Map<object, IXmlSchema>();

  public has(target: any) {
    return this.items.has(target);
  }

  public get(target: object) {
    const schema = this.items.get(target);
    if (!schema) {
      throw new Error("Cannot get schema for current target");
    }
    return schema;
  }

  public create(target: any) {
    // Initialize default schema
    const schema = {
      name: target.name,
      items: {},
      attrs: {},
    } as IXmlSchema;

    // Get and assign schema from parent
    const parentSchema = this.findParentSchema(target);
    if (parentSchema) {
      Object.assign(schema, parentSchema);
      schema.items = Object.assign({}, schema.items, parentSchema.items);
      schema.attrs = Object.assign({}, schema.attrs, parentSchema.attrs);
      schema.content = Object.assign({}, schema.content, parentSchema.content);
    }

    return schema;
  }

  public set(target: object, schema: IXmlSchema) {
    this.items.set(target, schema);
    return this;
  }

  protected findParentSchema(target: object): IXmlSchema | null {
    const parent = (target as any).__proto__;
    if (parent) {
      const schema = this.items.get(parent);
      return schema || this.findParentSchema(parent);
    }
    return null;
  }

}
