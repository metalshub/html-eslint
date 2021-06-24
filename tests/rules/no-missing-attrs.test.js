const createRuleTester = require("../rule-tester");
const rule = require("../../lib/rules/no-missing-attrs");

const ruleTester = createRuleTester();

ruleTester.run("id-missing-attrs", rule, {
  valid: [
    {
      code: `<span translate>inside value</span>`,
      options: [{ exceptString: ["translate", "notranslate"] }],
    },
    {
      code: `<span notranslate>inside value</span>`,
    },
    {
      code: `<span>{{variable}}</span>`,
      options: [{ exceptString: ["translate", "notranslate"] }],
    },
    {
      code: `<span class="popup" popup>inside value</span>`,
      options: [{ exceptString: ["popup"] }],
    },
    {
      code: `<td data-cy="table">
        (
      </td>`,
      options: [
        { exceptString: ["translate", "notranslate"], specialCharacters: true },
      ],
    },
    {
      code: `<h4>
            <span class="fa fas fa-user"></span>
            <span translate>Name</span>
            :
      </h4>`,
      options: [
        { exceptString: ["translate", "notranslate"], specialCharacters: true },
      ],
    },
    {
      code: `<div class="order">
        <span translate="true">inside value</span>
      </div>`,
      options: [{ exceptString: ["translate", "notranslate"] }],
    },
  ],
  invalid: [
    {
      code: `<h2 class="contract-header">Contract-Header (submitted)</h2>`,
      options: [
        { exceptString: ["translate", "notranslate"], specialCharacters: true },
      ],
      errors: [
        {
          message: "This element is detected as text and should have the translate or notranslate pipe.",
        },
      ],
    },
    {
      code: `<h1 id="header">inside value</h1>`,
      options: [{ exceptString: ["translate", "notranslate"] }],
      errors: [
        {
          message: "This element is detected as text and should have the translate or notranslate pipe.",
        },
      ],
    },
    {
      code: `<h1>inside value</h1>`,
      options: [{ exceptString: ["popup"] }],
      errors: [
        {
          message: "This element is detected as text and should have the popup pipe.",
        },
      ],
    },
    {
      code: `<div class="order">
        <!-- comment -->
        <h2>inside value</h2>
      </div>`,
      options: [{ exceptString: ["translate", "notranslate"] }],
      errors: [
        {
          message: "This element is detected as text and should have the translate or notranslate pipe.",
        },
      ],
    },
  ],
});
