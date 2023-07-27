require("dotenv").config()
const app = require("./app")
const logger = require("./logs/logger")

const port = process.env.PORT || 5643

app.listen(port, () => {
    logger.info(`Server running on port ${port} 🚀🚀`);
});