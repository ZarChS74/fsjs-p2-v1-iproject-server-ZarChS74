const { PORT, app } = require("./app");



app.listen(PORT, () => {
    console.log(`Connecting to PORT ${PORT}`);
})