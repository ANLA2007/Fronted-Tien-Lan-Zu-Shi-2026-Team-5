import { get, post } from "../../CORE/SERVICES/api.services.js";

const ENDPOINT = "MovementInventory";

export async function obtenerMovimientos(pagina = 1, tamanio = 10) {
    return await get(`${ENDPOINT}?PageNumber=${pagina}&PageSize=${tamanio}`);
}

export async function obtenerMovimientoPorId(id) {
    return await get(`${ENDPOINT}/${id}`);
}

export async function obtenerMovimientosPorTipo(movementType) {
    return await get(`${ENDPOINT}/bymovementtype/${movementType}`);
}

export async function crearAjusteInventario(movimiento) {
    return await post(ENDPOINT, movimiento);
}