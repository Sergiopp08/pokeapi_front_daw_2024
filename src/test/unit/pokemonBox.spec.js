import { mount,RouterLinkStub  } from '@vue/test-utils'
import { describe,expect,test } from 'vitest'
import pokemonBoxComponent from '@/components/pokemonBoxComponent.vue';

describe("La integracion del componente pokemonBOx" , () =>{
        // Props por defecto
        const defaultProps = {
        name: 'bulbasaur',
        img: 'bulbasaur.png',
        number: 1,
        to: '/pokemon/1'
        };

        // Helper para montar el componente con props por defecto
        const mountComponent = (props = {}) => {
        return mount(pokemonBoxComponent, {
            props: { ...defaultProps, ...props },
            global: { stubs: { RouterLink: RouterLinkStub } }
        });
        };

    // Test Integracion
    test("Que envie correctamente el imagen, name y number to", async ()=>{
        const wrapper = mountComponent();
        expect(wrapper.props('name')).toBe('bulbasaur')
        expect(wrapper.props('img')).toBe('bulbasaur.png')
        expect(wrapper.props('number')).toBe(1)
        expect(wrapper.props('to')).toBe('/pokemon/1')
    });

       // Test Unitario
    test("Renderiza correctamente la imagen (img)", () => {
        const wrapper = mountComponent();
        const img = wrapper.find('img')
        expect(img.exists()).toBe(true)
        expect(img.attributes('src')).toBe('bulbasaur.png')
        expect(img.attributes('alt')).toBe('Imagen de bulbasaur')
    });

    // Test Unitario
    test("Renderiza correctamente el texto name y number", () => {
        const wrapper = mountComponent();
        expect(wrapper.text()).toContain('1 bulbasaur')
    });
});