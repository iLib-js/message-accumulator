/*
 * testmessageacc.js - test the message accumulator object
 *
 * Copyright © 2019, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import MessageAccumulator from "../message-accumulator.js";

module.exports.testAccumulator = {
    testMessageAccumulatorFactory: function(test) {
        test.expect(2);

        let ma = MessageAccumulator.create();
        test.ok(ma);
        test.equal(ma.root.children.length, 0);

        test.done();
    },

    testMessageAccumulatorFromString: function(test) {
        test.expect(4);

        let ma = MessageAccumulator.create("This is a test of the decomposition system.");
        test.ok(ma);

        test.ok(ma.root.children);
        test.equal(ma.root.children.length, 1);

        test.contains(ma.root, {
            children: [
                {value: "This is a test of the decomposition system."}
            ]
        });

        test.done();
    },

    testMessageAccumulatorFromStringWithComponent: function(test) {
        test.expect(4);

        let ma = MessageAccumulator.create("This is a <c0>test</c0> of the decomposition system.");
        test.ok(ma);

        test.ok(ma.root.children);
        test.equal(ma.root.children.length, 3);

        test.contains(ma.root, {
            children: [
                {value: "This is a "},
                {
                    children: [
                        {value: "test"}
                    ],
                    index: 0
                },
                {value: " of the decomposition system."}
            ]
        });

        test.done();
    },

    testMessageAccumulatorFromStringWithEmptyComponent: function(test) {
        test.expect(4);

        let ma = MessageAccumulator.create("<c0></c0>");
        test.ok(ma);

        test.ok(ma.root.children);
        test.equal(ma.root.children.length, 1);

        test.contains(ma.root, {
            children: [
                {
                    index: 0
                }
            ],

        });

        test.done();
    },


    testMessageAccumulatorFromStringWith2Components: function(test) {
        test.expect(4);

        let ma = MessageAccumulator.create("This is a <c0>test</c0> of the <c1>decomposition</c1> system.");
        test.ok(ma);

        test.ok(ma.root.children);
        test.equal(ma.root.children.length, 5);

        test.contains(ma.root, {
            children: [
                {value: "This is a "},
                {
                    children: [
                        {value: "test"}
                    ],
                    index: 0
                },
                {value: " of the "},
                {
                    children: [
                        {value: "decomposition"}
                    ],
                    index: 1
                },
                {value: " system."}
            ]
        });

        test.done();
    },

    testMessageAccumulatorFromStringWith2NestedComponents: function(test) {
        test.expect(4);

        let ma = MessageAccumulator.create("This is a <c0>test of the <c1>decomposition</c1> system</c0>.");
        test.ok(ma);

        test.ok(ma.root.children);
        test.equal(ma.root.children.length, 3);

        test.contains(ma.root, {
            children: [
                {value: "This is a "},
                {
                    children: [
                        {value: "test of the "},
                        {
                            children: [
                                {value: "decomposition"}
                            ],
                            index: 1
                        },
                        {value: " system"}
                    ],
                    index: 0
                },
                {value: "."}
            ]
        });

        test.done();
    },

    testMessageAccumulatorFromEmptyString: function(test) {
        test.expect(2);

        let ma = MessageAccumulator.create("");
        test.ok(ma);

        test.equal(ma.root.children.length, 0);

        test.done();
    },

    testMessageAccumulatorBuildAddTextRightNumberOfChildren: function(test) {
        test.expect(3);

        let ma = new MessageAccumulator();
        test.ok(ma);

        ma.addText("This is a test.");

        test.ok(ma.root.children);
        test.equal(ma.root.children.length, 1);

        test.done();
    },

    testMessageAccumulatorBuildAddTextRightChildren: function(test) {
        test.expect(3);

        let ma = new MessageAccumulator();
        test.ok(ma);

        ma.addText("This is a test.");

        test.ok(ma.root.children);
        test.equal(ma.root.children[0].value, "This is a test.");

        test.done();
    },

    testMessageAccumulatorBuildAddTextWithWhitespace: function(test) {
        test.expect(5);

        let ma = new MessageAccumulator();
        test.ok(ma);

        ma.addText("   This is a test.");
        ma.addText(" ");
        ma.addText("\n");

        test.ok(ma.root.children);
        test.equal(ma.root.children[0].value, "   This is a test.");
        test.equal(ma.root.children[1].value, " ");
        test.equal(ma.root.children[2].value, "\n");

        test.done();
    },

    testMessageAccumulatorBuildAddUndefined: function(test) {
        test.expect(2);

        let ma = new MessageAccumulator();
        test.ok(ma);

        ma.addText();

        test.equal(ma.root.children.length, 0);

        test.done();
    },

    testMessageAccumulatorBuildAddEmptyString: function(test) {
        test.expect(3);

        let ma = new MessageAccumulator();
        test.ok(ma);

        ma.addText("");

        test.ok(ma.root.children);
        test.equal(ma.root.children.length, 1);

        test.done();
    },

    testMessageAccumulatorBuildPushRightNumberOfChildren: function(test) {
        test.expect(3);

        let ma = new MessageAccumulator();
        test.ok(ma);

        ma.push();

        test.ok(ma.root.children);
        test.equal(ma.root.children.length, 1);

        test.done();
    },

    testMessageAccumulatorBuildPushRightChildren: function(test) {
        test.expect(4);

        let ma = new MessageAccumulator();
        test.ok(ma);

        ma.push(5);

        test.ok(ma.root.children);
        test.equal(ma.root.children.length, 1);
        test.equal(ma.root.children[0].extra, 5);

        test.done();
    },

    testMessageAccumulatorBuildPushAmongstOthers: function(test) {
        test.expect(5);

        let ma = new MessageAccumulator();
        test.ok(ma);

        ma.addText("This is ");
        ma.push(5);

        test.ok(ma.root.children);
        test.equal(ma.root.children.length, 2);
        test.equal(ma.root.children[0].value, "This is ");
        test.equal(ma.root.children[1].extra, 5);

        test.done();
    },

    testMessageAccumulatorBuildPushAmongstOthersWithContent: function(test) {
        test.expect(3);

        let ma = new MessageAccumulator();
        test.ok(ma);

        ma.addText("This is ");
        ma.push(5);
        ma.addText("a test");

        test.ok(ma.root.children);

        test.contains(ma.root.children, [
            {value: "This is "},
            {
                children: [
                    {value: "a test"}
                ],
                index: 0,
                extra: 5
            }
        ]);

        test.done();
    },

    testMessageAccumulatorBuildPushPopWithNoContent: function(test) {
        test.expect(3);

        let ma = new MessageAccumulator();
        test.ok(ma);

        ma.addText("This is ");
        ma.push(5);
        ma.pop();
        ma.addText("a test");

        test.ok(ma.root.children);

        test.contains(ma.root.children, [
            {value: "This is "},
            {
                index: 0,
                extra: 5
            },
            {value: "a test"}
        ]);

        test.done();
    },

    testMessageAccumulatorBuildPopNormal: function(test) {
        test.expect(5);

        let ma = new MessageAccumulator();
        test.ok(ma);

        ma.push(5);
        ma.addText("foo");
        test.equal(ma.pop(), 5);

        test.ok(ma.root.children);
        test.equal(ma.root.children.length, 1);
        test.equal(ma.root.children[0].children.length, 1);

        test.done();
    },

    testMessageAccumulatorBuildPopOnRoot: function(test) {
        test.expect(5);

        let ma = new MessageAccumulator();
        test.ok(ma);

        ma.addText("foo");
        test.ok(!ma.pop()); // should have no effect

        test.ok(ma.root.children);
        test.equal(ma.root.children.length, 1);
        test.equal(ma.root.children[0].value, "foo");

        test.done();
    },

    testMessageAccumulatorBuildPopReturnExtra: function(test) {
        test.expect(2);

        let ma = new MessageAccumulator();
        test.ok(ma);

        ma.push({name: "a", value: true});
        ma.addText("foo");
        test.deepEqual(ma.pop(), {name: "a", value: true});

        test.done();
    },

    testMessageAccumulatorGetStringSimple: function(test) {
        test.expect(2);

        let ma = new MessageAccumulator();
        test.ok(ma);

        ma.addText("Text");

        test.equal(ma.getString(), "Text");

        test.done();
    },

    testMessageAccumulatorGetStringEmpty: function(test) {
        test.expect(2);

        let ma = new MessageAccumulator();
        test.ok(ma);

        test.equal(ma.getString(), "");

        test.done();
    },

    testMessageAccumulatorGetStringWithComponent: function(test) {
        test.expect(3);

        let ma = new MessageAccumulator();
        test.ok(ma);

        ma.addText("This is ");
        ma.push(5);
        ma.addText("a test");

        test.ok(ma.root.children);

        test.equal(ma.getString(), "This is <c0>a test</c0>");

        test.done();
    },

    testMessageAccumulatorGetStringWithTwoComponents: function(test) {
        test.expect(3);

        let ma = new MessageAccumulator();
        test.ok(ma);

        ma.addText("This is ");
        ma.push(5);
        ma.addText("a test");
        ma.pop();
        ma.addText(" of the ");
        ma.push(4);
        ma.addText("emergency message system");
        ma.pop();
        ma.addText(".");

        test.ok(ma.root.children);

        test.equal(ma.getString(), "This is <c0>a test</c0> of the <c1>emergency message system</c1>.");

        test.done();
    },

    testMessageAccumulatorGetStringWithNestedComponents: function(test) {
        test.expect(3);

        let ma = new MessageAccumulator();
        test.ok(ma);

        ma.addText("This is ");
        ma.push(5);
        ma.addText("a test");
        ma.addText(" of the ");
        ma.push(4);
        ma.addText("emergency message system");
        ma.pop();
        ma.addText(".");
        ma.pop();

        test.ok(ma.root.children);

        test.equal(ma.getString(), "This is <c0>a test of the <c1>emergency message system</c1>.</c0>");

        test.done();
    },

    testMessageAccumulatorGetStringWithOuterComponents: function(test) {
        test.expect(3);

        let ma = new MessageAccumulator();
        test.ok(ma);

        ma.push();
        ma.addText("This is ");
        ma.push(5);
        ma.addText("a test");
        ma.addText(" of the ");
        ma.push(4);
        ma.addText("emergency message system");
        ma.pop();
        ma.addText(".");
        ma.pop();
        ma.pop();

        test.ok(ma.root.children);

        test.equal(ma.getString(), "<c0>This is <c1>a test of the <c2>emergency message system</c2>.</c1></c0>");

        test.done();
    },

    testMessageAccumulatorGetStringWithNoPop: function(test) {
        test.expect(3);

        let ma = new MessageAccumulator();
        test.ok(ma);

        ma.push();
        ma.addText("This is ");
        ma.push(5);
        ma.addText("a test");
        ma.addText(" of the ");
        ma.push(4);
        ma.addText("emergency message system");
        ma.pop();
        ma.addText(".");

        test.ok(ma.root.children);

        test.equal(ma.getString(), "<c0>This is <c1>a test of the <c2>emergency message system</c2>.</c1></c0>");

        test.done();
    },

    testMessageAccumulatorGetStringPushPopWithNoContents: function(test) {
        test.expect(3);

        let ma = new MessageAccumulator();
        test.ok(ma);

        ma.addText("This is a test of the ");
        ma.push(5);
        ma.pop();  // simulates a self-closing tag
        ma.addText(" emergency message system.");

        test.equal(ma.root.children.length, 3);

        test.equal(ma.getString(), "This is a test of the <c0></c0> emergency message system.");

        test.done();
    },

    testMessageAccumulatorParseAndThenGetString: function(test) {
        test.expect(3);

        let ma = MessageAccumulator.create("<c0>This is <c1>a test of the <c2>emergency message system</c2>.</c1></c0>");
        test.ok(ma);

        test.ok(ma.root.children);

        test.equal(ma.getString(), "<c0>This is <c1>a test of the <c2>emergency message system</c2>.</c1></c0>");

        test.done();
    },

    testMessageAccumulatorGetExtra: function(test) {
        test.expect(5);

        let ma = new MessageAccumulator();
        test.ok(ma);

        ma.push(86);
        ma.addText("This is ");
        ma.push(5);
        ma.addText("a test");
        ma.addText(" of the ");
        ma.push(4);
        ma.addText("emergency message system");
        ma.pop();
        ma.addText(".");
        ma.pop();
        ma.pop();

        test.ok(ma.root.children);

        test.equal(ma.getExtra(0), 86);
        test.equal(ma.getExtra(1), 5);
        test.equal(ma.getExtra(2), 4);

        test.done();
    },

    testMessageAccumulatorGetExtraObjects: function(test) {
        test.expect(5);

        let ma = new MessageAccumulator();
        test.ok(ma);

        ma.push({foo: "bar"});
        ma.addText("This is ");
        ma.push({type: "component"});
        ma.addText("a test");
        ma.addText(" of the ");
        ma.push({name: "a"});
        ma.addText("emergency message system");
        ma.pop();
        ma.addText(".");
        ma.pop();
        ma.pop();

        test.ok(ma.root.children);

        test.deepEqual(ma.getExtra(0), {foo: "bar"});
        test.deepEqual(ma.getExtra(1), {type: "component"});
        test.deepEqual(ma.getExtra(2), {name: "a"});

        test.done();
    },

    testMessageAccumulatorGetMapping: function(test) {
        test.expect(3);

        let ma = new MessageAccumulator();
        test.ok(ma);

        ma.push({foo: "bar"});
        ma.addText("This is ");
        ma.push({type: "component"});
        ma.addText("a test");
        ma.addText(" of the ");
        ma.push({name: "a"});
        ma.addText("emergency message system");
        ma.pop();
        ma.addText(".");
        ma.pop();
        ma.pop();

        test.ok(ma.root.children);

        test.deepEqual(ma.getMapping(), {
            "c0": {foo: "bar"},
            "c1": {type: "component"},
            "c2": {name: "a"}
        });

        test.done();
    },

    testMessageAccumulatorIsRootTrue: function(test) {
        test.expect(3);

        let ma = new MessageAccumulator();
        test.ok(ma);

        ma.addText("This is ");

        test.ok(ma.root.children);

        test.ok(ma.isRoot());

        test.done();
    },

    testMessageAccumulatorIsRootFalse: function(test) {
        test.expect(3);

        let ma = new MessageAccumulator();
        test.ok(ma);

        ma.addText("This is ");
        ma.push({foo: "bar"});

        test.ok(ma.root.children);

        test.ok(!ma.isRoot());

        test.done();
    },

    testMessageAccumulatorGetTextLength: function(test) {
        test.expect(3);

        let ma = new MessageAccumulator();
        test.ok(ma);

        ma.addText("This is ");
        ma.push({type: "component"});
        ma.addText("a test.");
        ma.pop();

        test.ok(ma.root.children);

        test.equal(ma.getTextLength(), 12);

        test.done();
    },

    testMessageAccumulatorGetTextLengthAllInsideAComponent: function(test) {
        test.expect(3);

        let ma = new MessageAccumulator();
        test.ok(ma);

        ma.push({foo: "bar"});
        ma.addText("test");
        ma.pop();

        test.ok(ma.root.children);

        test.equal(ma.getTextLength(), 4);

        test.done();
    },

    testMessageAccumulatorGetTextLengthZero: function(test) {
        test.expect(3);

        let ma = new MessageAccumulator();
        test.ok(ma);

        ma.push({type: "component"});
        ma.pop();

        test.ok(ma.root.children);

        test.equal(ma.getTextLength(), 0);

        test.done();
    },

    testMessageAccumulatorGetTextLengthIgnoreWhiteSpace: function(test) {
        test.expect(3);

        let ma = new MessageAccumulator();
        test.ok(ma);

        ma.addText("\t\t");
        ma.push({foo: "bar"});
        ma.addText("\n    \n\t\t\    \n");
        ma.pop();
        ma.addText("  ");

        test.ok(ma.root.children);

        test.equal(ma.getTextLength(), 0);

        test.done();
    },

    testMessageAccumulatorCreateWithSource: function(test) {
        test.expect(7);

        let source = new MessageAccumulator();
        test.ok(source);

        source.addText("You give ");
        source.push({name: "b"});
        source.addText("the ball");
        source.pop();
        source.addText(" a big ");
        source.push({name: "i"});
        source.addText("kick");
        source.pop();
        source.addText(" towards the goal.");

        // The translation has the components swapped from the English
        let ma = MessageAccumulator.create("Einen großen <c1>Tritt</c1> in Richtung Tor geben Sie am <c0>Ball</c0> hin.", source);
        test.ok(ma);

        test.ok(ma.root.children);
        test.equal(ma.root.children.length, 5);

        test.contains(ma.root, {
            children: [
                {value: "Einen großen "},
                {
                    children: [
                        {value: "Tritt"}
                    ],
                    index: 1
                },
                {value: " in Richtung Tor geben Sie am "},
                {
                    children: [
                        {value: "Ball"}
                    ],
                    index: 0
                },
                {value: " hin."}
            ]
        });

        // now check the extra information is attached in the right place
        test.deepEqual(ma.root.children[1].extra, {name: "i"});
        test.deepEqual(ma.root.children[3].extra, {name: "b"});

        test.done();
    },

    testMessageAccumulatorGetCurrentLevelEmpty: function(test) {
        test.expect(2);

        let ma = new MessageAccumulator();
        test.ok(ma);

        test.equal(ma.getCurrentLevel(), 0);
        test.done();
    },

    testMessageAccumulatorGetCurrentLevelNoContext: function(test) {
        test.expect(3);

        let ma = new MessageAccumulator();
        test.ok(ma);

        test.equal(ma.getCurrentLevel(), 0);
        // does not push a new context
        ma.addText("You give ");

        test.equal(ma.getCurrentLevel(), 0);

        test.done();
    },

    testMessageAccumulatorGetCurrentLevel: function(test) {
        test.expect(6);

        let ma = new MessageAccumulator();
        test.ok(ma);

        test.equal(ma.getCurrentLevel(), 0);

        ma.addText("You give ");

        test.equal(ma.getCurrentLevel(), 0);

        ma.push({name: "b"});

        test.equal(ma.getCurrentLevel(), 1);

        ma.addText("the ball");

        test.equal(ma.getCurrentLevel(), 1);

        ma.pop();

        test.equal(ma.getCurrentLevel(), 0);

        test.done();
    },

    testMessageAccumulatorGetCurrentLevelDeep: function(test) {
        test.expect(10);

        let ma = new MessageAccumulator();
        test.ok(ma);

        test.equal(ma.getCurrentLevel(), 0);

        ma.addText("You give ");

        test.equal(ma.getCurrentLevel(), 0);

        ma.push({name: "a"});

        test.equal(ma.getCurrentLevel(), 1);

        ma.push({name: "b"});

        test.equal(ma.getCurrentLevel(), 2);

        ma.push({name: "c"});

        test.equal(ma.getCurrentLevel(), 3);

        ma.addText("the ball");

        test.equal(ma.getCurrentLevel(), 3);

        ma.pop();

        test.equal(ma.getCurrentLevel(), 2);

        ma.pop();

        test.equal(ma.getCurrentLevel(), 1);

        ma.pop();

        test.equal(ma.getCurrentLevel(), 0);

        test.done();
    },

};