export default {
  methods: ["sms", "call"],
  voice: (otp: number) => `
    <Response>
      <Say>Your verification code is ${otp}</Say>
    </Response>
  `
}