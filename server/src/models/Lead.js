const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    source: {
      type: String,
      enum: [
        'Website',
        'Email',
        'Phone',
        'Referral',
        'Social Media',
        'Trade Show',
        'Other',
      ],
      default: 'Website',
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    status: {
      type: String,
      enum: [
        'New',
        'Contacted',
        'Qualified',
        'Proposal Sent',
        'Won',
        'Lost',
      ],
      default: 'New',
    },

    dealValue: {
      type: Number,
      default: 0,
      min: 0,
    },

    notes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Note',
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Lead', leadSchema);