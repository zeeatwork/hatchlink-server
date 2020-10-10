const AuthService = require("../auth/auth-service");

function requireAuth(req, res, next) {
  const authToken = req.get("Authorization") || "";

  console.log(authToken, "1st test for token");
  let bearerToken;
  // if (!authToken.toLowerCase().startsWith("Bearer ")) {
  //   console.log(
  //     authToken.toLowerCase().startsWith("Bearer "),
  //     "3rd test for token"
  //   );
  //   return res.status(401).json({ error: "Missing bearer token" });
  // } else {
  //   bearerToken = authToken.slice(7, authToken.length);
  // }
  if (authToken.toLowerCase().startsWith("bearer ") === false) {
    return res.status(401).json({ error: "Missing bearer token" });
  } else {
    bearerToken = authToken.slice(7, authToken.length);
  }
  try {
    const payload = AuthService.verifyJwt(bearerToken);

    AuthService.getUserWithUserName(req.app.get("db"), payload.sub)
      .then((user) => {
        if (!user)
          return res.status(401).json({ error: "Unauthorized request - 1" });
        req.user = user;
        next();
      })
      .catch((err) => {
        console.error(err);
        next(err);
      });
  } catch (error) {
    res.status(401).json({ error: "Unauthorized request - 2" });
  }
}

module.exports = {
  requireAuth,
};
