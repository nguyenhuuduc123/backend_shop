
const local = {
    db : {
        host : "" || "localhost",
        port : "" || 3005,
        name :"" || "shopDev"
    }
}


const dev = {
    db: {
        host: "" || "localhost",
        port: "" || 3005,
        name: "" || "shopDev"
    }
}


const stage = {
    db: {
        host: "" || "localhost",
        port: "" || 3005,
        name: "" || "shopDev"
    }
}
const export_config = {local,stage,dev}

const config = export_config[process.env.ENV_DEPLOYMENT] || dev 

module.exports = config