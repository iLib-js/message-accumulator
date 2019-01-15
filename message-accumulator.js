/**
 * message-accumulator.js - accumulate localizable messages
 *
 * @license
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

import Node from 'ilib-tree-node';

/**
 * MessageAccumulator.js - accumulate a translatable message as a string
 */
export default class MessageAccumulator {
    /**
     * Create a new accumulator instance.
     */
    constructor() {
        this.root = new Node({
            type: "root",
            parent: null,
            index: -1
        });
        this.currentLevel = this.root;
        this.componentIndex = 0;
        this.text = '';
        this.mapping = {};
    }

    /**
     * Factory method to create a new MessageAccumulator instance from
     * the given string and a source message accumulator. This will
     * parse the string and create the equivalent tree from it, and
     * then attach the "extra" information from the source accumulator
     * to the equivalent nodes in the new accumulator.
     *
     * @param {String} translated the translated string to parse
     * @param {MessageAccumulator} source the source message
     * for this translation
     * @returns {MessageAccumulator} a new message accumulator
     * instance equivalent to the given string
     */
    static create(str, source) {
        let ma = new MessageAccumulator();
        if (str) {
            ma._parse(str, (source && source.getMapping()) || {}, ma.root);
        }
        return ma;
    }

    /**
     * @private
     */
    _parse(string, mapping, parent) {
        let match,
            re = /(<(c\d+)>.*<\/\2>)/g,
            first = /^<c(\d+)>/;

        const parts = string.split(re);

        for (var i = 0; i < parts.length; i++) {
            first.lastIndex = 0;
            if ((match = first.exec(parts[i])) !== null) {
                const index = match[1];
                const len = match[0].length;
                // strip off the outer tags before processing the stuff in the middle
                const substr = parts[i].substring(len, parts[i].length - len - 1);
                const component = new Node({
                    type: 'component',
                    parent,
                    index,
                    extra: mapping && mapping[`c${index}`]
                });
                this._parse(substr, mapping, component);

                parent.add(component);
                i++; // skip the number in the next iteration
            } else if (parts[i] && parts[i].length) {
                // don't store empty strings
                parent.add(new Node({
                    type: 'text',
                    value: parts[i]
                }));
            }
        }
    }

    /**
     * Add text to the current context of the string.
     * @param {string} text the text to add
     */
    addText(text) {
        if (typeof text === 'string') {
            this.currentLevel.add(new Node({
                type: 'text',
                value: text
            }));
        }
        this.text += text;
    }

    /**
     * Create a new subcontext for a component such that all text
     * added to the accumulator goes into the new context.
     * @param {Object} extra extra information that the caller would
     * like to associate with the component. For example, this may
     * be a node in an AST from parsing the original text.
     */
    push(extra) {
        const newNode = new Node({
            type: 'component',
            parent: this.currentLevel,
            index: this.componentIndex++,
            extra
        });
        this.currentLevel.add(newNode);
        this.currentLevel = newNode;
        this.mapping[`c${newNode.index}`] = extra;
    }

    /**
     * Pop the current context from the stack and return to the previous
     * context. If the current context is already the root, then this
     * represents an unbalanced string.
     * @returns {Object} the extra information associated with the
     * context that is being popped
     */
    pop() {
        if (!this.currentLevel.parent) {
            // oh oh, unbalanced?
            console.log('Unbalanced component error...'); // eslint-disable-line no-console
        }
        var extra = this.currentLevel.extra;
        this.currentLevel = this.currentLevel.parent;
        return extra;
    }

    /**
     * Return the message accumulated so far, including any components
     * as a string that contains "c" + a number to represent those
     * components.
     *
     * @return {string} the accumulated string so far
     */
    getString() {
        return this.root.toArray().map(node => {
            if (node.use === "start" && node.index > -1) {
                return `<c${node.index}>`;
            } else if (node.use === "end" && node.index > -1) {
                return `</c${node.index}>`;
            } else {
                return node.value;
            }
        }).join('');
    }

    /**
     * Return the number of characters of non-whitespace text that
     * have been accumulated so far in this accumulator. Components
     * are left out.
     * @return {number} the length of the non-whispace text accumulated so far
     */
    getTextLength() {
        return this.text.replace(/\s+/g, '').trim().length;
    }

    /**
     * @private
     * Return the depth of the stack from the given node.
     */
    countCurrentLevel(node) {
        return node.parent ? this.countCurrentLevel(node.parent) + 1 : 0;
    }

    /**
     * Return the current depth of the context stack. If the accumulator is
     * currently at the root, it will return 0.
     * @returns {number} the current depth of the context stack, or 0 if there
     * is nothing on the stack yet
     */
    getCurrentLevel() {
        return this.countCurrentLevel(this.currentLevel);
    }

    /**
     * Return true if the current context is the root of the message.
     * @return {boolean} true if the current context is the root
     */
    isRoot() {
        return this.componentIndex === 0;
    }

    /**
     * Return the mapping between components and the "extra"
     * information used when creating those components.
     *
     * @param {number} componentNumber the number of the
     * component for which the "extra" information is
     * being sought
     * @returns {Object} the "extra" information that was
     * given when the component was created
     */
    getExtra(componentNumber) {
        return this.mapping[`c${componentNumber}`];
    }

    /**
     * Return the mappings between component names and
     * their "extra" information they represent.
     * @returns {Object} the mapping between the
     * component names and their "extra" information.
     */
    getMapping() {
        return this.mapping;
    }
}
