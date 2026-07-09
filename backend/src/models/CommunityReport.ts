import mongoose, { Schema, Document } from 'mongoose';

export interface ICommunityReport extends Document {
  reportedStatus: 'OPEN' | 'CLOSED';
  reportedAt: Date;
  ipHash: string;
}

const communityReportSchema = new Schema<ICommunityReport>({
  reportedStatus: {
    type: String,
    enum: ['OPEN', 'CLOSED'],
    required: [true, 'Reported status is required'],
  },
  reportedAt: {
    type: Date,
    default: Date.now,
  },
  ipHash: {
    type: String,
    required: true,
  },
});

communityReportSchema.index({ reportedAt: -1 });

const CommunityReport = mongoose.model<ICommunityReport>('CommunityReport', communityReportSchema);
export default CommunityReport;