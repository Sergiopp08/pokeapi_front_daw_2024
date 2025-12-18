import { flushPromises, mount } from '@vue/test-utils'
import { describe,expect,test,vi} from 'vitest'
import Home from '@/views/HomeView.vue';
import { createRouter, createWebHistory } from '@/router/shim';

describe("La vista de HomeView.vue" , () =>{    
    const mockPokemonList = {
    results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
        { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
    ]
    }

    const mockPokemonDetail = {
    1: { sprites: { front_default: 'bulbasaur.png' } },
    2: { sprites: { front_default: 'ivysaur.png' } }
    }

    // Router falso para los tests
    const router = createRouter({
    history: createWebHistory(),
    routes: []
    })

        beforeEach(() => {
        // Mock global de fetch
        global.fetch = vi.fn((url) => {
        if (url.includes('/pokemon/?')) {
            return Promise.resolve({
            json: () => Promise.resolve(mockPokemonList)
            })
        }
        const id = url.split('/').filter(Boolean).pop()
        return Promise.resolve({
            json: () => Promise.resolve(mockPokemonDetail[id])
        })
        })
    })

    // Test Integración
    test('Renderiza las cards con los datos correctos', async () => {
        const wrapper = mount(Home, {
        global: {
            plugins: [router]
        }
        })

        await flushPromises() // Espera a que todos los fetchs terminen

        const cards = wrapper.findAllComponents({ name: 'pokemonBoxComponent' })
        expect(cards).toHaveLength(2)

        expect(cards[0].props('name')).toBe('bulbasaur')
        expect(cards[0].props('img')).toBe('bulbasaur.png')

        expect(cards[1].props('name')).toBe('ivysaur')
        expect(cards[1].props('img')).toBe('ivysaur.png')
    })


    

    // Test Unitario
    test("La carga del imagen de cada card pokemon", async ()=>{
        global.fetch = vi.fn((url) => {
            if (url.includes('/pokemon/?')) {
                return Promise.resolve({ json: () => Promise.resolve(mockPokemonList) });
            }
            const id = url.split('/').filter(Boolean).pop();
            return Promise.resolve({ json: () => Promise.resolve(mockPokemonDetail[id]) });
        });

        const wrapper = mount(Home, {
        global: {
            stubs: ['RouterLink']
        }
        })
        await flushPromises()
        const card = wrapper.findAllComponents({ name: 'pokemonBoxComponent' })
        expect(card[0].props('img')).toBeDefined()
        expect(card[1].props('img')).toBeDefined()
    });

    // Test Unitario
    test("Cada card recibe correctamente las props name, number y to", async () => {
        const mockData ={
            results: [
                { id: 1, name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
            ]
        }
        const mockDetail = {
            1: { sprites: { front_default: 'bulbasaur.png' } }
        };

        global.fetch = vi.fn((url) => {
            if (url.includes('/pokemon/?')) return Promise.resolve({ json: () => Promise.resolve(mockData) });
            const id = url.split('/').filter(Boolean).pop();
            return Promise.resolve({ json: () => Promise.resolve(mockDetail[id]) });
        });


        const wrapper = mount(Home, {
        global: {
            stubs: ['RouterLink']
        }
        })
        await flushPromises()
        const card = wrapper.findAllComponents({ name: 'pokemonBoxComponent' })[0]
        expect(card.props('number')).toBe('1')
        expect(card.props('name')).toBe("bulbasaur")
        expect(card.props('to')).toBe("/pokemon/1")
        expect(card.props('img')).toBeDefined()
        
    });

    // Test Unitario
    test("Muestra mensaje cuando pokemonList está vacío", async () => {
    const wrapper = mount(Home, {
        global: {
            stubs: ['RouterLink']
        },
        data() {
            return { pokemonList: [], isLoading: false, errorMessage: '' }
        }
    })

    // No debe haber cards renderizadas
    const cards = wrapper.findAllComponents({ name: 'pokemonBoxComponent' })
    expect(cards.length).toBe(0)
    })

    // Test Unitario
    test("Renderiza tantas cards como items tiene pokemonList", async () => {
        const mockData ={
            results: [
                { id: 1, name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
                {id: 2, name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
                {id: 3, name: 'Venusaur', url: 'https://pokeapi.co/api/v2/pokemon/3/' }
            ]
        }
        const mockDetail = {
            1: { sprites: { front_default: 'bulbasaur.png' } },
            2: { sprites: { front_default: 'ivysaur.png' } },
            3: { sprites: { front_default: 'venusaur.png' } }
        };

        global.fetch = vi.fn((url) => {
            if (url.includes('/pokemon/?')) return Promise.resolve({ json: () => Promise.resolve(mockData) });
            const id = url.split('/').filter(Boolean).pop();
            return Promise.resolve({ json: () => Promise.resolve(mockDetail[id]) });
        });


        const wrapper = mount(Home, {
        global: {
            stubs: ['RouterLink']
        }
        })
        await flushPromises()
        const cards = wrapper.findAllComponents({ name: 'pokemonBoxComponent' })
        expect(cards).toHaveLength(mockData.results.length)
    });

});