// 7-Day Trial Email Sequence
export {
  TrialDay1Email,
  renderTrialDay1Email,
  trialDay1EmailSubject
} from './TrialDay1Email'

export {
  TrialDay3Email,
  renderTrialDay3Email,
  trialDay3EmailSubject
} from './TrialDay3Email'

export {
  TrialDay5Email,
  renderTrialDay5Email,
  trialDay5EmailSubject
} from './TrialDay5Email'

export {
  TrialDay7Email,
  renderTrialDay7Email,
  trialDay7EmailSubject
} from './TrialDay7Email'

// Email schedule configuration
export const trialEmailSchedule = {
  day1: { dayOffset: 0, subject: '✈️ NYC → Paris $273 (your trial is active!)' },
  day3: { dayOffset: 2, subject: '🔥 How we find flights 60% cheaper' },
  day5: { dayOffset: 4, subject: '⏰ Your trial ends in 2 days' },
  day7: { dayOffset: 6, subject: '🔔 Last day of your free trial' },
}