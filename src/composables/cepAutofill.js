import { useGetAddress } from '@/composables/getAddress'

// fields: { zipCode, street, district, city, state } as refs (vee-validate field values)
// validateField: called with each filled field name, to clear its "required" error
export function useCepAutofill(fields, validateField) {
  let lastCep = ''

  const fillCep = async () => {
    const cep = (fields.zipCode.value || '').replace(/\D/g, '')
    // Only look up a complete CEP, and only once per CEP
    if (cep.length !== 8 || cep === lastCep) return
    lastCep = cep

    const address = await useGetAddress(cep)
    if (!address) return

    const filled = {
      street: address.logradouro,
      district: address.bairro,
      city: address.localidade,
      state: address.uf
    }

    // City-wide CEPs come with an empty street/district: keep what the user typed
    Object.entries(filled).forEach(([name, value]) => {
      if (!value) return
      fields[name].value = value
      validateField(name)
    })
  }

  return { fillCep }
}
