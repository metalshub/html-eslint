/**
 * @typedef {import("../types").Rule} Rule
 */

const { RULE_CATEGORY } = require("../constants");
const { NodeUtils } = require("./utils");

const MESSAGE_IDS = {
  MISSING_ATTRS: "missingAttrs",
};

/**
 * @type {Rule}
 */
module.exports = {
  meta: {
    type: "code",

    docs: {
      description: "Avoid unset required attributes",
      category: RULE_CATEGORY.BEST_PRACTICE,
      recommended: false,
    },

    fixable: null,
    schema: [
      {
        type: "object",
        properties: {
          exceptStrings: {
            type: "array",
            items: {
              type: "string",
            },
            specialCharacters: {
              type: "boolean",
            },
          },
        },
      },
    ],
    messages: {
      [MESSAGE_IDS.MISSING_ATTRS]: "This element is detected as text and should have the {{terms}} attributes.",
    },
  },

  create(context) {
    const { exceptString } =
      context.options && context.options.length
        ? context.options[0]
        : {
            exceptString: ["translate", "notranslate"],
          };
    const { specialCharacters } =
      context.options && context.options.length
        ? context.options[0]
        : {
            specialCharacters: false,
          };
    const regex = /\{\{.*\}\}/i; // {{ handlebars }}
    const specialCharactersRegex = /^[^a-z]$/i;
    return {
      "*"(node) {
        if (
          NodeUtils.isTextNode(node) &&
          specialCharacters &&
          specialCharactersRegex.test(node.value.trim())
        ) {
          return;
        }
        if (
          NodeUtils.isTextNode(node) &&
          node.value.trim() &&
          // @ts-ignore
          Array.isArray(node.parent.attrs) &&
          !regex.test(node.value)
        ) {
          // @ts-ignore
          const exceptStringIsPresent = (node.parent.attrs || []).find(
            (attr) => {
              return exceptString.includes(attr.name.toLowerCase());
            }
          );
          if (!exceptStringIsPresent) {
            context.report({
              node,
              data: { terms: exceptString.join("or ") },
              messageId: MESSAGE_IDS.MISSING_ATTRS,
            });
          }
        }
      },
    };
  },
};
