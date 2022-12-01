module.exports = new Object({
    name: "ready",
    once: true,
    /**
     * @param {import("../../Base/Apera")} client 
     */
    async execute(client) {
        client.console.log(`Logged in as ${client.user.tag}`, "api");
    }
})