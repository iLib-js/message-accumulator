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
     */
    pushPlural(category) {
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
     */
    pushComponent() {
        const newNode = {
            children: [],
            parent: this.currentLevel,
            index: this.componentIndex++,
            type: 'component'
        };
        this.currentLevel.children.push(newNode);
        this.currentLevel = newNode;
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
                ret +=
                    typeof subnode === 'object'
                        ? `<c${subnode.index}>${this.serialize(subnode)}</c${
                              subnode.index
                          }>`
                        : subnode;
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
        return ['zero', 'one', 'two', 'few', 'many', 'other']
            .map(category =>
                this.pluralCategories[category]
                    ? ` ${category} {${this.serialize(
                          this.pluralCategories[category]
                      )}}`
                    : ''
            )
            .join('');
    }

    /**
     * Return the string accumulated so far, including any components.
     * @return {string} the accumulated string so far
     */
    getString() {
        return this.pluralCategories
            ? `{count, plural,${this.getChoices()}}`
            : this.serialize(this.root).trim();
    }

    /**
     * Return only the text accumulated so far without any components.
     * @return {string} the text accumulated so far
     */
    getText() {
        return this.text.replace(/\s+/g, '').trim();
    }

    /**
     * Return true if the current context is the root of the message.
     * @return {boolean} true if the current context is the root
     */
    isRoot() {
        return this.componentIndex === 0;
    }
}
