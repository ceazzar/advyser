import { z } from "zod"

export const supportContactTopics = [
  "consumer_support",
  "adviser_support",
  "media_legal",
  "privacy_request",
  "complaint",
] as const

export type SupportContactTopic = (typeof supportContactTopics)[number]

export const supportTopicMeta: Record<
  SupportContactTopic,
  {
    label: string
    responseWindow: string
    description: string
  }
> = {
  consumer_support: {
    label: "Consumer support",
    responseWindow: "Within 1 business day",
    description: "Help with finding advisers, requests, and account access.",
  },
  adviser_support: {
    label: "Adviser support",
    responseWindow: "Within 2 business days",
    description: "Questions about adviser onboarding or profile management.",
  },
  media_legal: {
    label: "Media / legal",
    responseWindow: "Within 3 business days",
    description: "Press, partnerships, and legal correspondence.",
  },
  privacy_request: {
    label: "Privacy request",
    responseWindow: "Acknowledged in 5 business days",
    description: "Access, correction, or deletion requests under the APPs.",
  },
  complaint: {
    label: "Complaint",
    responseWindow: "Acknowledged in 2 business days",
    description: "Platform or adviser concerns requiring formal review.",
  },
}

export const supportContactSchema = z.object({
  topic: z.enum(supportContactTopics),
  name: z
    .string()
    .trim()
    .max(80, "Name must be 80 characters or fewer.")
    .optional(),
  email: z.string().trim().email("Enter a valid email address.").max(255),
  message: z
    .string()
    .trim()
    .min(20, "Message must be at least 20 characters.")
    .max(2000, "Message must be 2000 characters or fewer."),
  consent: z.boolean().refine((value) => value, {
    message: "You must consent to us handling this request.",
  }),
})

export type SupportContactPayload = z.infer<typeof supportContactSchema>
