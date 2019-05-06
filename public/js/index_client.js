var index = {};

index.methods = {
    init: function () {
        console.log('Listo para iniciar');
    },
    ir: function (url) {
        window.location.href = url;
    }
};

index.methods.init();