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

        let ma = MessageAccumulator.create("<c0/>");
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

    testMessageAccumulatorFromStringWithParam: function(test) {
        test.expect(4);

        let ma = MessageAccumulator.create("This is a <p0/> of the decomposition system.");
        test.ok(ma);

        test.ok(ma.root.children);
        test.equal(ma.root.children.length, 3);

        test.contains(ma.root, {
            children: [
                {value: "This is a "},
                {
                    type: 'param',
                    index: 0
                },
                {value: " of the decomposition system."}
            ]
        });

        test.done();
    },

    testMessageAccumulatorFromStringWithMultipleParams: function(test) {
        test.expect(4);

        let ma = MessageAccumulator.create("This is a <p0/> of the decomposition <p1/>.");
        test.ok(ma);

        test.ok(ma.root.children);
        test.equal(ma.root.children.length, 5);

        test.contains(ma.root, {
            children: [
                {value: "This is a "},
                {
                    type: 'param',
                    index: 0
                },
                {value: " of the decomposition "},
                {
                    type: 'param',
                    index: 1
                },
                {value: "."}
            ]
        });

        test.done();
    },

    testMessageAccumulatorFromStringWithMultipleParamsReversed: function(test) {
        test.expect(4);

        let ma = MessageAccumulator.create("This is a <p1/> of the decomposition <p0/>.");
        test.ok(ma);

        test.ok(ma.root.children);
        test.equal(ma.root.children.length, 5);

        test.contains(ma.root, {
            children: [
                {value: "This is a "},
                {
                    type: 'param',
                    index: 1
                },
                {value: " of the decomposition "},
                {
                    type: 'param',
                    index: 0
                },
                {value: "."}
            ]
        });

        test.done();
    },

    testMessageAccumulatorFromStringWithParamsAndComponents: function(test) {
        test.expect(4);

        let ma = MessageAccumulator.create("This is a <c0>test of the <c1><p0/></c1> system</c0>.");
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
                                {
                                    type: 'param',
                                    index: 0
                                }
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

    testMessageAccumulatorBuildAddParam: function(test) {
        test.expect(3);

        let ma = new MessageAccumulator();
        test.ok(ma);

        ma.addParam({foo: "bar"});

        test.ok(ma.root.children);
        test.equal(ma.root.children.length, 1);

        test.done();
    },

    testMessageAccumulatorBuildAddParamRightNumberOfChildren: function(test) {
        test.expect(3);

        let ma = new MessageAccumulator();
        test.ok(ma);

        ma.addText("This is a test ");
        ma.addParam({foo: "bar"});
        ma.addText(" other text.");

        test.ok(ma.root.children);
        test.equal(ma.root.children.length, 3);

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

    testMessageAccumulatorBuildPopNormalWithParam: function(test) {
        test.expect(5);

        let ma = new MessageAccumulator();
        test.ok(ma);

        ma.push(5);
        ma.addText("foo");
        ma.addParam(3);
        test.equal(ma.pop(), 5);

        test.ok(ma.root.children);
        test.equal(ma.root.children.length, 1);
        test.equal(ma.root.children[0].children.length, 2);

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

    testMessageAccumulatorBuildNotClosed: function(test) {
        test.expect(5);

        let ma = new MessageAccumulator();
        test.ok(ma);

        ma.push(5);
        ma.addText("foo");

        test.ok(ma.root.children);
        test.equal(ma.root.children.length, 1);
        test.equal(ma.root.children[0].children.length, 1);
        test.ok(!ma.root.children[0].closed);

        test.done();
    },

    testMessageAccumulatorBuildClosed: function(test) {
        test.expect(5);

        let ma = new MessageAccumulator();
        test.ok(ma);

        ma.push(5);
        ma.addText("foo");
        ma.pop();

        test.ok(ma.root.children);
        test.equal(ma.root.children.length, 1);
        test.equal(ma.root.children[0].children.length, 1);
        test.ok(ma.root.children[0].closed);

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
        ma.pop();

        test.ok(ma.root.children);

        test.equal(ma.getString(), "This is <c0>a test</c0>");

        test.done();
    },

    testMessageAccumulatorGetStringWithComponentUnbalanced: function(test) {
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

        test.equal(ma.getString(), "This is a test of the <c0/> emergency message system.");

        test.done();
    },

    testMessageAccumulatorGetStringWithParam: function(test) {
        test.expect(3);

        let ma = new MessageAccumulator();
        test.ok(ma);

        ma.addText("This is a ");
        ma.addParam({value: "{test}"});
        ma.addText(" of the ");
        ma.addText("emergency message system");
        ma.addText(".");

        test.ok(ma.root.children);

        test.equal(ma.getString(), "This is a <p0/> of the emergency message system.");

        test.done();
    },

    testMessageAccumulatorGetStringWithMultipleParams: function(test) {
        test.expect(3);

        let ma = new MessageAccumulator();
        test.ok(ma);

        ma.addText("This is a ");
        ma.addParam({value: "{test}"});
        ma.addText(" of the ");
        ma.addText("emergency message ");
        ma.addParam({value: "{system}"});
        ma.addText(".");

        test.ok(ma.root.children);

        test.equal(ma.getString(), "This is a <p0/> of the emergency message <p1/>.");

        test.done();
    },

    testMessageAccumulatorGetStringWithParamsAndComponents: function(test) {
        test.expect(3);

        let ma = new MessageAccumulator();
        test.ok(ma);

        ma.addText("This is a ");
        ma.push(5);
        ma.addParam({value: "{test}"});
        ma.addText(" of the ");
        ma.push(4);
        ma.addText("emergency message ");
        ma.pop();
        ma.addParam({value: "{system}"});
        ma.addText(".");
        ma.pop();

        test.ok(ma.root.children);

        test.equal(ma.getString(), "This is a <c0><p0/> of the <c1>emergency message </c1><p1/>.</c0>");

        test.done();
    },

    testMessageAccumulatorParseAndThenGetString: function(test) {
        test.expect(3);

        let ma = MessageAccumulator.create("<c0>This is <c1>a <p0/> of the <c2>emergency message system</c2>.</c1></c0>");
        test.ok(ma);

        test.ok(ma.root.children);

        test.equal(ma.getString(), "<c0>This is <c1>a <p0/> of the <c2>emergency message system</c2>.</c1></c0>");

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

    testMessageAccumulatorGetParam: function(test) {
        test.expect(5);

        let ma = new MessageAccumulator();
        test.ok(ma);

        ma.push(86);
        ma.addText("This is ");
        ma.push(5);
        ma.addText("a ");
        ma.addParam({value: "{test}"});
        ma.addText(" of the ");
        ma.push(4);
        ma.addParam({value: "{emergency}"});
        ma.addText(" message ");
        ma.addParam({value: "{system}"});
        ma.pop();
        ma.addText(".");
        ma.pop();
        ma.pop();

        test.ok(ma.root.children);

        test.deepEqual(ma.getParam(0), {value: "{test}"});
        test.deepEqual(ma.getParam(1), {value: "{emergency}"});
        test.deepEqual(ma.getParam(2), {value: "{system}"});

        test.done();
    },

    testMessageAccumulatorGetMapping: function(test) {
        test.expect(3);

        let ma = new MessageAccumulator();
        test.ok(ma);

        ma.push({foo: "bar"});
        ma.addText("This is ");
        ma.push({type: "component"});
        ma.addText("a ");
        ma.addParam({value: "{test}"});
        ma.addText(" of the ");
        ma.push({name: "a"});
        ma.addText("emergency message ");
        ma.addParam({value: "{system}"});
        ma.pop();
        ma.addText(".");
        ma.pop();
        ma.pop();

        test.ok(ma.root.children);

        test.deepEqual(ma.getMapping(), {
            "c0": {foo: "bar"},
            "c1": {type: "component"},
            "c2": {name: "a"},
            "p0": {value: "{test}"},
            "p1": {value: "{system}"}
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

    testMessageAccumulatorGetTextLengthWithParam: function(test) {
        test.expect(3);

        let ma = new MessageAccumulator();
        test.ok(ma);

        ma.addText("test ");
        ma.addParam("%1");

        test.ok(ma.root.children);

        test.equal(ma.getTextLength(), 9);

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

    testMessageAccumulatorGetTextLengthIgnoreUnicodeWhiteSpace: function(test) {
        test.expect(3);

        let ma = new MessageAccumulator();
        test.ok(ma);

        ma.push({foo: "bar"});
        ma.addText("            ​‌‍ ⁠");
        ma.pop();

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
        let ma = MessageAccumulator.create("Einen großen <c1>Tritt</c1> in Richtung Tors geben Sie am <c0>Ball</c0> hin.", source);
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
                {value: " in Richtung Tors geben Sie am "},
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

    testMessageAccumulatorCreateWithSourceAndParams: function(test) {
        test.expect(7);

        let source = new MessageAccumulator();
        test.ok(source);

        source.addText("You give ");
        source.push({name: "b"});
        source.addText("the ");
        source.addParam("{ball}");
        source.pop();
        source.addText(" a big ");
        source.push({name: "i"});
        source.addParam("{kick}");
        source.pop();
        source.addText(" towards the goal.");

        // The translation has the components swapped from the English
        let ma = MessageAccumulator.create("Einen großen <c1><p1/></c1> in Richtung Tors geben Sie am <c0><p0/></c0> hin.", source);
        test.ok(ma);

        test.ok(ma.root.children);
        test.equal(ma.root.children.length, 5);

        test.contains(ma.root, {
            children: [
                {value: "Einen großen "},
                {
                    type: 'component',
                    children: [
                        {
                            type: 'param',
                            index: 1
                        }
                    ],
                    index: 1
                },
                {value: " in Richtung Tors geben Sie am "},
                {
                    type: 'component',
                    children: [
                        {
                            type: 'param',
                            index: 0
                        }
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
        test.expect(11);

        let ma = new MessageAccumulator();
        test.ok(ma);

        test.equal(ma.getCurrentLevel(), 0);

        ma.addText("You give ");

        test.equal(ma.getCurrentLevel(), 0);

        ma.addParam("{test}");

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

    testMessageAccumulatorMinimizeOuterComponents: function(test) {
        test.expect(3);

        let source = new MessageAccumulator();
        test.ok(source);

        source.push({name: "a"});
        source.addText("You give ");
        source.push({name: "b"});
        source.addText("the ball");
        source.pop();
        source.addText(" a big ");
        source.push({name: "i"});
        source.addText("kick");
        source.pop();
        source.addText(" towards the goal.");
        source.pop();

        test.equal(source.getString(), "<c0>You give <c1>the ball</c1> a big <c2>kick</c2> towards the goal.</c0>");
        test.equal(source.getMinimalString(), "You give <c0>the ball</c0> a big <c1>kick</c1> towards the goal.");

        test.done();
    },

    testMessageAccumulatorGetPrefix: function(test) {
        test.expect(6);

        let source = new MessageAccumulator();
        test.ok(source);

        source.push({name: "a"});
        source.addText("You give ");
        source.push({name: "b"});
        source.addText("the ball");
        source.pop();
        source.addText(" a big ");
        source.push({name: "i"});
        source.addText("kick");
        source.pop();
        source.addText(" towards the goal.");
        source.pop();

        test.equal(source.getString(), "<c0>You give <c1>the ball</c1> a big <c2>kick</c2> towards the goal.</c0>");
        test.equal(source.getMinimalString(), "You give <c0>the ball</c0> a big <c1>kick</c1> towards the goal.");
        var prefix = source.getPrefix();
        test.ok(prefix);
        test.equal(prefix.length, 1);
        test.contains(prefix[0], {extra: {name: "a"}, use: "start"});

        test.done();
    },

    testMessageAccumulatorGetSuffix: function(test) {
        test.expect(6);

        let source = new MessageAccumulator();
        test.ok(source);

        source.push({name: "a"});
        source.addText("You give ");
        source.push({name: "b"});
        source.addText("the ball");
        source.pop();
        source.addText(" a big ");
        source.push({name: "i"});
        source.addText("kick");
        source.pop();
        source.addText(" towards the goal.");
        source.pop();

        test.equal(source.getString(), "<c0>You give <c1>the ball</c1> a big <c2>kick</c2> towards the goal.</c0>");
        test.equal(source.getMinimalString(), "You give <c0>the ball</c0> a big <c1>kick</c1> towards the goal.");
        var suffix = source.getSuffix();
        test.ok(suffix);
        test.equal(suffix.length, 1);
        test.contains(suffix[0], {extra: {name: "a"}, use: "end"});

        test.done();
    },

    testMessageAccumulatorMinimizeOuterComponentSelfClosing: function(test) {
        test.expect(3);

        let source = new MessageAccumulator();
        test.ok(source);

        source.push({name: "a"});
        source.pop();
        source.addText("You give ");
        source.push({name: "b"});
        source.addText("the ball");
        source.pop();
        source.addText(" a big ");
        source.push({name: "i"});
        source.addText("kick");
        source.pop();
        source.addText(" towards the goal.");
        source.pop();

        test.equal(source.getString(), "<c0/>You give <c1>the ball</c1> a big <c2>kick</c2> towards the goal.");
        test.equal(source.getMinimalString(), "You give <c0>the ball</c0> a big <c1>kick</c1> towards the goal.");

        test.done();
    },

    testMessageAccumulatorMinimizeOuterComponentSelfClosingWithKeepProperty: function(test) {
        test.expect(3);

        let source = new MessageAccumulator();
        test.ok(source);

        source.push({name: "a"}, true); // true keeps this component during getMinimalString
        source.pop();
        source.addText("You give ");
        source.push({name: "b"});
        source.addText("the ball");
        source.pop();
        source.addText(" a big ");
        source.push({name: "i"});
        source.addText("kick");
        source.pop();
        source.addText(" towards the goal.");
        source.pop();

        test.equal(source.getString(), "<c0/>You give <c1>the ball</c1> a big <c2>kick</c2> towards the goal.");
        test.equal(source.getMinimalString(), "<c0/>You give <c1>the ball</c1> a big <c2>kick</c2> towards the goal.");

        test.done();
    },

    testMessageAccumulatorMinimizeOuterComponentsButNotParams: function(test) {
        test.expect(3);

        let source = new MessageAccumulator();
        test.ok(source);

        source.push({name: "a"});
        source.addParam("{test}");
        source.addText("You give ");
        source.push({name: "b"});
        source.addText("the ball");
        source.pop();
        source.addText(" a big ");
        source.push({name: "i"});
        source.addText("kick");
        source.pop();
        source.addText(" towards the goal.");
        source.pop();

        test.equal(source.getString(), "<c0><p0/>You give <c1>the ball</c1> a big <c2>kick</c2> towards the goal.</c0>");
        test.equal(source.getMinimalString(), "<p0/>You give <c0>the ball</c0> a big <c1>kick</c1> towards the goal.");

        test.done();
    },

    testMessageAccumulatorMinimizeOuterComponentsButNotWithKeepProperty: function(test) {
        test.expect(3);

        let source = new MessageAccumulator();
        test.ok(source);

        source.push({name: "a"}, true); // true to keep this one
        source.addText("You give ");
        source.push({name: "b"});
        source.addText("the ball");
        source.pop();
        source.addText(" a big ");
        source.push({name: "i"});
        source.addText("kick");
        source.pop();
        source.addText(" towards the goal.");
        source.pop();

        test.equal(source.getString(), "<c0>You give <c1>the ball</c1> a big <c2>kick</c2> towards the goal.</c0>");
        test.equal(source.getMinimalString(), "<c0>You give <c1>the ball</c1> a big <c2>kick</c2> towards the goal.</c0>");

        test.done();
    },

    testMessageAccumulatorMinimizeMultipleOuterComponents: function(test) {
        test.expect(3);

        let source = new MessageAccumulator();
        test.ok(source);

        source.push({name: "a"});
        source.push({name: "x"});
        source.push({name: "y"});
        source.addText("You give ");
        source.push({name: "b"});
        source.addText("the ball");
        source.pop();
        source.addText(" a big ");
        source.push({name: "i"});
        source.addText("kick");
        source.pop();
        source.addText(" towards the goal.");
        source.pop();
        source.pop();
        source.pop();

        test.equal(source.getString(), "<c0><c1><c2>You give <c3>the ball</c3> a big <c4>kick</c4> towards the goal.</c2></c1></c0>");
        test.equal(source.getMinimalString(), "You give <c0>the ball</c0> a big <c1>kick</c1> towards the goal.");

        test.done();
    },

    testMessageAccumulatorGetPrefixMultiple: function(test) {
        test.expect(8);

        let source = new MessageAccumulator();
        test.ok(source);

        source.push({name: "a"});
        source.push({name: "x"});
        source.push({name: "y"});
        source.addText("You give ");
        source.push({name: "b"});
        source.addText("the ball");
        source.pop();
        source.addText(" a big ");
        source.push({name: "i"});
        source.addText("kick");
        source.pop();
        source.addText(" towards the goal.");
        source.pop();
        source.pop();
        source.pop();

        test.equal(source.getString(), "<c0><c1><c2>You give <c3>the ball</c3> a big <c4>kick</c4> towards the goal.</c2></c1></c0>");
        test.equal(source.getMinimalString(), "You give <c0>the ball</c0> a big <c1>kick</c1> towards the goal.");

        var prefix = source.getPrefix();
        test.ok(prefix);
        test.equal(prefix.length, 3);
        test.contains(prefix[0], {extra: {name: "a"}, use: "start"});
        test.contains(prefix[1], {extra: {name: "x"}, use: "start"});
        test.contains(prefix[2], {extra: {name: "y"}, use: "start"});

        test.done();
    },

    testMessageAccumulatorGetSuffixMultiple: function(test) {
        test.expect(8);

        let source = new MessageAccumulator();
        test.ok(source);

        source.push({name: "a"});
        source.push({name: "x"});
        source.push({name: "y"});
        source.addText("You give ");
        source.push({name: "b"});
        source.addText("the ball");
        source.pop();
        source.addText(" a big ");
        source.push({name: "i"});
        source.addText("kick");
        source.pop();
        source.addText(" towards the goal.");
        source.pop();
        source.pop();
        source.pop();

        test.equal(source.getString(), "<c0><c1><c2>You give <c3>the ball</c3> a big <c4>kick</c4> towards the goal.</c2></c1></c0>");
        test.equal(source.getMinimalString(), "You give <c0>the ball</c0> a big <c1>kick</c1> towards the goal.");

        var suffix = source.getSuffix();
        test.ok(suffix);
        test.equal(suffix.length, 3);
        test.contains(suffix[0], {extra: {name: "y"}, use: "end"});
        test.contains(suffix[1], {extra: {name: "x"}, use: "end"});
        test.contains(suffix[2], {extra: {name: "a"}, use: "end"});

        test.done();
    },

    testMessageAccumulatorDontMinimizeNonOuterComponents: function(test) {
        test.expect(3);

        let source = new MessageAccumulator();
        test.ok(source);

        source.push({name: "a"});
        source.addText("You give ");
        source.push({name: "b"});
        source.addText("the ball");
        source.pop();
        source.addText(" a big ");
        source.push({name: "i"});
        source.addText("kick");
        source.pop();
        source.addText(" towards the goal.");
        source.pop();
        source.addText(" After you score, you celebrate.");

        test.equal(source.getString(), "<c0>You give <c1>the ball</c1> a big <c2>kick</c2> towards the goal.</c0> After you score, you celebrate.");
        test.equal(source.getMinimalString(), "<c0>You give <c1>the ball</c1> a big <c2>kick</c2> towards the goal.</c0> After you score, you celebrate.");

        test.done();
    },

    testMessageAccumulatorDontMinimizeNonOuterComponentsWithParams: function(test) {
        test.expect(3);

        let source = new MessageAccumulator();
        test.ok(source);

        source.push({name: "a"});
        source.addText("You give ");
        source.push({name: "b"});
        source.addText("the ball");
        source.pop();
        source.addText(" a big ");
        source.push({name: "i"});
        source.addText("kick");
        source.pop();
        source.addText(" towards the goal.");
        source.pop();
        source.addParam("%1s@");

        test.equal(source.getString(), "<c0>You give <c1>the ball</c1> a big <c2>kick</c2> towards the goal.</c0><p0/>");
        test.equal(source.getMinimalString(), "<c0>You give <c1>the ball</c1> a big <c2>kick</c2> towards the goal.</c0><p0/>");

        test.done();
    },

    testMessageAccumulatorDontMinimizeNonOuterComponentsNoPrefixOrSuffix: function(test) {
        test.expect(7);

        let source = new MessageAccumulator();
        test.ok(source);

        source.push({name: "a"});
        source.addText("You give ");
        source.push({name: "b"});
        source.addText("the ball");
        source.pop();
        source.addText(" a big ");
        source.push({name: "i"});
        source.addText("kick");
        source.pop();
        source.addText(" towards the goal.");
        source.pop();
        source.addText(" After you score, you celebrate.");

        test.equal(source.getString(), "<c0>You give <c1>the ball</c1> a big <c2>kick</c2> towards the goal.</c0> After you score, you celebrate.");
        test.equal(source.getMinimalString(), "<c0>You give <c1>the ball</c1> a big <c2>kick</c2> towards the goal.</c0> After you score, you celebrate.");

        var prefix = source.getPrefix();
        test.ok(prefix);
        test.equal(prefix.length, 0);

        var suffix = source.getSuffix();
        test.ok(suffix);
        test.equal(suffix.length, 0);

        test.done();
    },

    testMessageAccumulatorMinimizeEmpty: function(test) {
        test.expect(3);

        let source = new MessageAccumulator();
        test.ok(source);

        test.equal(source.getString(), "");
        test.equal(source.getMinimalString(), "");

        test.done();
    },

    testMessageAccumulatorMinimizeSimple: function(test) {
        test.expect(3);

        let source = new MessageAccumulator();
        test.ok(source);

        source.addText("Test");

        test.equal(source.getString(), "Test");
        test.equal(source.getMinimalString(), "Test");

        test.done();
    },

    testMessageAccumulatorMinimizeUnbalanced: function(test) {
        test.expect(3);

        let source = new MessageAccumulator();
        test.ok(source);

        source.push({name: "i"});
        source.addText("Test");

        test.equal(source.getString(), "<c0>Test</c0>");
        test.equal(source.getMinimalString(), "Test");

        test.done();
    },

    testMessageAccumulatorMinimizeWhiteSpace: function(test) {
        test.expect(3);

        let source = new MessageAccumulator();
        test.ok(source);

        source.push({name: "i"});
        source.addText("    \n\t   ");
        source.pop();

        test.equal(source.getString(), "<c0>    \n\t   </c0>");
        test.equal(source.getMinimalString(), "");

        test.done();
    },

    testMessageAccumulatorMinimizeWhitespace: function(test) {
        test.expect(5);

        let ma = MessageAccumulator.create("   This is a test of the <c0>decomposition</c0> system.   ");
        test.ok(ma);

        test.ok(ma.root.children);
        test.equal(ma.root.children.length, 3);

        test.equal(ma.getString(), "   This is a test of the <c0>decomposition</c0> system.   ");
        test.equal(ma.getMinimalString(), "This is a test of the <c0>decomposition</c0> system.");

        test.done();
    },

    testMessageAccumulatorMinimizePrefixComponents: function(test) {
        test.expect(5);

        let ma = MessageAccumulator.create("<c0/>This is a test of the <c1>decomposition</c1> system.");
        test.ok(ma);

        test.ok(ma.root.children);
        test.equal(ma.root.children.length, 4);

        test.equal(ma.getString(), "<c0/>This is a test of the <c1>decomposition</c1> system.");
        test.equal(ma.getMinimalString(), "This is a test of the <c0>decomposition</c0> system.");

        test.done();
    },

    testMessageAccumulatorMinimizePrefixComponentsWithSpace: function(test) {
        test.expect(5);

        let ma = MessageAccumulator.create("<c0>    </c0>This is a test of the <c1>decomposition</c1> system.");
        test.ok(ma);

        test.ok(ma.root.children);
        test.equal(ma.root.children.length, 4);

        test.equal(ma.getString(), "<c0>    </c0>This is a test of the <c1>decomposition</c1> system.");
        test.equal(ma.getMinimalString(), "This is a test of the <c0>decomposition</c0> system.");

        test.done();
    },

    testMessageAccumulatorMinimizePrefixComponentsWithParam: function(test) {
        test.expect(5);

        let ma = MessageAccumulator.create("<c0><p0/></c0>This is a test of the <c1>decomposition</c1> system.");
        test.ok(ma);

        test.ok(ma.root.children);
        test.equal(ma.root.children.length, 4);

        test.equal(ma.getString(), "<c0><p0/></c0>This is a test of the <c1>decomposition</c1> system.");
        test.equal(ma.getMinimalString(), "<c0><p0/></c0>This is a test of the <c1>decomposition</c1> system.");

        test.done();
    },

    testMessageAccumulatorMinimizePrefixComponentsWithSpaceAndSubcomponents: function(test) {
        test.expect(5);

        let ma = MessageAccumulator.create("<c0>\n  <c1>\n  </c1>\n</c0>This is a test of the <c2>decomposition</c2> system.");
        test.ok(ma);

        test.ok(ma.root.children);
        test.equal(ma.root.children.length, 4);

        test.equal(ma.getString(), "<c0>\n  <c1>\n  </c1>\n</c0>This is a test of the <c2>decomposition</c2> system.");
        test.equal(ma.getMinimalString(), "This is a test of the <c0>decomposition</c0> system.");

        test.done();
    },

    testMessageAccumulatorMinimizeSuffixComponents: function(test) {
        test.expect(5);

        let ma = MessageAccumulator.create("This is a test of the <c0>decomposition</c0> system.<c1/>");
        test.ok(ma);

        test.ok(ma.root.children);
        test.equal(ma.root.children.length, 4);

        test.equal(ma.getString(), "This is a test of the <c0>decomposition</c0> system.<c1/>");
        test.equal(ma.getMinimalString(), "This is a test of the <c0>decomposition</c0> system.");

        test.done();
    },

    testMessageAccumulatorMinimizeSuffixComponentsWithSpace: function(test) {
        test.expect(5);

        let ma = MessageAccumulator.create("This is a test of the <c0>decomposition</c0> system.<c1>    </c1>");
        test.ok(ma);

        test.ok(ma.root.children);
        test.equal(ma.root.children.length, 4);

        test.equal(ma.getString(), "This is a test of the <c0>decomposition</c0> system.<c1>    </c1>");
        test.equal(ma.getMinimalString(), "This is a test of the <c0>decomposition</c0> system.");

        test.done();
    },

    testMessageAccumulatorMinimizeSuffixComponentsWithSpaceAndSubcomponents: function(test) {
        test.expect(5);

        let ma = MessageAccumulator.create("This is a test of the <c0>decomposition</c0> system.<c1>\n  <c2>\n  </c2>\n</c1>");
        test.ok(ma);

        test.ok(ma.root.children);
        test.equal(ma.root.children.length, 4);

        test.equal(ma.getString(), "This is a test of the <c0>decomposition</c0> system.<c1>\n  <c2>\n  </c2>\n</c1>");
        test.equal(ma.getMinimalString(), "This is a test of the <c0>decomposition</c0> system.");

        test.done();
    },

    testMessageAccumulatorMinimizePrefixAndSuffixComponents: function(test) {
        test.expect(5);

        let ma = MessageAccumulator.create("<c0/>This is a test of the <c1>decomposition</c1> system.<c2/>");
        test.ok(ma);

        test.ok(ma.root.children);
        test.equal(ma.root.children.length, 5);

        test.equal(ma.getString(), "<c0/>This is a test of the <c1>decomposition</c1> system.<c2/>");
        test.equal(ma.getMinimalString(), "This is a test of the <c0>decomposition</c0> system.");

        test.done();
    },

    testMessageAccumulatorMinimizePrefixAndSuffixComponentsWithSpace: function(test) {
        test.expect(5);

        let ma = MessageAccumulator.create("<c0>\n</c0>This is a test of the <c1>decomposition</c1> system.<c2>    </c2>");
        test.ok(ma);

        test.ok(ma.root.children);
        test.equal(ma.root.children.length, 5);

        test.equal(ma.getString(), "<c0>\n</c0>This is a test of the <c1>decomposition</c1> system.<c2>    </c2>");
        test.equal(ma.getMinimalString(), "This is a test of the <c0>decomposition</c0> system.");

        test.done();
    },

    testMessageAccumulatorMinimizePrefixAndSuffixComponentsWithSpaceAndSubcomponents: function(test) {
        test.expect(5);

        let ma = MessageAccumulator.create("<c0>\n  <c1>\n  </c1>\n</c0>This is a test of the <c2>decomposition</c2> system.<c3>  <c4> </c4>  </c3>");
        test.ok(ma);

        test.ok(ma.root.children);
        test.equal(ma.root.children.length, 5);

        test.equal(ma.getString(), "<c0>\n  <c1>\n  </c1>\n</c0>This is a test of the <c2>decomposition</c2> system.<c3>  <c4> </c4>  </c3>");
        test.equal(ma.getMinimalString(), "This is a test of the <c0>decomposition</c0> system.");

        test.done();
    },

    testMessageAccumulatorMinimizePrefixAndOuterComponents: function(test) {
        test.expect(5);

        let ma = MessageAccumulator.create("<c0><c1/>This is a test of the <c2>decomposition</c2> system.</c0>");
        test.ok(ma);

        test.ok(ma.root.children);
        test.equal(ma.root.children.length, 1);

        test.equal(ma.getString(), "<c0><c1/>This is a test of the <c2>decomposition</c2> system.</c0>");
        test.equal(ma.getMinimalString(), "This is a test of the <c0>decomposition</c0> system.");

        test.done();
    },

    testMessageAccumulatorMinimizeSuffixAndOuterComponents: function(test) {
        test.expect(5);

        let ma = MessageAccumulator.create("<c0>This is a test of the <c1>decomposition</c1> system.<c2/></c0>");
        test.ok(ma);

        test.ok(ma.root.children);
        test.equal(ma.root.children.length, 1);

        test.equal(ma.getString(), "<c0>This is a test of the <c1>decomposition</c1> system.<c2/></c0>");
        test.equal(ma.getMinimalString(), "This is a test of the <c0>decomposition</c0> system.");

        test.done();
    },

    testMessageAccumulatorMinimizeVeryComplexWithMultipleLevels: function(test) {
        test.expect(5);

        let ma = MessageAccumulator.create("<c0><c1>  \t </c1><c2>\n<c3>\n<c4/></c3>\n  This is a test of the <c5>decomposition</c5> system.   <c6>\n</c6></c2></c0>");
        test.ok(ma);

        test.ok(ma.root.children);
        test.equal(ma.root.children.length, 1);

        test.equal(ma.getString(), "<c0><c1>  \t </c1><c2>\n<c3>\n<c4/></c3>\n  This is a test of the <c5>decomposition</c5> system.   <c6>\n</c6></c2></c0>");
        test.equal(ma.getMinimalString(), "This is a test of the <c0>decomposition</c0> system.");

        test.done();
    },

    testMessageAccumulatorMinimizeVeryComplexWithMultipleLevelsAndEmbeddedParam: function(test) {
        test.expect(5);

        let ma = MessageAccumulator.create("<c0><c1>  \t </c1><c2>\n<c3>\n<c4/><p0/></c3>\n  This is a test of the <c5>decomposition</c5> system.   <c6>\n</c6></c2></c0>");
        test.ok(ma);

        test.ok(ma.root.children);
        test.equal(ma.root.children.length, 1);

        test.equal(ma.getString(), "<c0><c1>  \t </c1><c2>\n<c3>\n<c4/><p0/></c3>\n  This is a test of the <c5>decomposition</c5> system.   <c6>\n</c6></c2></c0>");
        test.equal(ma.getMinimalString(), "<c0>\n<c1/><p0/></c0>\n  This is a test of the <c2>decomposition</c2> system.");

        test.done();
    },

    testMessageAccumulatorMinimizeVeryComplexPrefix: function(test) {
        test.expect(18);

        let source = new MessageAccumulator();
        test.ok(source);

        source.push({name: "a"});
        source.push({name: "b"});
        source.addText("  \t ");
        source.pop();
        source.push({name: "c"});
        source.addText("\n");
        source.push({name: "d"});
        source.addText("\n");
        source.push({name: "e"});
        source.pop();
        source.pop();
        source.addText("\n  This is a test of the ");
        source.push({name: "f"});
        source.addText("decomposition");
        source.pop();
        source.addText(" system.   ");
        source.push({name: "g"});
        source.addText("\n");
        source.pop();
        source.pop();
        source.pop();

        test.ok(source.root.children);
        test.equal(source.root.children.length, 1);

        test.equal(source.getString(), "<c0><c1>  \t </c1><c2>\n<c3>\n<c4/></c3>\n  This is a test of the <c5>decomposition</c5> system.   <c6>\n</c6></c2></c0>");
        test.equal(source.getMinimalString(), "This is a test of the <c0>decomposition</c0> system.");

        var prefix = source.getPrefix();
        test.ok(prefix);
        test.equal(prefix.length, 11);
        test.contains(prefix[0], {extra: {name: "a"}, use: "start"});
        test.contains(prefix[1], {extra: {name: "b"}, use: "start"});
        test.contains(prefix[2], {value: "  \t "});
        test.contains(prefix[3], {extra: {name: "b"}, use: "end"});
        test.contains(prefix[4], {extra: {name: "c"}, use: "start"});
        test.contains(prefix[5], {value: "\n"});
        test.contains(prefix[6], {extra: {name: "d"}, use: "start"});
        test.contains(prefix[7], {value: "\n"});
        test.contains(prefix[8], {extra: {name: "e"}, use: "startend"});
        test.contains(prefix[9], {extra: {name: "d"}, use: "end"});
        test.contains(prefix[10], {value: "\n  "});

        test.done();
    },

    testMessageAccumulatorMinimizeAllWhiteSpacePrefix: function(test) {
        test.expect(9);

        let source = new MessageAccumulator();
        test.ok(source);

        source.push({name: "a"});
        source.addText("  \t\t \n     ");
        source.pop();

        test.ok(source.root.children);
        test.equal(source.root.children.length, 1);

        test.equal(source.getString(), "<c0>  \t\t \n     </c0>");
        test.equal(source.getMinimalString(), "");

        var prefix = source.getPrefix();
        test.ok(prefix);
        test.equal(prefix.length, 2);
        test.contains(prefix[0], {extra: {name: "a"}, use: "start"});
        test.contains(prefix[1], {value: "  \t\t \n     "});

        test.done();
    },

    testMessageAccumulatorMinimizeUnicodeWhiteSpacePrefix: function(test) {
        test.expect(9);

        let source = new MessageAccumulator();
        test.ok(source);

        source.push({name: "a"});
        source.addText("            ​‌‍ ⁠"); // includes non-breaking space and other Unicode space chars
        source.pop();

        test.ok(source.root.children);
        test.equal(source.root.children.length, 1);

        test.equal(source.getString(), "<c0>            ​‌‍ ⁠</c0>");
        test.equal(source.getMinimalString(), "");

        var prefix = source.getPrefix();
        test.ok(prefix);
        test.equal(prefix.length, 2);
        test.contains(prefix[0], {extra: {name: "a"}, use: "start"});
        test.contains(prefix[1], {value: "            ​‌‍ ⁠"});

        test.done();
    },

    testMessageAccumulatorMinimizeVeryComplexSuffix: function(test) {
        test.expect(13);

        let source = new MessageAccumulator();
        test.ok(source);

        source.push({name: "a"});
        source.push({name: "b"});
        source.addText("  \t ");
        source.pop();
        source.push({name: "c"});
        source.addText("\n");
        source.push({name: "d"});
        source.addText("\n");
        source.push({name: "e"});
        source.pop();
        source.pop();
        source.addText("\n  This is a test of the ");
        source.push({name: "f"});
        source.addText("decomposition");
        source.pop();
        source.addText(" system.   ");
        source.push({name: "g"});
        source.addText("\n");
        source.pop();
        source.pop();
        source.pop();

        test.ok(source.root.children);
        test.equal(source.root.children.length, 1);

        test.equal(source.getString(), "<c0><c1>  \t </c1><c2>\n<c3>\n<c4/></c3>\n  This is a test of the <c5>decomposition</c5> system.   <c6>\n</c6></c2></c0>");
        test.equal(source.getMinimalString(), "This is a test of the <c0>decomposition</c0> system.");

        var prefix = source.getSuffix();
        test.ok(prefix);
        test.equal(prefix.length, 6);

        test.contains(prefix[0], {value: "   "});
        test.contains(prefix[1], {extra: {name: "g"}, use: "start"});
        test.contains(prefix[2], {value: "\n"});
        test.contains(prefix[3], {extra: {name: "g"}, use: "end"});
        test.contains(prefix[4], {extra: {name: "c"}, use: "end"});
        test.contains(prefix[5], {extra: {name: "a"}, use: "end"});

        test.done();
    },

    testMessageAccumulatorMinimizeAllWhitespaceSuffix: function(test) {
        test.expect(8);

        let source = new MessageAccumulator();
        test.ok(source);

        source.push({name: "a"});
        source.addText("  \t\t \n     ");
        source.pop();

        test.ok(source.root.children);
        test.equal(source.root.children.length, 1);

        test.equal(source.getString(), "<c0>  \t\t \n     </c0>");
        test.equal(source.getMinimalString(), "");

        var suffix = source.getSuffix();
        test.ok(suffix);
        test.equal(suffix.length, 1);

        test.contains(suffix[0], {extra: {name: "a"}, use: "end"});

        test.done();
    },

    testMessageAccumulatorMinimizeUnicodeWhitespaceSuffix: function(test) {
        test.expect(8);

        let source = new MessageAccumulator();
        test.ok(source);

        source.push({name: "a"});
        source.addText("            ​‌‍ ⁠"); // includes non-breaking space and other Unicode space chars
        source.pop();

        test.ok(source.root.children);
        test.equal(source.root.children.length, 1);

        test.equal(source.getString(), "<c0>            ​‌‍ ⁠</c0>");
        test.equal(source.getMinimalString(), "");

        var suffix = source.getSuffix();
        test.ok(suffix);
        test.equal(suffix.length, 1);

        test.contains(suffix[0], {extra: {name: "a"}, use: "end"});

        test.done();
    },

    testMessageAccumulatorMinimizeMappingStillCorrect: function(test) {
        test.expect(7);

        let ma = MessageAccumulator.create("<c0>This is a test of the <c1><p0/></c1> system.<c2/></c0>");
        test.ok(ma);
        let source = new MessageAccumulator();
        test.ok(source);

        source.push({name: "a"});
        source.addText("This is a test of the ");
        source.push({name: "b"});
        source.addParam("decomposition");
        source.pop();
        source.addText(" system.");
        source.push({name: "c"});
        source.pop();
        source.pop();

        test.ok(source.root.children);
        test.equal(source.root.children.length, 1);

        test.deepEqual(source.getMapping(), {
            "c0": {name: "a"},
            "c1": {name: "b"},
            "c2": {name: "c"},
            "p0": "decomposition"
        });

        test.equal(source.getMinimalString(), "This is a test of the <c0><p0/></c0> system.");

        test.deepEqual(source.getMapping(), {
            "c0": {name: "b"},
            "p0": "decomposition"
        });

        test.done();
    },

    testMessageAccumulatorParseSelfClosingComponent: function(test) {
        test.expect(4);

        let ma = MessageAccumulator.create("This is a test of the <c0/> decomposition system.");
        test.ok(ma);

        test.ok(ma.root.children);
        test.equal(ma.root.children.length, 3);

        test.contains(ma.root, {
            children: [
                {value: "This is a test of the "},
                {
                    children: [],
                    index: 0
                },
                {value: " decomposition system."}
            ]
        });

        test.done();
    },

    testMessageAccumulatorCreateWithSource: function(test) {
        test.expect(5);

        let source = new MessageAccumulator();
        test.ok(source);

        source.addText("This is a test of the ");
        source.push({text: '<img src="http://www.example.com/foo.jpg">'});
        source.pop();
        source.addText(" decomposition system.");

        // The translation has the components swapped from the English
        let ma = MessageAccumulator.create("Dies ist einen Test des <c0/> Zersetzungssystems.", source);
        test.ok(ma);

        test.ok(ma.root.children);
        test.equal(ma.root.children.length, 3);

        test.contains(ma.root, {
            children: [
                {value: "Dies ist einen Test des "},
                {
                    children: [],
                    index: 0,
                    extra: {text: '<img src="http://www.example.com/foo.jpg">'}
                },
                {value: " Zersetzungssystems."}
            ]
        });

        test.done();
    },

    testMessageAccumulatorGetStringSelfClosing: function(test) {
        test.expect(2);

        let source = new MessageAccumulator();
        test.ok(source);

        source.addText("This is a test of the ");
        source.push({text: '<img src="http://www.example.com/foo.jpg">'});
        source.pop();
        source.addText(" decomposition system.");

        test.equal(source.getString(), "This is a test of the <c0/> decomposition system.");

        test.done();
    }

};