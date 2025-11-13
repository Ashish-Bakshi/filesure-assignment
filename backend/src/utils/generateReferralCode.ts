import { customAlphabet } from 'nanoid'

const ALPH = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const nano = customAlphabet(ALPH, 8)

export const generateReferralCode = () => nano()
