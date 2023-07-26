const twilio = jest.genMockFromModule('twilio');

const verificationCreateMock = jest.fn(() => Promise.resolve({ status: 'pending' }));
const verificationChecksCreateMock = jest.fn(() => Promise.resolve({ valid: true }));

twilio.mockReturnValue({
  verify: {
    v2: {
      services: () => ({
        verifications: {
          create: verificationCreateMock,
        },
        verificationChecks: {
          create: verificationChecksCreateMock,
        },
      }),
    },
  },
});

module.exports = twilio;
