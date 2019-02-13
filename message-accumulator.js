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

function clone(obj) {
    return Object.assign({}, obj);
}

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
     * @returns {Object|undefined} the extra information associated with the
     * context that is being popped, or undefined if we are already at the
     * root and there is nothing to pop
     */
    pop() {
        if (!this.currentLevel.parent) {
            // oh oh, unbalanced?
            console.log('Unbalanced component error...'); // eslint-disable-line no-console
            return;
        }
        var extra = this.currentLevel.extra;
        this.currentLevel = this.currentLevel.parent;
        return extra;
    }

    /**
     * @private
     */
    _getString(rootnode) {
        if (rootnode.children.length === 0) {
            return rootnode.value || "";
        }
        return rootnode.children.map(child => {
            return child.toArray().map(node => {
                if (node.type === "component") {
                    if (node.index > -1) {
                        if (node.use === "start") {
                            return `<c${node.index}>`;
                        } else if (node.use === "end") {
                            return `</c${node.index}>`;
                        } else {
                            // self-closing
                            return `<c${node.index}></c${node.index}>`;
                        }
                    }
                } else {
                    return node.value;
                }
            }).join('');
        }).join('');
    }

    /**
     * @private
     */
    _isEmpty(node) {
        if (node.type === "text" && node.value.trim() !== "") return false;
        if (node.type === "component" && node.children && node.children.length) {
            return node.children.some(child => {
                return this._isEmpty(child);
            });
        }
        return true;
    }

    /**
     * @private
     */
    _renumber(node) {
        if (node.type === "component") {
            node.index = this.componentIndex++;
            this.mapping[`c${node.index}`] = node.extra;
        }
        if (node.children) {
            node.children.forEach(child => {
                this._renumber(child);
            });
        }
    }

    /**
     * @private
     */
    _minimize() {
        if (this.minimized) return;

        var value, changed = true;

        if (!this.prefixes) this.prefixes = [];
        if (!this.suffixes) this.suffixes = [];

        while (changed && this.root.children && this.root.children.length) {
            changed = false;
            var subroot = this.root;
            while (subroot.children && subroot.children.length === 1 && subroot.children[0].type !== "text") {
                subroot = subroot.children[0];
                value = (subroot.extra && clone(subroot.extra)) || {};
                value.use = "start";
                this.prefixes.push(value);
                value = (subroot.extra && clone(subroot.extra)) || {};
                value.use = "end";
                this.suffixes = [value].concat(this.suffixes);

                changed = true;
            }

            var children = subroot.children;

            // find empty components at the start
            var i = 0;
            while (i < children.length && children[i] && this._isEmpty(children[i])) {
                i++;
                if (children[i].extra) {
                    value = clone(children[i].extra);
                    value.use = "start";
                } else {
                    value = children[i].value;
                }
                this.prefixes.push(value);
                changed = true;
            }

            children = i > 0 ? children.slice(i) : children;

            // then find empty components at the end
            var i = children.length - 1;
            while (i > 0 && children[i] && this._isEmpty(children[i])) {
                i--;
                if (children[i].extra) {
                    value = clone(children[i].extra);
                    value.use = "end";
                } else {
                    value = children[i].value;
                }
                this.suffixes = [value].concat(this.suffixes);
                changed = true;
            }

            // now strip off the leading and trailing whitespace
            if (children.length && children[0].type === "text") {
                var re = /^\s+/;
                var match = re.exec(children[0].value);
                if (match) {
                    children[0].value = children[0].value.substring(match[0].length);
                    this.prefixes.push(match[0]);
                    changed = true;
                }
            }
            var last = children.length-1;
            if (children.length && children[last].type === "text") {
                var re = /\s+$/;
                var match = re.exec(children[last].value);
                if (match) {
                    children[last].value = children[last].value.substring(0, children[last].length - match[0].length);
                    this.suffixes = [match[0]].concat(this.suffixes);
                    changed = true;
                }
            }

            this.root.children = i < children.length - 1 ? children.slice(0, i+1) : children;
            // then do it all again until nothing changes!
        }

        // now walk the tree again and renumber any components so that we don't start at some number greater
        // than zero
        this.componentIndex = 0;
        this.mapping = {};
        this._renumber(this.root);

        this.minimized = true;
    }

    /**
     * Return the message accumulated so far, including any components
     * as a string that contains "c" + a number to represent those
     * components.
     *
     * @return {string} the accumulated string so far
     */
    getString() {
        return this._getString(this.root);
    }

    /**
     * Return all of the irrelevant parts of the string at the beginning
     * of the message.<p>
     *
     * For a minimal string, all of the components that are irrelevant
     * for translation are removed. This method returns all of the irrelevant
     * components and text units that appear at the beginning of the string.
     *
     * @returns {Array.<Object>} an array of "extra" and text units that
     * are irrelevant
     */
    getPrefix() {
        this._minimize();
        return this.prefixes || [];
    }

    /**
     * Return the message accumulated so far as a string, including
     * any components, and leaving out any contexts that are irrelevant
     * for translation purposes. This method is similar to getString()
     * with the irrelevant parts removed. This includes:
     *
     * <ul>
     * <li>Any components that surround the entire message
     * <li>Any components that are at the beginning or end of the message
     * and which do not have any translatable text in them.
     * <li>Any text at the beginning or end of the string that only
     * contains whitespace.
     * </ul>
     *
     * A minimal string must either start with non-whitespace text or end with
     * non-whitespace text or both.<p>
     *
     * After all the irrelevant parts are removed, the remaining components
     * are renumbered so that the first one to appear starts at zero, the
     * second one is one, etc.
     *
     * @return {string} the accumuilated string so far with all irrelevant
     * components removed.
     */
    getMinimalString() {
        this._minimize();
        return this._getString(this.root);
    }

    /**
     * Return all of the irrelevant parts of the string at the end
     * of the message.<p>
     *
     * For a minimal string, all of the components that are irrelevant
     * for translation are removed. This method returns all of the irrelevant
     * components and text units that appear at the end of the string.
     *
     * @returns {Array.<Object>} an array of "extra" and text units that
     * are irrelevant
     */
    getSuffix() {
        this._minimize();
        return this.suffixes || [];
    }

    /**
     * Return the number of characters of non-whitespace text that
     * have been accumulated so far in this accumulator. Components
     * are left out.
     * @return {number} the length of the non-whitespace text accumulated so far
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
