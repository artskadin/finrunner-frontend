import { z } from 'zod'

export const markupPercentageSchema = z
  .string()
  .refine((value) => {
    const decimalRegex = /^(0|[1-9]\d*)(\.\d+)?$/
    return decimalRegex.test(value)
  })
  .refine((value) => !isNaN(parseFloat(value)), {
    message: 'markupPercentage must be a valid number as a string'
  })
  .refine((value) => parseFloat(value) >= 0, {
    message: 'Markup percentage must be a valid non-negative Decimal'
  })
