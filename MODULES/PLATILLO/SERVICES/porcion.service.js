import { get, post, put, patch } from "../../CORE/SERVICES/api.services.js";

const ENDPOINT = "Portion";

export async function obtenerPorciones(pagina = 1, tamanio = 10) {
    return await get(`${ENDPOINT}?PageNumber=${pagina}&PageSize=${tamanio}`);
}

export async function crearPorcion(porcion) {
    return await post(ENDPOINT, porcion);
}

export async function actualizarPorcion(id, porcion) {
    return await put(`${ENDPOINT}/${id}`, porcion);
}

export async function cambiarEstadoPorcion(id, state) {
    return await patch(`${ENDPOINT}/${id}/state?state=${state}`);
}

export async function cambiarReconsumable(id, reconsumable) {
    return await patch(`${ENDPOINT}/${id}/reconsumable?reconsumable=${reconsumable}`);
}

export async function buscarPorcionPorNombre(nombre) {
    return await get(`${ENDPOINT}/byname/${nombre}`);
}