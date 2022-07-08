module.exports = function (app) {
  var userHandlers = require("../controller");
  // todoList Routes
  app.route("/profile").post(userHandlers.loginRequired, userHandlers.profile);
  app
    .route("/create-todo-list")
    .post(userHandlers.loginRequired, userHandlers.createTodoApp);
  app.route("/auth/register").post(userHandlers.register);
  app.route("/auth/sign_in").post(userHandlers.sign_in);
};
