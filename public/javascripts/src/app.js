window.santa = {
    constructors: {},
    models: {},
    views: {}
};

$(document).ready(function(){

    santa.models.santa = new santa.constructors.Santa();
    santa.models.templates = new santa.constructors.Templates();

    santa.constructors.Controller = Backbone.Router.extend({
        routes: {
            "": "container"
        },

        initialize: function(){

        },

        container: function(){
            santa.views.containerView = new santa.constructors.ContainerView();
        }

    });

    $.when(santa.models.templates.getTemplates(), santa.models.santa.getIsMixed()).done(function(){
        santa.controller = new santa.constructors.Controller();
        Backbone.history.start();
    });
});