import express from "express";
import httpProxy from "http-proxy";

const app = express();
const port = 3001;
const proxy = httpProxy.createProxyServer();

// Use service names (from docker-compose.yml) instead of localhost
const services = {
	auth: "http://auth:3003", // service name from docker-compose
	blog: "http://blog:3008", // service name from docker-compose
	workspace: "http://workspace:3002", // service name from docker-compose
};

app.use("/api/auth", (req, res) =>
	proxy.web(req, res, { target: services.auth }),
);
app.use("/api/blogs", (req, res) =>
	proxy.web(req, res, { target: services.blog }),
);
app.use("/api/workspace", (req, res) =>
	proxy.web(req, res, { target: services.workspace }),
);

// Add error handling
proxy.on("error", (err, req, res) => {
	console.error("Proxy error:", err);
	res.status(500).json({ error: "Proxy error occurred" });
});

app.listen(port, () => {
	console.log(`Api gateway is running on port http://localhost:${port}`);
});
