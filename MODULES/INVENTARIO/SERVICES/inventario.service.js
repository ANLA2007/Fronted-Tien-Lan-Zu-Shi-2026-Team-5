import { get, post } from "../../CORE/SERVICES/api.services.js";

const ENDPOINT = "Inventories";

export async function obtenerInventarios(pagina = 1, tamanio = 10) {
    return await get(`${ENDPOINT}?PageNumber=${pagina}&PageSize=${tamanio}`);
}

export async function obtenerInventarioPorId(id) {
    return await get(`${ENDPOINT}/${id}`);
}

export async function obtenerInventarioPorProductoYFecha(productId, date) {
    return await get(`${ENDPOINT}/${productId}/${date}`);
}

export async function crearInventario(inventario) {
    return await post(ENDPOINT, inventario);
}