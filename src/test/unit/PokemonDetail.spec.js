import { createRouter, createWebHistory } from '@/router/shim';
import PokemonDetail from '@/views/PokemonDetail.vue';
import { flushPromises, mount,RouterLinkStub } from '@vue/test-utils'
import { describe,expect,test,vi } from 'vitest'

describe("La vista de PokemonDetail.vue" , () =>{

    vi.mock('@/router/shim', () => ({
        useRoute: vi.fn(() => ({ value: { params: { id: 1 } } })),
        useRouter: vi.fn(() => ({ push: vi.fn() })),
    }));
        
    const mockPokemonData = {
    name: 'bulbasaur',
    id: 1,
    species: { url: 'https://pokeapi.co/api/v2/pokemon-species/1/' },
    moves: [{ move: { name: 'tackle' } }],
    types: [{ slot: 1, type: { name: 'grass' } }],
    stats: [{ stat: { name: 'hp' }, base_stat: 45 }],
    sprites: {
        front_default: 'front.png',
        back_default: 'back.png',
        other: {
        'official-artwork': { front_default: 'art.png' }
        }
    }
    };

    const mockSpecies = {
        flavor_text_entries: [
        { flavor_text: 'Un pokemon planta', language: { name: 'es' } }
        ]
    };

    beforeEach(() => {
        global.fetch = vi.fn((url) => {
        if (url.includes('pokemon-species')) {
            return Promise.resolve({
            json: () => Promise.resolve(mockSpecies)
            });
        }
        return Promise.resolve({
            json: () => Promise.resolve(mockPokemonData)
        });
        });
    });

    // Test Integración
    test('muestra correctamente la info del pokemon', async () => {

            const wrapper = mount(PokemonDetail);
        await flushPromises() 
        expect(wrapper.text()).toContain('Un pokemon planta');
        
        expect(wrapper.text()).toContain('Bulbasaur');
    });

    // Test Integración
    test("Muestra mensaje de error si falla la carga", async ()=>{
        global.fetch=vi.fn().mockRejectedValue(new Error("Error de carga fallido"))

            const wrapper = mount(PokemonDetail);
        await flushPromises()
        const error= wrapper.find('.loading-state')
        expect(error.exists()).toBe(true)
    });

    // Test Integración
    test("Muestra indicador de carga mientras fetch está activo", async ()=>{
    let resolver;
        global.fetch = vi.fn(() => new Promise(res => { resolver = res; }));

        const wrapper = mount(PokemonDetail);

        // Loading activo antes de resolver fetch
        expect(wrapper.find('.loading-state').exists()).toBe(true);

        resolver({ json: () => Promise.resolve(mockPokemonData) });
        await flushPromises();

        // Loading desaparece después de fetch
        expect(wrapper.find('.loading-state').exists()).toBe(false);
    });
    
    // Test Integración
    test("La carga del imagen del pokemon", async ()=>{

            const wrapper = mount(PokemonDetail);
        await flushPromises();
        const images = wrapper.findAll('img')
        expect(images[0].attributes('src')).toBe('front.png')
        expect(images[1].attributes('src')).toBe('back.png')
        expect(images[2].attributes('src')).toBe('art.png')
    });
    
    // Test Unitario
    test("Imagen trasera solo se renderiza si existe", async () => {
        const data={...mockPokemonData, sprites:{front_default: 'front.png',
            back_default: null
        }}
        global.fetch=vi.fn()
        .mockResolvedValueOnce({json: () =>Promise.resolve(data)})
        .mockResolvedValueOnce({json: () =>Promise.resolve(mockSpecies)})

            const wrapper = mount(PokemonDetail);
        await flushPromises();
        
        const images=wrapper.findAll('img')
        expect(images.some(img=>img.attributes('src') ===null)).toBe(false)
        expect(images[0].attributes('src')).toBe('front.png')
    });

     // Test Unitario
    test("Muestra correctamente los tipos del pokemon", async () => {
   
            const wrapper = mount(PokemonDetail);
        await flushPromises();
        expect(wrapper.text()).toContain('grass')
    });

    // Test Unitario
    test("Muestra correctamente las estadísticas del pokemon", async () => {

            const wrapper = mount(PokemonDetail);
        await flushPromises();
        expect(wrapper.text()).toContain('hp: 45')
    });

    // Test Unitario
    test("Muestra correctamente la lista de movimientos", async () => {
        const wrapper = mount(PokemonDetail);
        await flushPromises();
        expect(wrapper.text()).toContain('tackle')
    });

});


