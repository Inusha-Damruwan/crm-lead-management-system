const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['admin', 'salesperson'],
      default: 'salesperson',
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    userId: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  { timestamps: true }
);

// Generate userId if not present
userSchema.pre('save', async function (next) {
  // Generate userId only on creation
  if (!this.userId && this.isNew) {
    try {
      const rolePrefix = this.role === 'admin' ? 'ADM' : 'SAL';
      const count = await mongoose.model('User').countDocuments({ role: this.role });
      const sequence = String(count + 1).padStart(4, '0');
      this.userId = `${rolePrefix}-${sequence}`;
    } catch (error) {
      return next(error);
    }
  }

  // Hash password if modified
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
