export const methods = ["sms", "call"];
export const voice = (otp: number) => `
  <Response>
    <Say>Your verification code is ${otp}</Say>
  </Response>
`;