/*
 * testmessageacc.js - test the message accumulator object
 *
 * Copyright © 2018, JEDLSoft
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

module.exports.testscriptinfopromise = {
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
                "This is a test of the decomposition system."
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
                "This is a ",
                {
                    children: [
                        "test"
                    ],
                    index: 0
                },
                " of the decomposition system."
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
                "This is a ",
                {
                    children: [
                        "test"
                    ],
                    index: 0
                },
                " of the ",
                {
                    children: [
                        "decomposition"
                    ],
                    index: 1
                },
                " system."
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
                "This is a ",
                {
                    children: [
                        "test of the ",
                        {
                            children: [
                                "decomposition"
                            ],
                            index: 1
                        },
                        " system"
                    ],
                    index: 0
                },
                "."
            ]
        });

        test.done();
    },

    testMessageAccumulatorFromEmptyString: function(test) {
        test.expect(3);

        let ma = MessageAccumulator.create("");
        test.ok(ma);

        test.ok(ma.root.children);
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
        test.equal(ma.root.children[0], "This is a test.");

        test.done();
    },

    testMessageAccumulatorBuildAddUndefined: function(test) {
        test.expect(3);

        let ma = new MessageAccumulator();
        test.ok(ma);

        ma.addText();

        test.ok(ma.root.children);
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

    testMessageAccumulatorBuildPushComponentRightNumberOfChildren: function(test) {
        test.expect(3);

        let ma = new MessageAccumulator();
        test.ok(ma);

        ma.pushComponent();

        test.ok(ma.root.children);
        test.equal(ma.root.children.length, 1);

        test.done();
    },

    testMessageAccumulatorBuildPushComponentRightChildren: function(test) {
        test.expect(4);

        let ma = new MessageAccumulator();
        test.ok(ma);

        ma.pushComponent(5);

        test.ok(ma.root.children);
        test.equal(ma.root.children.length, 1);
        test.equal(ma.root.children[0].extra, 5);

        test.done();
    },

    testMessageAccumulatorBuildPushComponentAmongstOthers: function(test) {
        test.expect(5);

        let ma = new MessageAccumulator();
        test.ok(ma);

        ma.addText("This is ");
        ma.pushComponent(5);

        test.ok(ma.root.children);
        test.equal(ma.root.children.length, 2);
        test.equal(ma.root.children[0], "This is ");
        test.equal(ma.root.children[1].extra, 5);

        test.done();
    },

    testMessageAccumulatorBuildPushComponentAmongstOthersWithContent: function(test) {
        test.expect(3);

        let ma = new MessageAccumulator();
        test.ok(ma);

        ma.addText("This is ");
        ma.pushComponent(5);
        ma.addText("a test");

        test.ok(ma.root.children);

        test.contains(ma.root.children, [
            "This is ",
            {
                children: [
                    "a test"
                ],
                index: 0,
                extra: 5
            }
        ]);

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
        ma.pushComponent(5);
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
        ma.pushComponent(5);
        ma.addText("a test");
        ma.popComponentOrPlural();
        ma.addText(" of the ");
        ma.pushComponent(4);
        ma.addText("emergency message system");
        ma.popComponentOrPlural();
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
        ma.pushComponent(5);
        ma.addText("a test");
        ma.addText(" of the ");
        ma.pushComponent(4);
        ma.addText("emergency message system");
        ma.popComponentOrPlural();
        ma.addText(".");
        ma.popComponentOrPlural();

        test.ok(ma.root.children);

        test.equal(ma.getString(), "This is <c0>a test of the <c1>emergency message system</c1>.</c0>");

        test.done();
    },

    testMessageAccumulatorGetStringWithOuterComponents: function(test) {
        test.expect(3);

        let ma = new MessageAccumulator();
        test.ok(ma);

        ma.pushComponent();
        ma.addText("This is ");
        ma.pushComponent(5);
        ma.addText("a test");
        ma.addText(" of the ");
        ma.pushComponent(4);
        ma.addText("emergency message system");
        ma.popComponentOrPlural();
        ma.addText(".");
        ma.popComponentOrPlural();
        ma.popComponentOrPlural();

        test.ok(ma.root.children);

        test.equal(ma.getString(), "<c0>This is <c1>a test of the <c2>emergency message system</c2>.</c1></c0>");

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

};