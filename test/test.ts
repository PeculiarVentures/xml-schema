import * as assert from "assert";
import { XmlParser, XmlSerializer } from "../src";
import { XmlAttribute, XmlContent, XmlElement, XmlType } from "../src/decorators";

context("Test", () => {

  context("XmlSerializer", () => {
    context("createElement", () => {
      function test(name: string): void;
      function test(name: string, namespaceURI: string, prefix?: string): void;
      function test(name: string, namespaceURI: any = null, prefix: any = null) {
        const element = XmlSerializer.createElement(name, namespaceURI, prefix);
        assert.equal(element.nodeName, prefix ? `${prefix}:${name}` : name);
        assert.equal(element.namespaceURI, namespaceURI);
        assert.equal(element.prefix, prefix);
      }
      it("name", () => {
        test("root");
      });
      it("name + namespace", () => {
        test("root", "http://some.com");
      });
      it("name + prefix + namespaceURI", () => {
        test("root", "http://some.com", "p");
      });
      it("error on empty name", () => {
        assert.throws(() => test(""));
      });
    });
  });

  context("content", () => {
    it("simple", () => {
      @XmlType({ name: "root" })
      class Test {
        @XmlContent()
        public content = "";
      }

      const obj1 = new Test();
      obj1.content = "test";
      const xml = XmlSerializer.serialize(obj1);

      assert.equal(xml, `<root>test</root>`);

      const obj2 = XmlParser.parse(xml, Test);
      assert.equal(obj1.content, obj2.content);
    });
    it("converter", () => {
      const XmlContentConverter: IXmlContentConverter<number> = {
        toXML: (value: number) => "one",
        fromXML: (value: string | null) => 1,
      };
      @XmlType({ name: "root" })
      class Test {
        @XmlContent({ converter: XmlContentConverter })
        public content = 0;
      }

      const obj1 = new Test();
      obj1.content = 1;
      const xml = XmlSerializer.serialize(obj1);

      assert.equal(xml, `<root>one</root>`);

      const obj2 = XmlParser.parse(xml, Test);
      assert.equal(obj1.content, obj2.content);
    });
  });

  context("attributes", () => {
    context("error on required value", () => {
      @XmlType({ name: "root" })
      class Test {
        @XmlAttribute()
        public id?: string;
      }
      it("serialize", () => {
        assert.throws(() => {
          XmlSerializer.serialize(new Test());
        });
      });
      it("parse", () => {
        assert.throws(() => {
          XmlParser.parse(`<root/>`, Test);
        });
      });
    });
    it("optional", () => {
      @XmlType({ name: "root" })
      class Test {
        @XmlAttribute({ optional: true })
        public id?: string;
      }

      const obj1 = new Test();
      const xml = XmlSerializer.serialize(obj1);
      assert.equal(xml, `<root/>`);
      assert.doesNotThrow(() => {
        XmlParser.parse(xml, Test);
      });
    });
    it("default value", () => {
      @XmlType({ name: "root" })
      class Test {
        @XmlAttribute({ defaultValue: "1" })
        public version = "1";
      }

      const obj1 = new Test();
      const xml = XmlSerializer.serialize(obj1);
      assert.equal(xml, `<root/>`);
      assert.doesNotThrow(() => {
        XmlParser.parse(xml, Test);
      });
    });
    context("value", () => {
      it("simple", () => {
        @XmlType({ name: "root" })
        class Test {
          @XmlAttribute()
          public value = "";
        }
        const obj1 = new Test();
        obj1.value = "test";
        const xml = XmlSerializer.serialize(obj1);
        assert.equal(xml, `<root value="test"/>`);
        const obj2 = XmlParser.parse(xml, Test);
        assert.equal(obj1.value, obj2.value);
      });
      it("simple + namespace", () => {
        @XmlType({ name: "root" })
        class Test {
          @XmlAttribute({ namespace: "http://some.com", prefix: "p" })
          public value = "";
        }
        const obj1 = new Test();
        obj1.value = "test";
        const xml = XmlSerializer.serialize(obj1);
        assert.equal(xml, `<root xmlns:p="http://some.com" p:value="test"/>`);
        const obj2 = XmlParser.parse(xml, Test);
        assert.equal(obj1.value, obj2.value);
      });
      it("converter", () => {
        enum TestEnum {
          One = 1,
          Two = 2,
        }
        const XmlContentConverter: IXmlAttributeConverter<TestEnum> = {
          toXML: (value: TestEnum) => TestEnum[value],
          fromXML: (value: string) => (TestEnum as any)[value],
        };
        @XmlType({ name: "root" })
        class Test {
          @XmlAttribute({ converter: XmlContentConverter })
          public value = TestEnum.One;
        }
        const obj1 = new Test();
        obj1.value = TestEnum.Two;
        const xml = XmlSerializer.serialize(obj1);
        assert.equal(xml, `<root value="Two"/>`);
        const obj2 = XmlParser.parse(xml, Test);
        assert.equal(obj1.value, obj2.value);
      });
    });
  });

  context("simple child element", () => {
    context("error on required value", () => {
      @XmlType({ name: "root" })
      class Test {
        @XmlElement()
        public id?: string;
      }
      it("serialize", () => {
        assert.throws(() => {
          XmlSerializer.serialize(new Test());
        });
      });
      it("parse", () => {
        assert.throws(() => {
          XmlParser.parse(`<root/>`, Test);
        });
      });
    });
    it("optional", () => {
      @XmlType({ name: "root" })
      class Test {
        @XmlElement({ optional: true })
        public id?: string;
      }

      const obj1 = new Test();
      const xml = XmlSerializer.serialize(obj1);
      assert.equal(xml, `<root/>`);
      assert.doesNotThrow(() => {
        XmlParser.parse(xml, Test);
      });
    });
    it("default value", () => {
      @XmlType({ name: "root" })
      class Test {
        @XmlElement({ defaultValue: "1" })
        public version = "1";
      }

      const obj1 = new Test();
      const xml = XmlSerializer.serialize(obj1);
      assert.equal(xml, `<root/>`);
      assert.doesNotThrow(() => {
        XmlParser.parse(xml, Test);
      });
    });
    context("value", () => {
      it("simple", () => {
        @XmlType({ name: "root" })
        class Test {
          @XmlElement()
          public value = "";
        }
        const obj1 = new Test();
        obj1.value = "test";
        const xml = XmlSerializer.serialize(obj1);
        assert.equal(xml, `<root><value>test</value></root>`);
        const obj2 = XmlParser.parse(xml, Test);
        assert.equal(obj1.value, obj2.value);
      });
      it("simple + namespace", () => {
        @XmlType({ name: "root" })
        class Test {
          @XmlElement({ namespace: "http://some.com" })
          public value = "";
        }
        const obj1 = new Test();
        obj1.value = "test";
        const xml = XmlSerializer.serialize(obj1);
        assert.equal(xml, `<root><value xmlns="http://some.com">test</value></root>`);
        const obj2 = XmlParser.parse(xml, Test);
        assert.equal(obj1.value, obj2.value);
      });
      it("converter", () => {
        enum TestEnum {
          One = 1,
          Two = 2,
        }
        const XmlItemConverter: IXmlItemConverter<TestEnum> = {
          toXML: (value: TestEnum) => TestEnum[value],
          fromXML: (value: string) => (TestEnum as any)[value],
        };
        @XmlType({ name: "root" })
        class Test {
          @XmlElement({ converter: XmlItemConverter })
          public value = TestEnum.One;
        }
        const obj1 = new Test();
        obj1.value = TestEnum.Two;
        const xml = XmlSerializer.serialize(obj1);
        assert.equal(xml, `<root><value>Two</value></root>`);
        const obj2 = XmlParser.parse(xml, Test);
        assert.equal(obj1.value, obj2.value);
      });
    });
    it("repeated", () => {
      @XmlType({ name: "root" })
      class Test {
        @XmlElement({ repeated: true, name: "value" })
        public values: string[] = [];
      }
      const obj1 = new Test();
      obj1.values = ["1", "2", "3"];
      const xml = XmlSerializer.serialize(obj1);
      assert.equal(xml, `<root><value>1</value><value>2</value><value>3</value></root>`);
      const obj2 = XmlParser.parse(xml, Test);
      assert.equal(obj1.values.join("."), obj2.values.join("."));
    });
  });

  context("constructed child element", () => {
    context("error on required value", () => {
      //#region XML schema
      @XmlType({ name: "child" })
      class Child {
        @XmlAttribute()
        public id = "";
        constructor(id?: string) {
          if (id) {
            this.id = id;
          }
        }
      }
      @XmlType({ name: "root" })
      class Test {
        @XmlElement({ type: Child })
        public child?: Child;
      }
      //#endregion

      it("serialize", () => {
        assert.throws(() => {
          XmlSerializer.serialize(new Test());
        });
      });
      it("parse", () => {
        assert.throws(() => {
          XmlParser.parse(`<root/>`, Test);
        });
      });
    });
    it("optional", () => {
      //#region XML schema
      @XmlType({ name: "child" })
      class Child {
        @XmlAttribute()
        public id = "";
        constructor(id?: string) {
          if (id) {
            this.id = id;
          }
        }
      }
      @XmlType({ name: "root" })
      class Test {
        @XmlElement({ type: Child, optional: true })
        public child?: Child;
      }
      //#endregion

      const obj1 = new Test();
      const xml = XmlSerializer.serialize(obj1);
      assert.equal(xml, `<root/>`);
      assert.doesNotThrow(() => {
        XmlParser.parse(xml, Test);
      });
    });
    it("value", () => {
      //#region XML schema
      @XmlType({ name: "child" })
      class Child {
        @XmlAttribute()
        public id = "";
        constructor(id?: string) {
          if (id) {
            this.id = id;
          }
        }
      }
      @XmlType({ name: "root" })
      class Test {
        @XmlElement({ type: Child })
        public child = new Child();
      }
      //#endregion

      const obj1 = new Test();
      obj1.child.id = "1";
      const xml = XmlSerializer.serialize(obj1);
      assert.equal(xml, `<root><child id="1"/></root>`);
      const obj2 = XmlParser.parse(xml, Test);
      assert.equal(obj1.child.id, obj2.child.id);
    });
    context("repeated", () => {
      it("simple class", () => {
        //#region XML schema
        @XmlType({ name: "child" })
        class Child {
          @XmlAttribute()
          public id = "";
          constructor(id?: string) {
            if (id) {
              this.id = id;
            }
          }
        }
        @XmlType({ name: "root" })
        class Test {
          @XmlElement({ type: Child, repeated: true })
          public children: Child[] = [];
        }
        //#endregion
        const obj1 = new Test();
        obj1.children = [new Child("1"), new Child("2"), new Child("3")];
        const xml = XmlSerializer.serialize(obj1);
        assert.equal(xml, `<root><child id="1"/><child id="2"/><child id="3"/></root>`);
        const obj2 = XmlParser.parse(xml, Test);
        assert.equal(obj2.children.length, 3);
      });
    });
  });

  context("choice", () => {
    context("single element", () => {
      @XmlType({ name: "child1" })
      class Child1 {
        @XmlAttribute()
        public value = "test";
      }
      @XmlType({ name: "child2" })
      class Child2 {
        @XmlAttribute()
        public id = "1";
      }
      @XmlType({ name: "child3" })
      class Child3 {
        @XmlContent()
        public text = "test";
      }
      @XmlType({ name: "root" })
      class Test {
        @XmlElement({ type: Child1, optional: true })
        @XmlElement({ type: Child2, optional: true })
        @XmlElement({ type: Child3, optional: true })
        public value?: Child1 | Child2 | Child3;
      }
      it("1st element", () => {
        const obj1 = new Test();
        obj1.value = new Child1();
        const xml = XmlSerializer.serialize(obj1);

        assert.equal(xml, `<root><child1 value="test"/></root>`);

        const obj2 = XmlParser.parse(xml, Test);
        assert.equal(obj2.value instanceof Child1, true);
        assert.equal((obj2.value as Child1).value, "test");
      });
      it("2st element", () => {
        const obj1 = new Test();
        obj1.value = new Child2();
        const xml = XmlSerializer.serialize(obj1);

        assert.equal(xml, `<root><child2 id="1"/></root>`);

        const obj2 = XmlParser.parse(xml, Test);
        assert.equal(obj2.value instanceof Child2, true);
        assert.equal((obj2.value as Child2).id, "1");
      });
      it("3st element", () => {
        const obj1 = new Test();
        obj1.value = new Child3();
        const xml = XmlSerializer.serialize(obj1);

        assert.equal(xml, `<root><child3>test</child3></root>`);

        const obj2 = XmlParser.parse(xml, Test);
        assert.equal(obj2.value instanceof Child3, true);
        assert.equal((obj2.value as Child3).text, "test");
      });
    });
    context("repeated elements", () => {
      @XmlType({ name: "child1" })
      class Child1 {
        @XmlAttribute()
        public value = "test";
      }
      @XmlType({ name: "child2" })
      class Child2 {
        @XmlAttribute()
        public id = "1";
      }
      @XmlType({ name: "child3" })
      class Child3 {
        @XmlContent()
        public text = "test";
      }
      @XmlType({ name: "root" })
      class Test {
        @XmlElement({ type: Child1, repeated: true })
        @XmlElement({ type: Child2, repeated: true })
        @XmlElement({ type: Child3, repeated: true })
        public values: Array<Child1 | Child2 | Child3> = [];
      }
      it("#1", () => {
        const obj1 = new Test();
        obj1.values.push(new Child1());
        obj1.values.push(new Child2());
        obj1.values.push(new Child3());
        const xml = XmlSerializer.serialize(obj1);

        assert.equal(xml, `<root><child1 value="test"/><child2 id="1"/><child3>test</child3></root>`);

        const obj2 = XmlParser.parse(xml, Test);
        assert.equal(obj2.values.length, 3);
        assert.equal(obj2.values[2] instanceof Child1, true);
        assert.equal(obj2.values[1] instanceof Child2, true);
        assert.equal(obj2.values[0] instanceof Child3, true);
      });
    });
  });

});
