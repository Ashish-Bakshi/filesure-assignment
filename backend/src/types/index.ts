import { Document, Types } from 'mongoose'

export type ObjectId = Types.ObjectId

export interface UserTypes extends Document {
  email: string
  password?: string
  name?: string
  referralCode: string
  referredBy?: ObjectId | null
  credits: number
  firstPurchaseCompleted: boolean
}

export interface ReferralTypes extends Document {
  referrerId: ObjectId
  referredId: ObjectId
  status: 'pending' | 'converted'
  convertedAt?: Date
}

export interface PurchaseTypes extends Document {
  userId: ObjectId
  amount: number
  productId?: string
}
