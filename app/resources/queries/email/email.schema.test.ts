import { describe, expect, it } from 'vitest'

import { parseEmailList, sendEmailFormSchema } from './email.schema'

describe('parseEmailList', () => {
  it('trims comma-separated addresses and ignores empty entries', () => {
    expect(parseEmailList(' first@example.com, ,second@example.com  ')).toEqual([
      'first@example.com',
      'second@example.com',
    ])
  })

  it('returns an empty list when no value is supplied', () => {
    expect(parseEmailList()).toEqual([])
  })
})

describe('sendEmailFormSchema', () => {
  it('requires at least one valid recipient', () => {
    expect(sendEmailFormSchema.safeParse({ to: '', template_variables: {} }).success).toBe(false)
    expect(
      sendEmailFormSchema.safeParse({
        to: 'valid@example.com,not-an-email',
        template_variables: {},
      }).success
    ).toBe(false)
  })

  it('accepts valid recipients and optional blank cc/bcc fields', () => {
    expect(
      sendEmailFormSchema.safeParse({
        to: 'first@example.com, second@example.com',
        cc: '',
        bcc: undefined,
        template_variables: {},
      }).success
    ).toBe(true)
  })
})
