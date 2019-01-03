/**
 * message-accumulator.js - accumulate localizable messages
 *
 * @license
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


/**
 * MessageAccumulator.js - accumulate a translatable message as a string
 */
export default class MessageAccumulator {
    /**
     * Create a new accumulator instance.
     * @param {string} type the type of instance to create. Valid values
     * are "plural" for components that contain a set of plural category strings,
     * and "string" for a single string message.
     */
    constructor(type) {
        this.root = {
            children: [],
            parent: null,
            index: 0
        };
        this.currentLevel = this.root;
        this.componentIndex = 0;
        this.text = '';
        if (type === 'plural') {
            this.pluralCategories = {};
        }
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
            ma.root.children = ma._parse(str, (ma && ma.getMapping()) || {});
        }
        return ma;
    }

    /**
     * @private
     */
    _parse(string, mapping) {
        let match,
            re = /(<(c\d+)>.*<\/\2>)/g,
            first = /^<c(\d+)>/;

        const parts = string.split(re);
        let children = [];

        for (var i = 0; i < parts.length; i++) {
            first.lastIndex = 0;
            if ((match = first.exec(parts[i])) !== null) {
                const index = match[1];
                const len = match[0].length;
                // strip off the outer tags before processing the stuff in the middle
                const substr = parts[i].substring(len, parts[i].length - len - 1);
                const component = (mapping && mapping['c' + index]) || {
                    children: [],
                    parent: this.currentLevel,
                    index: index,
                    type: 'component'
                };
                this.currentLevel = component;
                component.children = this._parse(substr, mapping);

                children.push(component);
                i++; // skip the number in the next iteration
            } else if (parts[i] && parts[i].length) {
                // don't store empty strings
                children.push(parts[i]);
            }
        }

        return children.length === 0  ? null : children;
    }

    /**
     * Add text to the current context of the string.
     * @param {string} text the text to add
     */
    addText(text) {
        if (typeof text === 'string') {
            this.currentLevel.children.push(text.replace(/\s+/g, ' '));
        }
        this.text += text;
    }

    /**
     * Add a plural choice context to the current string.
     * @param {string} category the category of the plural
     * @param {Object} extra extra information that the caller would
     * like to associate with the plural. For example, this may
     * be a node in an AST from parsing the original text.
     */
    pushPlural(category, extra) {
        const newNode = {
            children: [],
            parent: this.currentLevel,
            type: 'plural',
            category
        };
        this.currentLevel.children.push(newNode);
        this.currentLevel = newNode;
        this.pluralCategories[category] = newNode;
    }

    /**
     * Create a new subcontext for a component such that all text
     * added to the accumulator goes into the new context.
     * @param {Object} extra extra information that the caller would
     * like to associate with the component. For example, this may
     * be a node in an AST from parsing the original text.
     */
    pushComponent(extra) {
        const newNode = {
            children: [],
            parent: this.currentLevel,
            index: this.componentIndex++,
            type: 'component',
            extra
        };
        this.currentLevel.children.push(newNode);
        this.currentLevel = newNode;
        this.mapping["c" + newNode.index] = extra;
    }

    /**
     * Pop the current context from the stack and return to the previous
     * context. If the current context is already the root, then this
     * represents an unbalanced string.
     */
    popComponentOrPlural() {
        if (!this.currentLevel.parent) {
            // oh oh, unbalanced?
            console.log('Unbalanced component error...'); // eslint-disable-line no-console
        }
        this.currentLevel = this.currentLevel.parent;
    }

    /**
     * @private
     */
    serialize(node) {
        if (typeof node === 'string') {
            return node;
        }

        let ret = '';
        if (node.children) {
            node.children.forEach(subnode => {
                ret += typeof subnode === 'object' ?
                    `<c${subnode.index}>${this.serialize(subnode)}</c${subnode.index}>` :
                    subnode;
            });
        }

        return ret;
    }

    /**
     * @private
     */
    getChoices() {
        // This gets the choices in a standard order so that the resulting string matches
        // what the FormattedCompMessage uses. If the code just relied on serialize() to return
        // the serialized category strings, they would appear in an unspecified order.
        return ['zero', 'one', 'two', 'few', 'many', 'other'].map(
            category => this.pluralCategories[category] ? ` ${category} {${this.serialize(this.pluralCategories[category])}}` : ''
        ).join('');
    }

    /**
     * Return the message accumulated so far, including any components
     * as a string that contains "c" + a number to represent those
     * components.
     *
     * @return {string} the accumulated string so far
     */
    getString() {
        return this.pluralCategories
            ? `{count, plural,${this.getChoices()}}`
            : this.serialize(this.root).trim();
    }

    /**
     * Return the number of characters of text that have been
     * accumulated so far in this accumulator. Components and
     * plurals are left out. Only
     * @return {string} the text accumulated so far
     */
    getTextLength() {
        return this.text.replace(/\s+/g, '').trim();
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
        return this.mapping["c" + componentNumber];
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
