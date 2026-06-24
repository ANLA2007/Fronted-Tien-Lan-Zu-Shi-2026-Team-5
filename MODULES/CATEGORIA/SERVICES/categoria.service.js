import { get, post, put, patch } from "../../CORE/SERVICES/api.services.js";

const ENDPOINT = "Categories";

export async function obtenerCategorias(pagina = 1, tamanio = 10) {
    return await get(`${ENDPOINT}?PageNumber=${pagina}&PageSize=${tamanio}`);
}

export async function crearCategoria(categoria) {
    return await post(ENDPOINT, categoria);
}

export async function actualizarCategoria(id, categoria) {
    return await put(`${ENDPOINT}/${id}`, categoria);
}

export async function cambiarEstadoCategoria(id) {
    return await patch(`${ENDPOINT}/${id}/state`);
}

export async function buscarCategoriaPorNombre(nombre) {
    return await get(`${ENDPOINT}/byname/${nombre}`);
}