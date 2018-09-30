import * as assert from "assert";
import { XmlAttribute } from "../src";
import { XmlType } from "../src/decorators";
import { schemaStorage } from "../src/storage";

context("Schema", () => {
  it("error on get", () => {
    assert.throws(() => {
      schemaStorage.get({});
    });
  });
  it("extending", () => {
    class Parent {
      @XmlAttribute()
      public id = "";
    }
    @XmlType({name: "child"})
    class Child extends Parent {
      @XmlAttribute()
      public value = "";
    }

    const parentSchema = schemaStorage.get(Parent);
    assert.equal(Object.keys(parentSchema.attrs).length, 1);
    assert.equal(parentSchema.name, "Parent");
    const childSchema = schemaStorage.get(Child);
    assert.equal(Object.keys(childSchema.attrs).length, 2);
    assert.equal(childSchema.name, "child");
  });
});
