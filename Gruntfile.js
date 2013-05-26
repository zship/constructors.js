module.exports = function( grunt ) {

	"use strict";


	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),


		'amd-dist': {
			all: {
				options: {
					standalone: true,
					env: 'browser',
					exports: 'Constructors'
				},
                files: [{
					src: 'src/**/*.js',
					dest: 'dist/browser/Constructors.js'
				}]
			}
		},


		uglify: {
			all: {
				options: {
					banner: '/*! <%= pkg.name%> v<%= pkg.version %> | MIT license */\n'
				},
				files: [{
					src: 'dist/browser/Constructors.js',
					dest: 'dist/browser/Constructors.min.js'
				}]
			}
		},


		jshint: {
			src: {
				options: {
					jshintrc: 'src/.jshintrc'
				},
				files: {
					src: 'src/**/*.js'
				}
			},
			test: {
				options: {
					jshintrc: 'test/unit/.jshintrc'
				},
				files: {
					src: 'test/unit/**/*.js'
				}
			}
		},


		'amd-test': {
			mode: 'qunit',
			files: ['test/lib/es5-shim.js', 'test/unit/**/*.js']
		},


		qunit: {
			all: {
				files: {
					src: 'test/runner.html'
				},
				options: {
					'--web-security': false
					//'--remote-debugger-port': 9222
				}
			}
		},


		connect: {
			test: {
				options: {
					port: 8080,
					base: '.',
					keepalive: true
				}
			}
		},


		'amd-check': {
			files: ['src/**/*.js', 'test/unit/**/*.js']
		},


		nodefy: {
			all: {
				files: [{
					src: 'src/**/*.js',
					dest: 'dist/'
				}]
			}
		},


		copy: {
			publish: {
				files: [
					{
						src: [
							'package.json',
							'README.md'
						],
						dest: 'dist/'
					},
					{
						expand: true,
						cwd: 'src/',
						src: '**/*.js',
						dest: 'dist/amd/'
					}
				]
			}
		},


		clean: {
			publish: {
				files: [{
					src: 'dist/'
				}]
			}
		},


		requirejs: {
			baseUrl: 'src',
			optimize: 'none',
			paths: {
				'mout': '../lib/mout',
				'deferreds': '../lib/deferreds',
				'stacktrace': '../lib/stacktrace/stacktrace'
			},
			shim: {
				'stacktrace': {
					exports: 'printStackTrace'
				}
			},
			keepBuildDir: true,
			locale: "en-us",
			useStrict: false,
			skipModuleInsertion: false,
			findNestedDependencies: false,
			removeCombined: false,
			preserveLicenseComments: false,
			logLevel: 0
		}

	});


	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-nodefy');
	grunt.loadNpmTasks('grunt-amd-dist');
	grunt.loadNpmTasks('grunt-amd-test');
	grunt.loadNpmTasks('grunt-amd-check');

	grunt.registerTask('test', ['amd-test', 'qunit']);
	grunt.registerTask('dist', ['clean:publish', 'nodefy', 'amd-dist', 'uglify', 'copy:publish']);
	grunt.registerTask('build', ['amd-dist', 'uglify']);

};
