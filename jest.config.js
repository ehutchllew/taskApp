process.env.DB_HOST_URL = "mongodb://127.0.0.1:27017/task-manager-api-test";
process.env.JWT_SECRET_KEY = "somesecretlel";
process.env.PORT = 3001;

module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    verbose: true,
};
