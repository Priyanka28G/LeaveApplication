const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    leaveType: {
      type: String,
      required: true,
      enum: ["sick", "casual", "annual"],
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    reason: {
      type: String,
      required: true,
      minlength: 10,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual: number of days
leaveSchema.virtual("totalDays").get(function () {
  if (!this.startDate || !this.endDate) return 0;
  const diff = this.endDate.getTime() - this.startDate.getTime();
  return Math.round(diff / 86400000) + 1;
});

module.exports = mongoose.model("Leave", leaveSchema);
