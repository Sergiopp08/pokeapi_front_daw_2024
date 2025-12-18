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


    // Test Integración
    test("Muestre el mensaje de Error de la carga", async ()=>{
        global.fetch = vi.fn().mockRejectedValue(new Error("Error API fallida"))
        const wrapper = mount(Home, {
        global: {
            stubs: ['RouterLink']
        }
        })
        await flushPromises()
        expect(wrapper.find(".error-state").exists()).toBe(true)
        expect(wrapper.find(".error-state").text()).toContain("No se pudieron cargar los pokémon. Inténtalo de nuevo más tarde.")
    });

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

   describe('Home.vue', () => {
  test('Cada card recibe props correctas y se renderiza correctamente', async () => {

    // 🧪 Mock de la API
    const mockData = {
      results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }
      ]
    }

    const mockDetail = {
      1: { sprites: { front_default: 'bulbasaur.png' } }
    }

    global.fetch = vi.fn((url) => {
      if (url.includes('/pokemon/?')) {
        return Promise.resolve({
          json: () => Promise.resolve(mockData)
        })
      }

      const id = url.split('/').filter(Boolean).pop()
      return Promise.resolve({
        json: () => Promise.resolve(mockDetail[id])
      })
    })

    // 🔧 Montaje
    const wrapper = mount(Home, {
      global: {
        stubs: {
          RouterLink: {
            template: '<a><slot /></a>'
          }
        }
      }
    })

    await flushPromises()

    // 📦 Componente hijo
    const cards = wrapper.findAllComponents({ name: 'pokemonBoxComponent' })
    expect(cards.length).toBe(1)

    const card = cards[0]

    // ✅ PROPS
    expect(card.props('number')).toBe('1')
    expect(card.props('name')).toBe('bulbasaur')
    expect(card.props('to')).toBe('/pokemon/1')
    expect(card.props('img')).toBe('bulbasaur.png')

    // ✅ TEMPLATE / DOM
    expect(card.find('img').exists()).toBe(true)
    expect(card.find('img').attributes('src')).toBe('bulbasaur.png')
    expect(card.text()).toContain('1 bulbasaur')

    // ✅ RouterLink renderizado
    expect(card.find('a').exists()).toBe(true)
  })
})

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