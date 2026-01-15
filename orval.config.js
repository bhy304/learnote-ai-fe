module.exports = {
  learnote: {
    input: {
      target: './swagger-spec.json',
      validation: false,
    },
    output: {
      target: './src/api/generated/api.ts',
      schemas: './src/models/generated',
      mode: 'tags-split',
      clean: true,
    },
  },
};
