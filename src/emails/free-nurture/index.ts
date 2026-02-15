/**
 * Free User Nurturing Email Sequence
 *
 * 7-email sequence to convert free users to paid Pro subscribers ($59/year)
 *
 * Schedule:
 * - Email 1: Immediate (welcome + first deals)
 * - Email 2: Day 3 (how we find deals)
 * - Email 3: Day 7 (weekly recap + FOMO)
 * - Email 4: Day 10 (the math behind $59/year)
 * - Email 5: Day 14 ($49 discount offer)
 * - Email 6: Day 21 (offer expires tomorrow)
 * - Email 7: Day 30+ (monthly recap, ongoing)
 */

export {
  renderFreeNurtureEmail1,
  freeNurtureEmail1Subject,
} from './FreeNurtureEmail1'

export {
  renderFreeNurtureEmail2,
  freeNurtureEmail2Subject,
} from './FreeNurtureEmail2'

export {
  renderFreeNurtureEmail3,
  freeNurtureEmail3Subject,
} from './FreeNurtureEmail3'

export {
  renderFreeNurtureEmail4,
  freeNurtureEmail4Subject,
} from './FreeNurtureEmail4'

export {
  renderFreeNurtureEmail5,
  freeNurtureEmail5Subject,
} from './FreeNurtureEmail5'

export {
  renderFreeNurtureEmail6,
  freeNurtureEmail6Subject,
} from './FreeNurtureEmail6'

export {
  renderFreeNurtureEmail7,
  freeNurtureEmail7Subject,
} from './FreeNurtureEmail7'

// Email configuration for scheduling
export const FREE_NURTURE_SCHEDULE = [
  { emailNumber: 1, daysSinceSignup: 0, subject: 'Your first deals from New York ✈️' },
  { emailNumber: 2, daysSinceSignup: 3, subject: 'How we find flights 60% cheaper than Google' },
  { emailNumber: 3, daysSinceSignup: 7, subject: 'You saved $577 this week (if you booked)' },
  { emailNumber: 4, daysSinceSignup: 10, subject: 'The math behind $59/year' },
  { emailNumber: 5, daysSinceSignup: 14, subject: '$10 off for free members (this week only)' },
  { emailNumber: 6, daysSinceSignup: 21, subject: 'Your $49 rate expires tomorrow' },
  { emailNumber: 7, daysSinceSignup: 30, subject: 'Your monthly flight deals recap', recurring: true },
] as const
