module.exports = {
  delete: {
    summary: "Delete user",
    description: "need auth-token, admin",
    responses: {
      204: {
        description: "User deleted"
      },
    },
  }
};
