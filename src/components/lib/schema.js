import { z } from "zod";

export const EmailSchema = z.object({
  email: z.string().email(),
});

export const _PersonalSchema = z.object({
  fullName: z.string().min(1, "First Name is required"),
  yearOfBrith: z.coerce
    .number({
      required_error: "Year is required", // Custom error message if the field is missing
      invalid_type_error: "Year must be a number", // Custom error message if the type is wrong
    })
    .int()
    .gte(1900, { message: "Year must be no earlier than 1900" }),
  startOfPlan: z.coerce
    .number({
      required_error: "End of plan is required", // Custom error message if the field is missing
      invalid_type_error: "End of plan must be a number", // Custom error message if the type is wrong
    })
    .int(),
  occupation: z.string().min(1, "Occupation is required"),
  endOfPlan: z.coerce
    .number({
      required_error: "End of plan is required", // Custom error message if the field is missing
      invalid_type_error: "End of plan must be a number", // Custom error message if the type is wrong
    })
    .int(),
});
export const PersonalSchema = _PersonalSchema
  .required()
  .superRefine((data, ctx) => {
    if (data.endOfPlan <= data.startOfPlan) {
      ctx.addIssue({
        path: ["endOfPlan"], // Points to the field that fails the validation
        message: "End of plan must be greater than start of plan",
      });
    }
  });
export const _AssetSchema = z
  .object({
    asset_name: z.string().min(1, "Required"),
    asset_category: z.string(),
    asset_amount: z.coerce.number().positive(),
    asset_interest: z.coerce.number().positive(),
    isLiquid: z.boolean(),
    isNegative: z.boolean(),
  })
  .partial();
export const AssetSchema = _AssetSchema.required({
  asset_name: true,
  asset_amount: true,
});
export const AssetListSchema = z
  .object({
    asset: z.array(AssetSchema),
    liability: z.array(AssetSchema),
  })
  .partial();

export const _LifeSchema = z
  .object({
    name: z.string().min(1, "Required"),
    category: z.string(),
    amount: z.coerce.number().positive(),
    from: z.coerce.number().int().positive(),
    to: z.coerce.number().int().positive(),
    isNegative: z.boolean(),
  })
  .partial();
export const LifeSchema = _LifeSchema.required({
  name: true,
  amount: true,
  from: true,
  to: true,
});
export const LifeListSchema = z.object({ stages: z.array(LifeSchema) });

export const InflationSchema = z.object({
  inflation: z.coerce.number().min(0).max(100),
});
// Revenue
export const predefinedRevenue = [
  {
    heading: "Revenue",
    member: [
      {
        label: "Dependent",
        value: "Dependent",
      },
      {
        label: "Self-employed work",
        value: "Self-employed work",
      },
      {
        label: "Capital Assets",
        value: "Capital Assets",
      },
      {
        label: "Renting and leasing",
        value: "Renting and leasing",
      },
      {
        label: "Commercial enterprise",
        value: "Commercial enterprise",
      },
      {
        label: "Agriculture and forestry",
        value: "Agriculture and forestry",
      },
    ],
  },
];

export const predefinedRevenueMap = getPredefined(
  predefinedRevenue,
  "Revenue",
  {
    Revenue: "Revenue",
    Other: "Other income",
  },
  {}
);

// Issues
export const predefinedIssues = [
  {
    heading: "Issues",
    member: [
      {
        label: "Taxes and duties",
        value: "Taxes and duties",
      },
      {
        label: "Social Security",
        value: "Social Security",
      },
      {
        label: "Consumption of daily life",
        value: "Consumption of daily life",
      },
      {
        label: "Insurance contributions",
        value: "Insurance contributions",
      },
      {
        label: "Maintenance payments",
        value: "Maintenance payments",
      },
      {
        label: "Interest and repayment",
        value: "Interest and repayment",
      },
    ],
  },
];

export const predefinedIssuesMap = getPredefined(
  predefinedIssues,
  "Issues",
  {
    Issues: "Issues",
    Other: "Other expenses",
  },
  {}
);

// Liability
export const predefinedLiability = [
  {
    heading: "Liabilities",
    member: [
      {
        label: "Object-related liabilities",
        value: "Object-related liabilities",
      },
      {
        label: "Non-property-related liabilities",
        value: "Non-property-related liabilities",
      },
    ],
  },
  {
    heading: "Provisions",
    member: [{ label: "Provisions", value: "Provisions" }],
  },
  {
    heading: "Reserved Equity",
    member: [
      {
        label: "Reserved equity for consumption",
        value: "Reserved equity for consumption",
      },
      {
        label: "Reserved equity capital for pension provision",
        value: "Reserved equity capital for pension provision",
      },
    ],
  },
];

export const predefinedLiabilitySchema = getPredefined(
  predefinedLiability,
  "Liability",
  {
    Liabilities: "Liabilities",
    Provisions: "Provisions",
    "Reserved Equity": "Reserved Equity",
    Other: "Free equity",
  },
  { isLiquid: false, isNegative: true }
);

export const predefinedAsset = [
  {
    heading: "Liquid Investments",
    member: [
      { label: "Cashier", value: "cashier" },
      { label: "Shares", value: "shares" },
      { label: "Equity Fund", value: "equity fund" },
      { label: "Pension Fund", value: "pension fund" },
      { label: "Derivatives", value: "derivatives" },
      { label: "Precious Metals", value: "precious metals" },
    ],
  },
  {
    heading: "Real Estate",
    member: [
      { label: "Owner-occupied property", value: "owner-occupied property" },
      {
        label: "Rented residential properties",
        value: "rented residential properties",
      },
      {
        label: "Rented commercial properties",
        value: "rented commercial properties",
      },
      { label: "Undeveloped lots", value: "undeveloped lots" },
      { label: "Closed real estate funds", value: "closed real estate funds" },
      { label: "Open real estate funds", value: "open real estate funds" },
    ],
  },
  {
    heading: "Corporate Holdings",
    member: [
      { label: "Active participations", value: "active participations" },
      {
        label: "Not active participations",
        value: "not active participations",
      },
    ],
  },
];

export const predefinedAssetSchema = getPredefined(
  predefinedAsset,
  "Asset",
  {
    "Liquid Investments": "Liquid assets",
    "Real Estate": "Real Estate",
    "Corporate Holdings": "Corporate Participations",
    Other: "Other assets",
  },
  { isLiquid: false }
);

function getPredefined(predefined, key, catLabel, defaultVal) {
  const predefinedMap = {};
  predefined.forEach((d) => {
    d.member.forEach((e) => (predefinedMap[e.value] = d.heading));
  });
  return {
    key,
    list: predefined,
    lookup: predefinedMap,
    catLabel,
    getCatAsset: function (key) {
      return this.catLabel[this.lookup[key] ?? "Other"];
    },
    default: defaultVal,
  };
}
