# Spindly



# svelte app

This is a project template for [Svelte](https://svelte.dev) apps. It lives at https://github.com/sveltejs/template.

To create a new project based on this template using [degit](https://github.com/Rich-Harris/degit):

```bash
npx degit sveltejs/template svelte-app
cd svelte-app
```

*Note that you will need to have [Node.js](https://nodejs.org) installed.*


## Get started

Install the dependencies...

```bash
cd svelte-app
npm install
```

...then start [Rollup](https://rollupjs.org):

```bash
npm run dev
```

Navigate to [localhost:5000](http://localhost:5000). You should see your app running. Edit a component file in `src`, save it, and reload the page to see your changes.

By default, the server will only respond to requests from localhost. To allow connections from other computers, edit the `sirv` commands in package.json to include the option `--host 0.0.0.0`.

If you're using [Visual Studio Code](https://code.visualstudio.com/) we recommend installing the official extension [Svelte for VS Code](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode). If you are using other editors you may need to install a plugin in order to get syntax highlighting and intellisense.

## Building and running in production mode

To create an optimised version of the app:

```bash
npm run build
```

You can run the newly built app with `npm run start`. This uses [sirv](https://github.com/lukeed/sirv), which is included in your package.json's `dependencies` so that the app will work when you deploy to platforms like [Heroku](https://heroku.com).


## Single-page app mode

By default, sirv will only respond to requests that match files in `public`. This is to maximise compatibility with static fileservers, allowing you to deploy your app anywhere.

If you're building a single-page app (SPA) with multiple routes, sirv needs to be able to respond to requests for *any* path. You can make it so by editing the `"start"` command in package.json:

```js
"start": "sirv public --single"
```

## Using TypeScript

This template comes with a script to set up a TypeScript development environment, you can run it immediately after cloning the template with:

```bash
node scripts/setupTypeScript.js
```

Or remove the script via:

```bash
rm scripts/setupTypeScript.js
```

If you want to use `baseUrl` or `path` aliases within your `tsconfig`, you need to set up `@rollup/plugin-alias` to tell Rollup to resolve the aliases. For more info, see [this StackOverflow question](https://stackoverflow.com/questions/63427935/setup-tsconfig-path-in-svelte).

## Deploying to the web

### With [Vercel](https://vercel.com)

Install `vercel` if you haven't already:

```bash
npm install -g vercel
```

Then, from within your project folder:

```bash
cd public
vercel deploy --name my-project
```

### With [surge](https://surge.sh/)

Install `surge` if you haven't already:

```bash
npm install -g surge
```

Then, from within your project folder:

```bash
npm run build
surge public my-project.surge.sh
```


```
{
    "GlobalHub": {
        // File path prefix for js files.
        // For example "storesfolder/file1" becomes "src/storesfolder/file1.spindlystore.js"
        "filepath": "stores/global",
        // Variables that are stored.
        "stores": {
            // Variable name. First letter must be capital, if not it won't be available outside the 'GoStorePackage'
            "AppName": {
                // Variable type : used to determine the type of variable in go code. No effect on javascript code.
                // Can be "string", "int", "bool", "float" or any type/struct name that is defined in go code, that can be serialized to json.
                "type": "string",
                // Go expression that will be evaluated each time the variable is deserialized from json.
                // For example : use "``" for strings, "0" for ints, "MyStruct{}" for structs.
                "template": "``",
                // Go expression that will be evaluated to get the initial value of the variable stored in Go code.
                "default": "`Spindly Sample App`"
            },
            "Version": {
                "type": "string",
                "template": "``"
            }
        },
        // Hub instances that are preconfigured to use this hub template. 
        // These instance names are used to subscribe to the hub from both go and javascript code.
        // First letter must be capital, if not it won't be available outside the 'GoStorePackage'
        // Must be unique from other hub instances and hub names.
        "instances": [
            "Global",
            "Global2"
        ],
```