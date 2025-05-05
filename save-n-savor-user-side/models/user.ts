import mongoose, { Schema, model, models } from 'mongoose';

const addressSchema = new Schema({
  line1: String,
  city: String,
  state: String,
  zip: String,
}, { _id: false });

const paymentSchema = new Schema({
  cardNumberLast4: String,
  expiry: String,
  nameOnCard: String,
}, { _id: false });

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  addresses: [addressSchema],
  paymentMethods: [paymentSchema],
}, { timestamps: true });

export default models.User || model('User', userSchema);
