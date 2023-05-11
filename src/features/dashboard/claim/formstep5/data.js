// import { DynamicFieldData } from "./dynamic-control-types";

export const fields = [
  {
    fieldName: "Incident Date",
    inputType: "date",
    label: "Incident Date",
    defaultValue: "",
    config: {
      required: "Required"
    }
  },
  {
    fieldName: "age",
    inputType: "number",
    label: "Age",
    defaultValue: 18,
    config: {
      required: "Required",
      validate: (value) => value >= 18 || "Still a minor"
    }
  },
  {
    fieldName: "language",
    inputType: "select",
    label: "Language",
    options: [
      { value: "english", label: "English" },
      { value: "french", label: "French" }
    ],
    defaultValue: "english"
  },
  {
    fieldName: "address",
    inputType: "text",
    label: "Address",
    defaultValue: ""
  }
];
