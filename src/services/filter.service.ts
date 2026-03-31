import api from "@/services/api.ts";

export async function getStates() {
    try {
        const response = await api.get("/api/locations/states");
        return response.data.data;
    } catch (error) {
        console.error("Erro ao buscar estados:", error);
        throw error;
    }
}

export async function getCities() {
    try {
        const response = await api.get("/api/locations/cities");
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar cidades:", error);
        throw error;
    }
}

export async function getRegions() {
    try {
        const response = await api.get("/api/locations/regions");
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar regiões:", error);
        throw error;
    }
}

export async function getCounties() {
    try {
        const response = await api.get("/api/locations/counties");
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar condados:", error);
        throw error;
    }
}