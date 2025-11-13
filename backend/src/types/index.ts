import { Document, Types } from 'mongoose'

export type ObjectId = Types.ObjectId

export interface IUser extends Document {
  email: string
  passwordHash?: string
  name?: string
  referralCode: string
  credits: number
  firstPurchaseCompleted: boolean
}