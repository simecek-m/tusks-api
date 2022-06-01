const NORMALIZED_OUTPUT = {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    delete ret._id;
  },
};

module.exports = { NORMALIZED_OUTPUT };
