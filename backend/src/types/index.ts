import { Document, Types } from 'mongoose'

export type ObjectId = Types.ObjectId

export interface UserTypes extends Document {
  email: string
  password?: string
  name?: string
  referralCode: string
  credits: number
  firstPurchaseCompleted: boolean
}