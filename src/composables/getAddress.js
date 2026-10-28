// Returns the ViaCEP address, or null when the CEP doesn't exist or the request fails
export async function useGetAddress(cep) {
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
        if (!response.ok) return null

        const data = await response.json()
        // ViaCEP answers 200 with { erro: true } for unknown CEPs
        return data.erro ? null : data
    } catch (error) {
        console.error('Error:', error)
        return null
    }
}
