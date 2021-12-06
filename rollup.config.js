import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';
import SpindlyDev from './spindlydev';
import SpindlyPublish from './spindlypublish';

const production = !process.env.ROLLUP_WATCH;
const GORUN = (process.env.GORUN && process.env.GORUN === '1') || false;

function serve() {
	let gppid;

	function toExit() {
		if (gppid) {
			var kill = require('tree-kill');
			kill(gppid);
		}
	}

	return {
		writeBundle() {
			if (gppid) {
				var kill = require('tree-kill');
				kill(gppid);
				console.log("Restarting Go");
			}

			let server = require('child_process').spawn('go', ["run", "."], {
				stdio: ['ignore', 'inherit', 'inherit'],
				// shell: true,
			});

			gppid = server.pid;

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default {
	input: 'src/main.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'public/build/bundle.js'
	},
	plugins: [
		SpindlyDev(),

		svelte({
			compilerOptions: {
				// enable run-time checks when not in production
				dev: !production
			}
		}),
		// we'll extract any component CSS out into
		// a separate file - better for performance
		css({ output: 'bundle.css' }),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		commonjs(),

		GORUN && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser(),

		production && SpindlyPublish(),

	],
	watch: {
		clearScreen: false,
		exclude: ['src/**/*.spindlyhubs.js', "spindlyapp/**"]
	}
};
