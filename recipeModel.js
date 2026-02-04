// Simple recipe data model structure.
const recipeModel = {
  name: "string",
  origin: {
    region: "string",
    country: "string",
    city: "string",
    notes: "string",
  },
  ingredients: [
    {
      name: "string",
      quantity: "number",
      unit: "string",
      preparation: "string",
      optional: "boolean",
    },
  ],
  steps: [
    {
      order: "number",
      instruction: "string",
      durationMinutes: "number",
      notes: "string",
    },
  ],
  history: {
    summary: "string",
    sources: ["string"],
    firstRecordedYear: "number",
    culturalContext: "string",
  },
};

// Sample data using the model shape.
const recipes = [
  {
    name: "Herbed Hearth Bread",
    origin: {
      region: "Tuscany",
      country: "Italy",
      city: "Florence",
      notes: "Village hearth bread scented with rosemary.",
    },
    ingredients: [
      { name: "Flour", quantity: 500, unit: "g", preparation: "", optional: false },
      { name: "Warm water", quantity: 320, unit: "ml", preparation: "", optional: false },
      { name: "Olive oil", quantity: 30, unit: "ml", preparation: "", optional: false },
      { name: "Rosemary", quantity: 2, unit: "tsp", preparation: "chopped", optional: false },
      { name: "Sea salt", quantity: 1, unit: "tsp", preparation: "", optional: false },
    ],
    steps: [
      {
        order: 1,
        instruction: "Mix dry ingredients and rosemary.",
        durationMinutes: 5,
        notes: "",
      },
      {
        order: 2,
        instruction: "Add water and oil, then knead until smooth.",
        durationMinutes: 10,
        notes: "",
      },
      {
        order: 3,
        instruction: "Proof for 60 minutes, shape, and bake 25 minutes.",
        durationMinutes: 85,
        notes: "",
      },
    ],
    history: {
      summary:
        "First recorded in 18th-century village kitchens, baked in stone hearths and flavored with local herbs.",
      sources: ["Regional baking journals"],
      firstRecordedYear: 1760,
      culturalContext: "Rural Tuscan hearth cooking.",
    },
  },
  {
    name: "Citrus Hearth Stew",
    origin: {
      region: "Andalusia",
      country: "Spain",
      city: "Seville",
      notes: "A coastal winter staple with bright citrus.",
    },
    ingredients: [
      { name: "Chickpeas", quantity: 300, unit: "g", preparation: "", optional: false },
      { name: "Orange zest", quantity: 1, unit: "tbsp", preparation: "", optional: false },
      { name: "Smoked paprika", quantity: 1, unit: "tsp", preparation: "", optional: false },
      { name: "Tomatoes", quantity: 2, unit: "ea", preparation: "diced", optional: false },
      { name: "Olive oil", quantity: 2, unit: "tbsp", preparation: "", optional: false },
    ],
    steps: [
      {
        order: 1,
        instruction: "Sauté tomatoes and paprika in olive oil.",
        durationMinutes: 8,
        notes: "",
      },
      {
        order: 2,
        instruction: "Add chickpeas and simmer for 25 minutes.",
        durationMinutes: 25,
        notes: "",
      },
      {
        order: 3,
        instruction: "Finish with orange zest and rest 5 minutes.",
        durationMinutes: 5,
        notes: "",
      },
    ],
    history: {
      summary:
        "Reflects the region’s citrus trade and Moorish spice traditions.",
      sources: ["Coastal cookbook notes"],
      firstRecordedYear: 1850,
      culturalContext: "Andalusian coastal kitchens.",
    },
  },
];

module.exports = { recipeModel, recipes };
