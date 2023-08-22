const events: Record<string, string[]> = {
  Registered: [
    "CreateUserDefaultSettings",
    "SendEmailVerificationNotification",
    "SendNewUserJoinedNotificationToAdmins"
  ]
}

export default events;