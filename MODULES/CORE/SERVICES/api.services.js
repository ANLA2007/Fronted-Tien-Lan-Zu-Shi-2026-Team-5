const API_URL = "https://localhost:7264/api";

function getToken() {
    return localStorage.getItem("token") || "";
}

function getHeaders() {
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
    };
}

async function manejarRespuesta(response) {
    const body = await response.json().catch(() => null);
    if (!response.ok) {

        if (body?.errors) {
            const mensajes = Object.values(body.errors).flat();
            throw new Error(mensajes[mensajes.length - 1] ?? `Error ${response.status}`);
        }

        
        const mensaje = body?.details?.info ?? body?.Details?.info
                     ?? body?.message ?? body?.Message
                     ?? `Error ${response.status}`;
        throw new Error(mensaje);
    }

    if (body && (body.isSuccess === false || body.IsSuccess === false)) {
        const mensaje = body?.details?.info ?? body?.Details?.info
                     ?? body?.message ?? body?.Message
                     ?? "Ocurrió un error";
        throw new Error(mensaje);
    }

    return body;
}

export async function get(endpoint) {
    const response = await fetch(`${API_URL}/${endpoint}`, { headers: getHeaders() });
    return await manejarRespuesta(response);
}

export async function post(endpoint, data) {
    const response = await fetch(`${API_URL}/${endpoint}`, {
        method: "POST", headers: getHeaders(), body: JSON.stringify(data)
    });
    return await manejarRespuesta(response);
}

export async function put(endpoint, data) {
    const response = await fetch(`${API_URL}/${endpoint}`, {
        method: "PUT", headers: getHeaders(), body: JSON.stringify(data)
    });
    return await manejarRespuesta(response);
}

export async function patch(endpoint) {
    const response = await fetch(`${API_URL}/${endpoint}`, {
        method: "PATCH", headers: getHeaders()
    });
    return await manejarRespuesta(response);
}