

export default function RegisterComponents(Components) {

    let htags = document.querySelectorAll('span[svelte]');

    for (let i = 0; i < htags.length; i++) {
        const tag = htags[i];
        let name = tag.getAttribute('svelte');

        if (name) {
            let Component = Components[name];

            if (Component) {
                let props = {};

                let attrs = tag.attributes;

                for (let j = 0; j < attrs.length; j++) {
                    let attr = attrs[j];
                    let name = attr.name;

                    if (name.startsWith('svelte-')) {
                        let key = name.substring(7);
                        let value = attr.value;

                        props[key] = value;
                    }
                }

                let component = new Component({
                    target: tag,
                    props: props
                });
            }
        }

    }
}
