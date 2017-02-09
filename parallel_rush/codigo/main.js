/*global requirejs*/
'use strict';

requirejs.config({
    baseUrl: "",
    shim : {
        'Phaser': {
            exports: 'Phaser'
        }
    },
    paths: {
        'Phaser': 'phaser'
        //'boot': 'boot',
        //'load': 'load'
    }
});

require(['preloader'], function (preloader) {
    preloader.start();
});